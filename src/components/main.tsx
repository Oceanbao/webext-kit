import { useReducer } from "react"

import { useStorage } from "@plasmohq/storage/hook"

export function Main() {
  const [openCount] = useStorage<number>("open-count", (storedCount) =>
    typeof storedCount === "undefined" ? 0 : storedCount + 1
  )
  const [checked, setChecked] = useStorage("checked", true)

  const [count, increase] = useReducer((c) => c + 1, 0)

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16
      }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: 16
        }}>
        <p>Times opened: {openCount}</p>
        <input
          type={"checkbox"}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
      </div>
      <button
        onClick={() => increase()}
        type="button"
        className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Count:
        <span className="inline-flex items-center justify-center w-8 h-4 ml-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
          {count}
        </span>
      </button>
    </div>
  )
}
