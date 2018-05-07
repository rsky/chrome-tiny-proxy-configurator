function setUp(arg) {
  chrome.storage.local.get(['proxySettings'], result => {
    const proxySettings = result.proxySettings || { mode: 'system' }
    chrome.proxy.settings.set({
      value: proxySettings,
      scope: 'regular',
    }, () => {})
  })
}

chrome.runtime.onStartup.addListener(() => setUp())
chrome.runtime.onInstalled.addListener(details => setUp())
