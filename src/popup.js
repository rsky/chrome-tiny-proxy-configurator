document.addEventListener('DOMContentLoaded', () => {
  const mode = document.getElementById('mode')
  const enabled = document.getElementById('enabled')
  const options = document.getElementById('options')

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
      mode.className = 'label label-success'
    } else {
      enabled.checked = false
      mode.className = 'label label-default'
    }
  })

  enabled.onclick = ev => {
    if (ev.target.checked) {
      enableProxyConfig()
      mode.className = 'label label-success'
    } else {
      disableProxyConfig()
      mode.className = 'label label-default'
    }
  }

  options.onclick = ev => chrome.runtime.openOptionsPage()
})
