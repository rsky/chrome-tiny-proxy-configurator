function updateBadgeText(proxyConfig) {
  const text = ({
    direct: 'D',
    auto_detect: 'A',
    pac_script: 'PAC',
    fixed_servers: 'F',
    system: 'S',
  })[proxyConfig.mode] || ''

  chrome.browserAction.setBadgeText({ text })
}
