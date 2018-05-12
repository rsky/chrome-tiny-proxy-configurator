document.addEventListener('DOMContentLoaded', () => {
  const mode = document.getElementById('mode')
  const onoff = document.getElementById('onoff')
  const toggle = document.getElementById('toggle')
  const enabled = document.getElementById('enabled')
  const options = document.getElementById('options')

  function toggleOn() {
    toggle.className = 'label label-success'
    onoff.textContent = '| ON'
  }

  function toggleOff() {
    toggle.className = 'label label-default'
    onoff.textContent = '| OFF'
  }

  loadData(['options', 'enabled'], result => {
    mode.textContent = ({
      direct: 'Direct',
      autoDetect: 'Auto Detect',
      pacScriptUrl: 'PAC Script',
      pacScriptData: 'PAC Script',
      fixedServers: 'Fixed Servers',
      system: 'System',
    })[(result.options || {}).mode] || 'System'

    if (result.enabled !== false) {
      enabled.checked = true
      toggleOn()
    } else {
      enabled.checked = false
      toggleOff()
    }
  })

  enabled.onclick = ev => {
    if (ev.target.checked) {
      enableProxyConfig()
      toggleOn()
    } else {
      disableProxyConfig()
      toggleOff()
    }
  }

  options.onclick = ev => chrome.runtime.openOptionsPage()
})
