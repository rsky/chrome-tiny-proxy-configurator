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

  function handlePACScript(options, proxySettings) {
    if (modes.pacScriptUrl.checked) {
      proxySettings.pacScript = {
        url: options.pacUrl,
      }
    }

    if (modes.pacScriptData.checked) {
      proxySettings.pacScript = {
        data: options.pacData
      }
    }

    return true
  }

  function handleFixedServers(options, proxySettings) {
    if (modes.fixedServers.checked) {
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

  function parseProxyRule(urlString) {
    const rule = {}

    // without scheme
    const m = urlString.trim().match(/^([0-9A-Za-z_\-.:]+?)(:[1-9][0-9]*)?$/)
    if (m) {
      rule.host = m[1]
      if (m[2]) {
        rule.port = Math.round(parseInt(m[2].slice(1)))
      }
      return rule
    }

    // with scheme
    try {
      const url = new URL(urlString)
      if (!url.hostname) {
        return null
      }
      rule.host = url.hostname
      if (url.protocol) {
        rule.scheme = url.protocol.slice(0, url.protocol.length - 1)
      }
      if (url.port) {
        rule.port = Math.round(parseInt(url.port))
      }
      return rule
    } catch (e) {
      return null
    }
  }

  function saveAndApply(options, proxySettings) {
    try {
      // configure proxy
      chrome.proxy.settings.set({
        value: proxySettings,
        scope: 'regular',
      }, () => {})

      // save, do not synchronize, use local storage
      chrome.storage.local.set({ options, proxySettings }, () => {})

      return true
    } catch (e) {
      window.alert(e.message)
      return false
    }
  }

  const apply = document.getElementById('apply')
  apply.onclick = ev => {
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
      options[key] = element.value
    })

    handlePACScript(options, proxySettings)

    if (!handleFixedServers(options, proxySettings)) {
      return false
    }

    return saveAndApply(options, proxySettings)
  }
})
