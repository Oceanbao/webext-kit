import cssText from "data-text:~style.css"
import type { PlasmoContentScript, PlasmoGetStyle } from "plasmo"
import { useEffect, useReducer } from "react"

export const config: PlasmoContentScript = {
  matches: ["https://blank.org/", "https://example.com/"],
  all_frames: true
}

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const handleSendMsg = () => {
  chrome.runtime.sendMessage({ text: "Content script sending message" })
}

const handleOpenURL = () => {
  const url = chrome.runtime.getURL("tabs/delta-flyer.html")
  chrome.runtime.sendMessage({ action: "openurl", url })
}

const PlasmoOverlay = () => {
  console.log("Content script loaded.")

  const [count, increase] = useReducer((c) => c + 1, 0)

  useEffect(() => {
    const onMsg = (msg) => {
      document.body.innerHTML += `<div>${msg.text}</div>`
    }

    console.log("registering onMessage listener")
    chrome.runtime.onMessage.addListener(onMsg)

    return () => {
      chrome.runtime.onMessage.removeListener(onMsg)
    }
  }, [])

  return (
    <div className="flex flex-col p-4 gap-4">
      <button
        onClick={() => increase()}
        type="button"
        className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Count:
        <span className="inline-flex items-center justify-center w-8 h-4 ml-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
          {count}
        </span>
      </button>

      <button
        onClick={handleSendMsg}
        type="button"
        className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Send Message
      </button>

      <button
        onClick={handleOpenURL}
        type="button"
        className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Open /tabs/delta-flyer.html
      </button>
    </div>
  )
}

export default PlasmoOverlay
