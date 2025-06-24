import * as React from "react"
const HorizontaLDots = (props:any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M6 10.245c.966 0 1.75.784 1.75 1.75v.01a1.75 1.75 0 0 1-3.5 0v-.01c0-.966.783-1.75 1.75-1.75Zm12 0c.966 0 1.75.784 1.75 1.75v.01a1.75 1.75 0 1 1-3.5 0v-.01c0-.966.783-1.75 1.75-1.75Zm-4.25 1.75a1.75 1.75 0 1 0-3.5 0v.01a1.75 1.75 0 1 0 3.5 0v-.01Z"
      clipRule="evenodd"
    />
  </svg>
)
export default HorizontaLDots
