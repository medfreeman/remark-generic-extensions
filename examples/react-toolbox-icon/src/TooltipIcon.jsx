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
  accent: PropTypes.bool,
  icon: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
  floating: PropTypes.bool,
  primary: PropTypes.bool,
  raised: PropTypes.bool,
  tooltip: PropTypes.any.isRequired
}

export default TooltipIcon
