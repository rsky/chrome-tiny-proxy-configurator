import { loadData, saveData, setProxyConfig } from "./common"

document.addEventListener('DOMContentLoaded', () => {
  const modes = {
    direct: document.getElementById('mode_direct'),
    autoDetect: document.getElementById('mode_auto_detect'),
    pacScriptUrl: document.getElementById('mode_pac_script_url'),
    pacScriptData: document.getElementById('mode_pac_script_data'),
    fixedServers: document.getElementById('mode_fixed_servers'),
    system: document.getElementById('mode_system'),
  }

  const inputs = {
    pacUrl: document.getElementById('pac_url'),
    pacData: document.getElementById('pac_data'),
    httpProxy: document.getElementById('http_proxy'),
    httpsProxy: document.getElementById('https_proxy'),
    ftpProxy: document.getElementById('ftp_proxy'),
    bypassList: document.getElementById('bypass_list'),
  }

  const pacData = inputs.pacData
  const pacDrop = document.getElementById('pac_drop')
  const pacFile = document.getElementById('pac_file')
  const handleFileSelect = handleFileSelectFactory(pacData)

  pacData.addEventListener('dragover', handleDragOver, false)
  pacData.addEventListener('drop', handleFileSelect, false)
  pacDrop.addEventListener('dragover', handleDragOver, false)
  pacDrop.addEventListener('drop', handleFileSelect, false)
  pacFile.addEventListener('change', handleFileSelect, false)

  // load data
  loadData(['options'], result => {
    const options = result.options || {}
    const mode = options.mode || 'system'
    if (modes[mode]) {
      modes[mode].checked = true
    }

    Object.entries(inputs).forEach(([key, element]) => {
      element.value = options[key] || ''
    })
  })

  document.getElementById('apply').onclick = ev => {
    ev.preventDefault()

    // 'system' is a fallback
    const options = { mode: 'system' }
    const proxyConfig = { mode: 'system' }

    Object.entries(modes).forEach(([key, element]) => {
      if (element.checked) {
        options.mode = key
        proxyConfig.mode = element.value
      }
    })

    Object.entries(inputs).forEach(([key, element]) => {
      options[key] = element.value.trim()
    })

    handlePACScript(options, proxyConfig)

    if (handleFixedServers(options, proxyConfig)) {
      saveAndApply(options, proxyConfig)
    }
  }
})

export function handlePACScript(options, proxyConfig) {
  if (options.mode === 'pacScriptUrl') {
    proxyConfig.pacScript = {
      url: options.pacUrl,
    }
  }

  if (options.mode === 'pacScriptData') {
    proxyConfig.pacScript = {
      data: options.pacData,
    }
  }

  return true
}

export function handleFixedServers(options, proxyConfig) {
  if (options.mode === 'fixedServers') {
    proxyConfig.rules = {}

    const ruleSet = [
      {
        protocol: 'HTTP',
        key: 'httpProxy',
        ruleKey: 'proxyForHttp',
      },
      {
        protocol: 'HTTPS',
        key: 'httpsProxy',
        ruleKey: 'proxyForHttps',
      },
      {
        protocol: 'FTP',
        key: 'ftpProxy',
        ruleKey: 'proxyForFtp',
      },
    ]

    ruleSet.forEach(({ protocol, key, ruleKey }) => {
      if (options[key]) {
        const rule = parseProxyRule(options[key])
        if (rule) {
          proxyConfig.rules[ruleKey] = rule
        } else {
          window.alert(`${protocol} Proxy's URL is not valid.`)
          return false
        }
      }
    })

    const bypassList = options.bypassList.split(/\s+/).filter(host => host.length > 0)
    if (bypassList.length > 0) {
      proxyConfig.rules.bypassList = bypassList
    }
  }

  return true
}

export function parseProxyRule(urlString) {
  const v4pattern = /^(?:(https?|quic|socks[45]):\/\/)?([\w\-.]+)(?::([1-9]\d*))?$/i
  const v6pattern = /^(?:(https?|quic|socks[45]):\/\/)?\[([\dA-F:]+)\](?::([1-9]\d*))?$/i

  for (const pattern of [v6pattern, v4pattern]) {
    const m = urlString.match(pattern)
    if (m) {
      const rule = { host: m[2].toLowerCase() }
      if (m[1]) {
        rule.scheme = m[1].toLowerCase()
      }
      if (m[3]) {
        rule.port = Math.round(parseInt(m[3]))
      }
      return rule
    }
  }

  return null
}

function saveAndApply(options, proxyConfig) {
  loadData(['options'], ()=> {
    try {
      if (options.enabled !== false) {
        setProxyConfig(proxyConfig)
      }

      saveData({ options, proxyConfig })
    } catch (e) {
      window.alert(e.message)
    }
  })
}

function handleDragOver(ev) {
  ev.stopPropagation()
  ev.preventDefault()
  ev.dataTransfer.dropEffect = 'copy'
}

function handleFileSelectFactory(input) {
  return ev => {
    ev.stopPropagation()
    ev.preventDefault()

    const files = (ev.dataTransfer || ev.target).files
    if (files && files[0]) {
      const reader = new FileReader()
      reader.onload = e => {
        input.value = e.target.result
      }
      reader.readAsText(files[0])
    }
  }
}
