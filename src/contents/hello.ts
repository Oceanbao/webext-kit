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
  console.log(`[content] hello:handlePing - response: ${resp.message}`)
}

handlePing()
