const url = chrome.extension.getURL('proxy.pac')
chrome.proxy.settings.set(
  {
    value: {
      mode: 'pac_script',
      pacScript: {
        url,
        //mandatory: true,
      },
    },
    scope: 'regular',
  },
  () => {}
)
