import { sendToBackground } from "@plasmohq/messaging"

import type { RequestBody, ResponseBody } from "~background/messages/ping"
import { Main } from "~components/main"

import "~style.css"

const handlePing = () => {
  console.log("[popup] click")

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
      </div>
    </div>
  )
}

export default IndexPopup
