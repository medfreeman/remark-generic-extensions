import test from "ava"
import sinon from "sinon"

import { transformToHtml } from "./helpers/transform"

let originalConsoleError

test.beforeEach(setup)
test.afterEach(cleanup)

function setup() {
  originalConsoleError = console.error
  console.error = sinon.spy()
}

function cleanup() {
  console.error = originalConsoleError
}

test(
  "should log an error message to console when an invalid schema is provided",
  t => {
    transformToHtml(
      "!icon",
      {
        elements:
        {
          icon:
          {
            hast:
            {
              tagName: "div",
              children:
              [
                {
                  type: "grooow"
                }
              ]
            }
          }
        }
      }
    )

    t.true(console.error.callCount === 1)
    for (let index = 0; index < console.error.callCount; index++) {
      const args = console.error.getCall(index).args
      t.snapshot(args.toString())
    }
  }
)

test(
  "should not log an error message to console by default",
  t => {
    transformToHtml("!icon")
    t.true(console.error.callCount === 0)
  }
)
