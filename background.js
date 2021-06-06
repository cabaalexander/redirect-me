// {{{ init storage

chrome.runtime.onInstalled.addListener(() => {
  console.log('RedirectMe - Extension Started')

  chrome.storage.sync.get(({sources}) => {
    redirectSources(sources)
  })

  chrome.storage.onChanged.addListener((changes, area) => {
    const newData = changes.sources?.newValue
    if (area === 'sync' && newData) {
      redirectSources(newData)
    }
  })
})

// }}}

async function redirectSources(sources) {
  const rules = await getDynamicRules()
  const rulesId = rules.map(r => r.id)

  removeRules(rulesId)

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

  addRules(newRules)
}

// {{{ utils

function addRules(rules=[]) {
  chrome.declarativeNetRequest.updateDynamicRules({addRules: rules})
}

function removeRules(ids=[]) {
  chrome.declarativeNetRequest.updateDynamicRules({removeRuleIds: ids})
}

function activeSources([_, sourceData]) {
  return sourceData.active && (sourceData.from !== '' && sourceData.to !== '')
}

function getDynamicRules() {
  return new Promise((accept) => {
    chrome.declarativeNetRequest.getDynamicRules((rules) => {
      accept(rules)
    })
  })
}

// }}}
