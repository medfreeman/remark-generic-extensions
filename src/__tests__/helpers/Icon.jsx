/* eslint-disable no-unused-vars */
import React from "react";
import PropTypes from "prop-types";

const Icon = props => {
  return <icon {...props} />;
};

Icon.propTypes = {
  highlight: PropTypes.bool
};

export default Icon;
