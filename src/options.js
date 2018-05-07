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

  // load data
  chrome.storage.local.get(['options'], result => {
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
    const proxySettings = { mode: 'system' }

    Object.entries(modes).forEach(([key, element]) => {
      if (element.checked) {
        options.mode = key
        proxySettings.mode = element.value
      }
    })

    Object.entries(inputs).forEach(([key, element]) => {
      options[key] = element.value.trim()
    })

    handlePACScript(options, proxySettings)

    if (!handleFixedServers(options, proxySettings)) {
      return false
    }

    return saveAndApply(options, proxySettings)
  }
})

export function handlePACScript(options, proxySettings) {
  if (options.mode === 'pacScriptUrl') {
    proxySettings.pacScript = {
      url: options.pacUrl,
    }
  }

  if (options.mode === 'pacScriptData') {
    proxySettings.pacScript = {
      data: options.pacData,
    }
  }

  return true
}

export function handleFixedServers(options, proxySettings) {
  if (options.mode === 'fixedServers') {
    proxySettings.rules = {}

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
          proxySettings.rules[ruleKey] = rule
        } else {
          window.alert(`${protocol} Proxy's URL is not valid.`)
          return false
        }
      }
    })

    const bypassList = options.bypassList.split(/\s+/).filter(host => host.length > 0)
    if (bypassList.length > 0) {
      proxySettings.rules.bypassList = bypassList
    }
  }

  return true
}

export function parseProxyRule(urlString) {
  const rule = {}

  const v4pattern = /^(?:(https?|quic|socks[45]):\/\/)?([0-9A-Za-z_\-.]+)(?::([1-9][0-9]*))?$/i
  const v6pattern = /^(?:(https?|quic|socks[45]):\/\/)?\[([0-9A-Fa-f:]+)](?::([1-9][0-9]*))?$/i

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

function saveAndApply(options, proxySettings) {
  try {
    // configure proxy
    chrome.proxy.settings.set({
      value: proxySettings,
      scope: 'regular',
    }, () => updateBadgeText(proxySettings))

    // save, do not synchronize, use local storage
    chrome.storage.local.set({ options, proxySettings }, () => {})

    return true
  } catch (e) {
    window.alert(e.message)
    return false
  }
}
