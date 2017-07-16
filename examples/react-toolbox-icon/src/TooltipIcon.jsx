import React from "react"
import PropTypes from "prop-types"
import Button from "react-toolbox/lib/button/Button"
import Tooltip from "react-toolbox/lib/tooltip"

const TooltipButton = Tooltip(Button)

const TooltipIcon = props => {
  return (
    <TooltipButton { ...props }/>
  )
}

TooltipIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  tooltip: PropTypes.any.isRequired,
  floating: PropTypes.bool,
  accent: PropTypes.bool
}

export default TooltipIcon
