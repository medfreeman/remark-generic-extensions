import React from "react"
import Button from "react-toolbox/lib/button/Button"
import Tooltip from "react-toolbox/lib/tooltip/Tooltip"

const TooltipButton = Tooltip(Button)

const styles = {
}

const TooltipIcon = props => {

  const { floating, ...otherProps } = props

  return (
    <TooltipButton style={styles} { ...props }/>
  )
}

export default TooltipIcon
