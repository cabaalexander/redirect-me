import React from 'react'
import Popup from './popup'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './app/store'

const container = document.getElementById('app')
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Popup />
    </Provider>
  </React.StrictMode>
);
