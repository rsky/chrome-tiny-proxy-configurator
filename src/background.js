function setUp() {
  chrome.storage.local.get(['proxyConfig'], result => {
    const proxyConfig = result.proxyConfig || { mode: 'system' }
    chrome.proxy.settings.set({
      value: proxyConfig,
      scope: 'regular',
    }, () => updateBadgeText(proxyConfig))
  })
}

chrome.runtime.onStartup.addListener(() => setUp())
chrome.runtime.onInstalled.addListener(details => setUp())
