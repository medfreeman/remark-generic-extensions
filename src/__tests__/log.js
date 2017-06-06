import test from "ava"

import { transformToLog } from "./helpers/transform"

test(
  "should show a `no issues found` message",
  t => t.snapshot(transformToLog("!icon"))
)

test(
  "should log information if debug is enabled",
  t => t.snapshot(transformToLog("!icon", { debug: true }))
)

test(
  "should log a warning if there is an invalid property",
  t => t.snapshot(transformToLog("!icon{/foo}"))
)
