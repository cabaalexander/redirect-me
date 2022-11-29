// {{{ extension installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('RedirectMe - Extension Installed')
})
// }}}

// {{{ listen for storage changes
chrome.storage.sync.get(({sources}) => {
  redirectSources(sources)
})

chrome.storage.onChanged.addListener((changes, area) => {
  const newData = changes.sources?.newValue
  if (area === 'sync' && newData) {
    redirectSources(newData)
  }
})
// }}}

// {{{ redirect sources
async function redirectSources(sources={}) {
  const rules = await getDynamicRules()
  const rulesId = rules.map(r => r.id)

  await removeRules(rulesId)

  const newRules = Object.entries(sources)
    .filter(activeSources)
    .map(([_, sourceData], index) => ({
      id: index + 1,
      priority: 1,
      action: {
        type: 'redirect',
        redirect: {
          regexSubstitution: sourceData.to,
        }
      },
      condition: {
        regexFilter: sourceData.from,
      }
    }))

  await addRules(newRules)
}
// }}}

// {{{ utils
function activeSources([_, sourceData]) {
  return sourceData.active && (sourceData.from !== '' && sourceData.to !== '')
}

function addRules(rules=[]) {
  return new Promise((accept) => {
    chrome.declarativeNetRequest.updateDynamicRules(
      {addRules: rules},
      () => accept(),
    )
  })
}

function removeRules(ids=[]) {
  return new Promise((accept) => {
    chrome.declarativeNetRequest.updateDynamicRules(
      {removeRuleIds: ids},
      () => accept(),
    )
  })
}

function getDynamicRules() {
  return new Promise((accept) => {
    chrome.declarativeNetRequest.getDynamicRules((rules) => {
      accept(rules)
    })
  })
}
// }}}
