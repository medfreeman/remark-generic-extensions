import React from "react"
import { render } from "react-dom"
import ThemeProvider from "react-toolbox/lib/ThemeProvider"

import markdownToReact from "./markdownToReact"
import theme from "./assets/react-toolbox/theme"
import "./assets/react-toolbox/theme.css"

const content = markdownToReact(
`# Hello

!Icon[add](Add){ floating accent }
!Icon[bookmark](Bookmark){ raised primary label="Bookmark" }`
)

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center",
}

const App = () => (
  <ThemeProvider theme={ theme }>
    <div style={ styles }>
      { content }
    </div>
  </ThemeProvider>
)

render(<App />, document.getElementById('root'))
