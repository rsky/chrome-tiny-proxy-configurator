function setUp() {
  chrome.storage.local.get(['proxyConfig'], result => {
    setProxyConfig(result.proxyConfig || { mode: 'system' })
  })
}

chrome.runtime.onStartup.addListener(() => setUp())
chrome.runtime.onInstalled.addListener(details => setUp())
