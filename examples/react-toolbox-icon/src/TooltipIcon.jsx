import React from "react"
import PropTypes from "prop-types"
import Button from "react-toolbox/lib/button/Button"
import Tooltip from "react-toolbox/lib/tooltip"

const TooltipButton = Tooltip(Button)

const TooltipIcon = props => {
  /* Mean hack forcing variable coercition
     until https://github.com/mapbox/remark-react/issues/41 is fixed
     https://github.com/mapbox/remark-react/pull/43
     https://github.com/medfreeman/remark-generic-extensions/issues/9
  */
  const { floating, accent, raised, primary, ...otherProps } = props
  otherProps.floating = floating === "true" ? true : false
  otherProps.accent = accent === "true" ? true : false
  otherProps.raised = raised === "true" ? true : false
  otherProps.primary = primary === "true" ? true : false

  return (
    <TooltipButton { ...otherProps }/>
  )
}

TooltipIcon.propTypes = {
  accent: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  icon: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
  floating: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  primary: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  raised: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  tooltip: PropTypes.any.isRequired
}

export default TooltipIcon
