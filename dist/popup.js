(() => {
  // src/common.js
  function saveData(data, callback = null) {
    chrome.storage.local.set(data, callback || (() => {
    }));
  }
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
  function clearProxyConfig() {
    chrome.proxy.settings.clear({
      scope: "regular"
    }, () => updateBadgeText(null));
  }
  function enableProxyConfig() {
    loadData(["proxyConfig"], (result) => {
      setProxyConfig(result.proxyConfig || { mode: "system" });
      saveData({ enabled: true });
    });
  }
  function disableProxyConfig() {
    clearProxyConfig();
    saveData({ enabled: false });
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
      chrome.browserAction.setBadgeText({ text });
      chrome.browserAction.setBadgeBackgroundColor({ color: "#419bf9" });
    } else {
      chrome.browserAction.setBadgeText({ text: "off" });
      chrome.browserAction.setBadgeBackgroundColor({ color: "#777" });
    }
  }

  // src/popup.js
  document.addEventListener("DOMContentLoaded", () => {
    const mode = document.getElementById("mode");
    const onoff = document.getElementById("onoff");
    const toggle = document.getElementById("toggle");
    const enabled = document.getElementById("enabled");
    const options = document.getElementById("options");
    function toggleOn() {
      toggle.className = "label label-success";
      onoff.textContent = "| ON";
    }
    function toggleOff() {
      toggle.className = "label label-default";
      onoff.textContent = "| OFF";
    }
    loadData(["options", "enabled"], (result) => {
      mode.textContent = {
        direct: "Direct",
        autoDetect: "Auto Detect",
        pacScriptUrl: "PAC Script",
        pacScriptData: "PAC Script",
        fixedServers: "Fixed Servers",
        system: "System"
      }[(result.options || {}).mode] || "System";
      if (result.enabled !== false) {
        enabled.checked = true;
        toggleOn();
      } else {
        enabled.checked = false;
        toggleOff();
      }
    });
    enabled.onclick = (ev) => {
      if (ev.target.checked) {
        enableProxyConfig();
        toggleOn();
      } else {
        disableProxyConfig();
        toggleOff();
      }
    };
    options.onclick = () => chrome.runtime.openOptionsPage();
  });
})();
