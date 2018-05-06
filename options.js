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
    bypassList: document.getElementById('bypass_list'),
  }



  function handlePACScript(options, proxySettings) {
    if (modes.pacScriptUrl.checked) {
      options.pac = 'url'
      proxySettings.pacScript = {
        url: options.pacUrl,
      }
    }

    if (modes.pacScriptData.checked) {
      options.pac = 'data'
      proxySettings.pacScript = {
        data: options.pacData
      }
    }

    return true
  }

  function handleFixedServers(options, proxySettings) {
    if (modes.fixedServers.checked) {
      proxySettings.rules = {}
      if (options.httpProxy) {
        const proxyForHttp = parseProxyRule(options.httpProxy)
        if (proxyForHttp) {
          proxySettings.rules.proxyForHttp = proxyForHttp
        } else {
          window.alert('HTTP Proxy\'s URL is invalid.')
          return false
        }
      }

      if (options.httpsProxy) {
        const proxyForHttps = parseProxyRule(options.httpsProxy)
        if (proxyForHttps) {
          proxySettings.rules.proxyForHttps = proxyForHttps
        } else {
          window.alert('HTTPS Proxy\'s URL is invalid.')
          return false
        }
      }

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
      chrome.storage.local.set({ options, proxySettings })

      return true
    } catch (e) {
      window.alert(e.message)
      return false
    }
  }

  const apply = document.getElementById('apply')
  apply.onclick = ev => {
    ev.preventDefault()

    const options = { pac: null }
    const proxySettings = { mode: 'system' } // 'system' is a fallback

    Object.values(modes).forEach(mode => {
      if (mode.checked) {
        proxySettings.mode = mode.value
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
