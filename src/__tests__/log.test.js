import { transformToLog } from "./helpers/transform";

describe("log", () => {
  test("should show a `no issues found` message", () =>
    expect(transformToLog("!icon")).toMatchSnapshot());

  test("should log information if debug is enabled", () =>
    expect(transformToLog("!icon", { debug: true })).toMatchSnapshot());

  test("should log a warning if there is an invalid property", () =>
    expect(transformToLog("!icon{/foo}")).toMatchSnapshot());
});
