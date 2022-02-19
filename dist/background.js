(() => {
  // src/common.js
  function loadData(keys, callback = null) {
    chrome.storage.local.get(keys, callback || (() => {
    }));
  }
  function setProxyConfig(proxyConfig) {
    chrome.proxy.settings.set({
      value: proxyConfig,
      scope: "regular"
    }, () => updateBadgeText(proxyConfig));
  }
  function updateBadgeText(proxyConfig) {
    if (proxyConfig) {
      const text = {
        direct: "D",
        auto_detect: "A",
        pac_script: "S",
        fixed_servers: "F",
        system: ""
      }[proxyConfig.mode] || "";
      chrome.action.setBadgeText({ text });
      chrome.action.setBadgeBackgroundColor({ color: "#419bf9" });
    } else {
      chrome.action.setBadgeText({ text: "off" });
      chrome.action.setBadgeBackgroundColor({ color: "#777" });
    }
  }

  // src/background.js
  function setUp() {
    loadData(["proxyConfig", "enabled"], (result) => {
      if (result.enabled !== false) {
        setProxyConfig(result.proxyConfig || { mode: "system" });
      }
    });
  }
  chrome.runtime.onStartup.addListener(() => setUp());
  chrome.runtime.onInstalled.addListener(() => setUp());
})();
