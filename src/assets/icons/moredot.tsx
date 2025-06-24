import * as React from "react"
const SvgComponent = (props:any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="M10.244 6c0-.966.784-1.75 1.75-1.75h.01a1.75 1.75 0 1 1 0 3.5h-.01A1.75 1.75 0 0 1 10.244 6Zm0 12c0-.966.784-1.75 1.75-1.75h.01a1.75 1.75 0 1 1 0 3.5h-.01a1.75 1.75 0 0 1-1.75-1.75Zm1.75-7.75a1.75 1.75 0 1 0 0 3.5h.01a1.75 1.75 0 1 0 0-3.5h-.01Z"
    />
  </svg>
)
export default SvgComponent
