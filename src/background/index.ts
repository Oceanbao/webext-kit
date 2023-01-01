import "@plasmohq/messaging/background"

import windowChanger from "./injected-helper"

const inject = async (tabId) => {
  chrome.scripting.executeScript(
    {
      target: {
        tabId
      },
      world: "MAIN", // MAIN in order to access the window object
      func: windowChanger
    },
    () => {
      console.log("Background script got callback after injection")
    }
  )
}

// Simple example showing how to inject.
// You can inject however you'd like to, doesn't have
// to be with chrome.tabs.onActivated
chrome.tabs.onActivated.addListener((e) => {
  inject(e.tabId)
})

// This runs on every wake up
console.log(`
--------------------------------------------------------
--------------------------------------------------------
          Initialized background script!
--------------------------------------------------------
--------------------------------------------------------
`)

// This runs once on install
chrome.runtime.onInstalled.addListener((details) => {
  console.log("Installed background script!")

  switch (details.reason) {
    case chrome.runtime.OnInstalledReason.INSTALL:
      console.log("This runs when extension newly installed")
      break
    case chrome.runtime.OnInstalledReason.CHROME_UPDATE:
      console.log("This runs when chrome update installs")
      break
    case chrome.runtime.OnInstalledReason.SHARED_MODULE_UPDATE:
      console.log("This runs when shared module update installs")
      break
    case chrome.runtime.OnInstalledReason.UPDATE:
      console.log("This runs when extension update installs")
      break
    default:
      break
  }
})

// Every wakeup event loop runs root level code first
// before events are fired.

chrome.alarms.create("My alarm", { periodInMinutes: 1 })

// Logs every minute
chrome.alarms.onAlarm.addListener((alarmInfo) => {
  console.log(`Alarm fired: ${alarmInfo.name}`)
})

// Logs when tab state changes
chrome.tabs.onUpdated.addListener(() => {
  console.log("Tabs updated")
})

// Logs when C+S+Y typed
chrome.commands.onCommand.addListener((command) => {
  console.log(`Command: ${command}`)
})

// MESSAGE HUB
// -------------------------------------------------
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(
    `[background]: onMessage: msg - ${JSON.stringify(message, null, 4)}`
  )

  if (message.type === "getCurrentTabId") {
    sendResponse({ currentTabId: sender.tab.id })
  }

  if (message.action === "openurl") {
    chrome.tabs.create({ url: message.url })
  }
})

// Fires when content script (or extension process) calls runtime.connect()
chrome.runtime.onConnect.addListener((port) => {
  console.log(`Connected to ${port.name}`)

  // Message from content script
  port.onMessage.addListener((msg) => {
    console.log(
      `(msg from content-script): port.name: ${
        port.name
      } - msg: ${JSON.stringify(msg, null, 4)}`
    )

    // Send back to content script
    port.postMessage({ value: msg.value - 1 })
  })
})

// Sniff web traffic
const filter = {
  url: [
    {
      urlMatches: "https://example.com/"
    }
  ]
}

chrome.webNavigation.onDOMContentLoaded.addListener((details) => {
  console.log(`Loaded ${details.url}!`)
})

chrome.webNavigation.onCompleted.addListener(() => {
  console.log("Visited the special site!")
}, filter)

// Zorbi-style iframe popup
// ------------------------
const injectDOM = () => {
  function addStyle(styleString) {
    const style = document.createElement("style")
    style.textContent = styleString
    document.head.append(style)
  }

  const style = `
  #ocean-extension-root {
    width: 500px;
    height: 100%;
    position: fixed;
    right: -500px;
    top: 0px;
    bottom: 0px;
    z-index: 2147483647;
    box-shadow: rgba(0, 0, 0, 0.62) 0px 0px 5px;
    min-width: 350px;
    max-width: 90vw;
    background-color: rgb(244, 245, 248);
    border-width: 0px;
    transition: all 500ms ease-in-out;
  }

  #ocean-extension-root::before {
    content: "";
    cursor: w-resize;
    height: 100vh;
    width: 5px;
    position: absolute;
    left: -2.5px;
  }

  #extension-frame {
    width: 100%;
    height: 100%;
  }
  `
  addStyle(style)

  const extension = document.querySelector("#ocean-extension-root")

  if (!extension) {
    const url = chrome.runtime.getURL("popup.html")
    document.body.innerHTML += `
<div id="ocean-extension-root" style="height: 100%; max-height: 100vh;">
    <div id="drawer-tooltip"
        style="cursor: pointer; position: absolute; background-color: rgb(63, 63, 70); border-bottom-left-radius: 8px; padding: 4px; left: -40px;">
        <span>X</span>
    </div>
    <iframe src="${url}" id="extension-frame" style="max-height: 100vh;"></iframe>
</div>
`
    let extension = document.querySelector(
      "#ocean-extension-root"
    ) as HTMLDivElement
    setTimeout(() => {
      extension.style.right = "0"
    }, 0)
  } else {
    extension.parentNode.removeChild(extension)
  }
}

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: injectDOM
  })
})
