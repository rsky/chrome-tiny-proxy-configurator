function saveData(data, callback = null) {
  // do not sync, use local storage
  chrome.storage.local.set(data, callback || (() => {}))
}

function loadData(keys, callback = null) {
  chrome.storage.local.get(keys, callback || (() => {}))
}

function setProxyConfig(proxyConfig) {
  chrome.proxy.settings.set({
    value: proxyConfig,
    scope: 'regular',
  }, () => updateBadgeText(proxyConfig))
}

function clearProxyConfig() {
  chrome.proxy.settings.clear({
    scope: 'regular',
  }, () => updateBadgeText(null))
}

function enableProxyConfig() {
  loadData(['proxyConfig'], result => {
    setProxyConfig(result.proxyConfig || { mode: 'system' })
    saveData({ enabled: true })
  })
}

function disableProxyConfig() {
  clearProxyConfig()
  saveData({ enabled: false })
}

function updateBadgeText(proxyConfig) {
  if (proxyConfig) {
    const text = ({
      direct: 'D',
      auto_detect: 'A',
      pac_script: 'S',
      fixed_servers: 'F',
      system: '',
    })[proxyConfig.mode] || ''

    chrome.browserAction.setBadgeText({ text })
    chrome.browserAction.setBadgeBackgroundColor({ color: '#419bf9' })
  } else {
    chrome.browserAction.setBadgeText({ text: 'off' })
    chrome.browserAction.setBadgeBackgroundColor({ color: '#777' })
  }
}
