import React from "react"
import Button from "react-toolbox/lib/button/Button"
import Tooltip from "react-toolbox/lib/tooltip"

const TooltipButton = Tooltip(Button)

const TooltipIcon = props => {
  return (
    <TooltipButton { ...props }/>
  )
}

export default TooltipIcon
