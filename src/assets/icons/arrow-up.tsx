import * as React from "react"
const SvgComponent = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={13}
    height={12}
    fill="none"
    className="fill-current"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M6.065 1.624a.748.748 0 0 1 .558-.25h.001c.192 0 .384.073.531.22l3 2.998a.75.75 0 1 1-1.06 1.06l-1.722-1.72v6.193a.75.75 0 0 1-1.5 0v-6.19L4.155 5.654a.75.75 0 0 1-1.06-1.061l2.97-2.968Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgComponent
