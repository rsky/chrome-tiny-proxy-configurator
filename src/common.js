function setProxyConfig(proxyConfig) {
  chrome.proxy.settings.set({
    value: proxyConfig,
    scope: 'regular',
  }, () => updateBadgeText(proxyConfig))
}

function updateBadgeText(proxyConfig) {
  const text = ({
    direct: 'D',
    auto_detect: 'A',
    pac_script: 'PAC',
    fixed_servers: 'F',
    system: '',
  })[proxyConfig.mode] || ''

  chrome.browserAction.setBadgeText({ text })
}
