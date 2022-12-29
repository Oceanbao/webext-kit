import type { PlasmoMessaging } from "@plasmohq/messaging"

export type RequestBody = {
  id: number
}

export type ResponseBody = {
  message: string
}

export const handler: PlasmoMessaging.MessageHandler<
  RequestBody,
  ResponseBody
> = async (req, res) => {
  console.log(`[ping]: req.body.id: ${req.body.id}`)

  res.send({
    message: "Hello from ping"
  })
}
