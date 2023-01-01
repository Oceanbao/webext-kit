import { sendToBackground } from "@plasmohq/messaging"

import type { RequestBody, ResponseBody } from "~background/messages/ping"

export {}

console.log("[content] hello: HELLO")

const handlePing = async () => {
  const resp = await sendToBackground<RequestBody, ResponseBody>({
    name: "ping",
    body: {
      id: 111
    }
  })
  console.log(
    `[content] hello:handlePing - response: ${JSON.stringify(resp, null, 4)}`
  )
}

handlePing()

function initializeCountdown(currentTabId: number) {
  // This will fire runtime.onConnect event in background
  const port = chrome.runtime.connect({
    name: `Tab ${currentTabId}`
  })

  // Messages from background
  port.onMessage.addListener((msg) => {
    console.log(
      `[content-script] (msg from background): port.name: ${
        port.name
      } - msg: ${JSON.stringify(msg, null, 4)}`
    )

    // Keep passing value to background while > 0
    if (msg.value > 0) {
      port.postMessage({ value: msg.value })
    }
  })

  setTimeout(() => {
    const value = Math.floor(Math.random() * 10) + 1

    console.log(`New countdown sequence: ${value}`)

    port.postMessage({ value })
  }, 5000)
}

// Send a call/response message to background to set current tab's ID
// This one-time message kicks off the countdown chain
chrome.runtime.sendMessage(
  // Type allows background to filter message
  { type: "getCurrentTabId" },
  // Background can reply to this message with tab ID
  (response) => initializeCountdown(response.currentTabId)
)

// Redit
function setBorderColor(tagName) {
  document.querySelectorAll(tagName).forEach((element) => {
    element.style.border = "1px solid red"
  })
}

chrome.runtime.onMessage.addListener((message) => {
  console.log("[content]: msg: ", JSON.stringify(message))

  if (message.action === "redit") {
    setBorderColor(message.tagName)
  }
})
