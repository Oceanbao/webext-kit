import { sendToBackground } from "@plasmohq/messaging"

import type { RequestBody, ResponseBody } from "~background/messages/ping"
import { Main } from "~components/main"

import "~style.css"

const handlePing = () => {
  sendToBackground<RequestBody, ResponseBody>({
    name: "ping",
    body: {
      id: 333
    }
  })
    .then((res) =>
      chrome.runtime.sendMessage({
        text: `Popup re-sending message (${res.message})`
      })
    )
    .catch((err) => console.log(err))
}

const handleSendMsg = () => {
  chrome.runtime.sendMessage({ text: "Popup messaging" })

  chrome.tabs.query(
    {
      active: true,
      currentWindow: true
    },
    (tabs) => {
      chrome.tabs.sendMessage(tabs[0]?.id, { text: "Popup messaging to tab0" })
    }
  )
}

// Using messaging to delegate DOM action to content-script
const handleColorBorder = () => {
  // Another inject into content script when toolbar clicked
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true
    },
    (tabs) => {
      chrome.tabs.sendMessage(tabs[0]?.id, {
        action: "redit",
        tagName: "div"
      })
    }
  )
}

// 3 Methods of modifying DOM from popup.js to content.js
//
// 1)
// document.getElementById('button').addEventListener('click', function() {
//     chrome.tabs.query({ active: true, currentWindow: true}, function(activeTabs) {
//         // WAY 1
//         chrome.tabs.executeScript(activeTabs[0].id, { code: 'YOUR CODE HERE' });
//     });
// });
//
// 2)
// chrome.tabs.sendMessage(activeTabs[0].id, { action: 'executeCode' });
// // content.js
// chrome.runtime.onMessage.addListener(function(request) {
// if(request.action === 'executeCode') {
//     // YOUR CODE HERE
// }
// });
//
// 3)
// chrome.storage.local.set({ action: 'executeCode' });
// // content.js
// chrome.storage.onChanged.addListener(function(changes) {
//     var action = changes['action'];
//     if(action.newValue === 'executeCode') {
//         // YOUR CODE HERE
//     }
// });

function IndexPopup() {
  return (
    <div className="flex flex-col p-4">
      <Main />
      <div className="grid place-items-center">
        <button
          className="text-white border py-2 px-4 rounded bg-blue-600"
          type="button"
          onClick={handlePing}>
          Send TX
        </button>
        <button
          className="text-white border py-2 px-4 rounded bg-blue-600"
          type="button"
          onClick={handleSendMsg}>
          Send Message
        </button>
        <button
          className="text-white border py-2 px-4 rounded bg-blue-600"
          type="button"
          onClick={handleColorBorder}>
          Redit
        </button>
      </div>
    </div>
  )
}

export default IndexPopup
