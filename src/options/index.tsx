import { useStorage } from "@plasmohq/storage/hook"

import "~style.css"

function IndexOptions() {
  const [openCount] = useStorage<number>("open-count", (storedCount) =>
    typeof storedCount === "undefined" ? 0 : storedCount + 1
  )

  const [checked, _] = useStorage("checked", true)

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16
      }}>
      <p className="text-blue-300 font-bold text-3xl">
        Times opened: {openCount}
      </p>
      <input type={"checkbox"} readOnly checked={checked} />
    </div>
  )
}

export default IndexOptions
