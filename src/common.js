export function saveData(data, callback = null) {
  // do not sync, use local storage
  chrome.storage.local.set(data, callback || (() => {}))
}

export function loadData(keys, callback = null) {
  chrome.storage.local.get(keys, callback || (() => {}))
}

export function setProxyConfig(proxyConfig) {
  chrome.proxy.settings.set({
    value: proxyConfig,
    scope: 'regular',
  }, () => updateBadgeText(proxyConfig))
}

export function clearProxyConfig() {
  chrome.proxy.settings.clear({
    scope: 'regular',
  }, () => updateBadgeText(null))
}

export function enableProxyConfig() {
  loadData(['proxyConfig'], result => {
    setProxyConfig(result.proxyConfig || { mode: 'system' })
    saveData({ enabled: true })
  })
}

export function disableProxyConfig() {
  clearProxyConfig()
  saveData({ enabled: false })
}

export function updateBadgeText(proxyConfig) {
  if (proxyConfig) {
    const text = ({
      direct: 'D',
      auto_detect: 'A',
      pac_script: 'S',
      fixed_servers: 'F',
      system: '',
    })[proxyConfig.mode] || ''

    chrome.action.setBadgeText({ text })
    chrome.action.setBadgeBackgroundColor({ color: '#419bf9' })
  } else {
    chrome.action.setBadgeText({ text: 'off' })
    chrome.action.setBadgeBackgroundColor({ color: '#777' })
  }
}
