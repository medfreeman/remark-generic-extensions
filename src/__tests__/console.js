import test from "ava"
import sinon from "sinon"

import { transformToHtml } from "./helpers/transform"

let originalConsoleLog

test.beforeEach(setup)
test.afterEach(cleanup)

function setup() {
  originalConsoleLog = console.log
  console.log = sinon.spy()
}

function cleanup() {
  console.log = originalConsoleLog
}

test(
  "should log debug messages to console when debug is enabled",
  t => {
    transformToHtml(
      "!icon",
      {
        debug: true
      }
    )
    t.true(console.log.callCount === 10)
    for (let index = 0; index < console.log.callCount; index++) {
      const args = console.log.getCall(index).args
      t.snapshot(args.toString())
    }
  }
)

test(
  "should not log debug messages to console by default",
  t => {
    transformToHtml("!icon")
    t.true(console.log.callCount === 0)
  }
)
