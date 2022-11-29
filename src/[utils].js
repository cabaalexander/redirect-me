const addSourceButton = document.querySelector('.add-source')
const sources = document.querySelector('.sources')

// create source on plus button click
addSourceButton.addEventListener('click', () => createSource())

// {{{ initialize
chrome.storage.sync.get('sources', (sources) => {
  if (Object.keys(sources).length !== 0) return
  chrome.storage.sync.set({sources: {}})
})

// load DOM items in the order they were created
chrome.storage.sync.get(({sources={}}) => {
  Object.entries(sources)
    .sort(([_a, a], [_b, b]) => a.created - b.created)
    .forEach(([key, value]) => {
      createSource(key, value)
    })
})
// }}}

// {{{ create source
function createSource(sourceKey, payload={}) {
  const newId = () => `source-${uuidv4()}`
  const id = sourceKey || newId()

  // {{{ initialize source data
  storageSet((state) => merge(
    state,
    {
      sources: {
        [id]: {
          active: false,
          from: '',
          to: '',
          created: +new Date(),
          ...payload,
        }
      }
    }
  ))

  const sourceDOM = createHtml(sourceTemplate, {
    id,
    from: payload.from,
    to: payload.to,
    active: payload.active ? 'checked' : '',
  })
  // }}}

  // {{{ delete handler
  sourceDOM.querySelector('.recycle-bin-icon').addEventListener('click', () => {
    // remove DOM element
    document.querySelector(`.${id}`).remove()
    // remove storage data
    storageSet((state) => {
      delete state.sources[id]
      return state
    })
  })
  // }}}

  // {{{ inputs handler
  const inputHandler = ({target}) => {
    const {value} = target
    const {type} = target.dataset
    storageSet((state) => merge(
      state,
      {
        sources: {
          [id]: { [type]: value }
        }
      }
    ))
  }
  sourceDOM.querySelector('.from input').addEventListener('keyup', inputHandler)
  sourceDOM.querySelector('.to input').addEventListener('keyup', inputHandler)
  // }}}

  // {{{ checkbox handler
  sourceDOM.querySelector('.source .check input')
    .addEventListener('click', () => {
      storageSet((state) => merge(
        state,
        {
          sources: {
            [id]: {
              active: !state.sources[id].active,
            }
          }
        }
      ))
    })
  // }}}

  // {{{ duplicate handler
  sourceDOM.querySelector('.duplicate-icon')
    .addEventListener('click', () => {
      chrome.storage.sync.get(({sources}) => {
        const currentSource = sources[id]
        createSource(newId(), {
          ...currentSource,
          created: +new Date(),
        })
      })
    })
  // }}}

  // set created source into the DOM
  sources.appendChild(sourceDOM)
}
// }}}

// {{{ utils
function merge(firstObj, secondObj) {
  // copy objects to prevent any modifications by reference
  const baseObj = {...firstObj}
  const targetObj = {...secondObj}
  // recursive function to set all needed properties
  const loopThroughKeys = (loopBase, loopTarget) => {
    Object.entries(loopTarget).forEach(([key, value]) => {
      // if is object do recursive stuffs
      if (typeof value === 'object' && !Array.isArray(value)) {
        // if object if empty set it as empty on base
        if (Object.keys(value).length === 0) {
          loopBase[key] = {}
          delete loopTarget[key]
        } else {
          // don't let any key to be undefined (initialize it as empty object)
          loopBase[key] = loopBase[key] || {}
          loopThroughKeys(loopBase[key], value)
        }
      } else {
        loopBase[key] = value
        delete loopTarget[key]
      }
    })
  }
  // do the work
  loopThroughKeys(baseObj, targetObj)
  // return the modified object
  return baseObj
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function storageSet (setCallback=() => {}, done=() => {}) {
  chrome.storage.sync.get((storageData) => {
    chrome.storage.sync.set(setCallback(storageData), () => {
      chrome.storage.sync.get((data) => done(data))
    })
  })
}

function createHtml (stringHTML, data) {
  let temp = document.createElement('template')
  temp.innerHTML = stringHTML.replace(/{(.+)}/g, (_, key) => data[key] || '')
  return temp.content
}
// }}}

// {{{ template
const sourceTemplate = `
  <div class="source {id}">
    <div class="check">
      <input type="checkbox" {active}>
    </div>

    <div class="panel">
      <div class="left">
        <div class="from">
          <label for="from">From:</label>
          <br>
          <input
            type="text"
            id="from"
            placeholder="Base Source"
            value="{from}"
            data-type="from"
          >
        </div>

        <div class="to">
          <label for="to">To:</label>
          <br>
          <input
            type="text"
            id="to"
            placeholder="Destination Source"
            value="{to}"
            data-type="to"
          >
        </div>
      </div>

      <div class="right">
        <div class="tooltip duplicate-icon">
          <img
            src="/assets//duplicate-icon.png"
            alt="duplicate icon"
          >

          <span class="tooltiptext">Duplicate this source</span>
        </div>

        <div class="tooltip recycle-bin-icon">
          <img
            src="/assets/recycle-bin-icon.png"
            alt="recycle bin"
          >

          <span class="tooltiptext">Delete this source</span>
        </div>
      </div>
    </div>
  </div>
`
// }}}
