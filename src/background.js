import { loadData, setProxyConfig } from "./common"

function setUp() {
  loadData(['proxyConfig', 'enabled'], result => {
    if (result.enabled !== false) {
      setProxyConfig(result.proxyConfig || { mode: 'system' })
    }
  })
}

chrome.runtime.onStartup.addListener(() => setUp())
chrome.runtime.onInstalled.addListener(() => setUp())
