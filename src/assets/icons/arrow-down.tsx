import * as React from "react"
const SvgComponent = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    className="fill-current"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M5.315 10.376c.137.153.336.25.558.25h.001a.748.748 0 0 0 .531-.22l3-2.998a.75.75 0 1 0-1.06-1.06l-1.722 1.72V1.875a.75.75 0 1 0-1.5 0v6.19L3.405 6.346a.75.75 0 0 0-1.06 1.061l2.97 2.968Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgComponent
