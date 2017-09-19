import sinon from "sinon";

import { transformToHtml } from "./helpers/transform";

describe("console", () => {
  let originalConsoleError;

  const setup = () => {
    originalConsoleError = console.error;
    console.error = sinon.spy();
  };

  const cleanup = () => {
    console.error = originalConsoleError;
  };

  beforeEach(setup);

  afterEach(cleanup);

  test("should not log an error message to console by default", () => {
    transformToHtml("!icon");
    expect(console.error.callCount).toBe(0);
  });

  test("should log a console error message when an invalid schema is provided", () => {
    transformToHtml("!icon", {
      elements: {
        icon: {
          html: {
            tagName: "div",
            children: [
              {
                type: "grooow"
              }
            ]
          }
        }
      }
    });

    expect(console.error.callCount).toBe(1);
    for (let index = 0; index < console.error.callCount; index++) {
      const args = console.error.getCall(index).args;
      expect(args.toString()).toMatchSnapshot();
    }
  });

  test("should log a console error message when a comment node hasn't a value", () => {
    transformToHtml("!icon", {
      elements: {
        icon: {
          html: {
            tagName: "div",
            children: [
              {
                type: "comment"
              }
            ]
          }
        }
      }
    });

    expect(console.error.callCount).toBe(1);
    for (let index = 0; index < console.error.callCount; index++) {
      const args = console.error.getCall(index).args;
      expect(args.toString()).toMatchSnapshot();
    }
  });

  test("should log a console error message when a text node hasn't a value", () => {
    transformToHtml("!icon", {
      elements: {
        icon: {
          html: {
            tagName: "div",
            children: [
              {
                type: "text"
              }
            ]
          }
        }
      }
    });

    expect(console.error.callCount).toBe(1);
    for (let index = 0; index < console.error.callCount; index++) {
      const args = console.error.getCall(index).args;
      expect(args.toString()).toMatchSnapshot();
    }
  });

  test("should log a console error message when an element node hasn't a tagName", () => {
    transformToHtml("!icon", {
      elements: {
        icon: {
          html: {
            tagName: "div",
            children: [
              {
                type: "element"
              }
            ]
          }
        }
      }
    });

    expect(console.error.callCount).toBe(1);
    for (let index = 0; index < console.error.callCount; index++) {
      const args = console.error.getCall(index).args;
      expect(args.toString()).toMatchSnapshot();
    }
  });

  test(
    "should log a console error message " +
      "when an element node has a dashed property",
    () => {
      transformToHtml("!icon", {
        elements: {
          icon: {
            html: {
              tagName: "div",
              children: [
                {
                  type: "element",
                  tagName: "div",
                  properties: {
                    "t-a": "huu"
                  }
                }
              ]
            }
          }
        }
      });

      expect(console.error.callCount).toBe(1);
      for (let index = 0; index < console.error.callCount; index++) {
        const args = console.error.getCall(index).args;
        expect(args.toString()).toMatchSnapshot();
      }
    }
  );

  test(
    "should log a console error message " +
      "when the top-level node has a forbidden property",
    () => {
      transformToHtml("!icon", {
        elements: {
          icon: {
            html: {
              tagName: "div",
              properties: {
                class: "foo"
              }
            }
          }
        }
      });

      expect(console.error.callCount).toBe(1);
      for (let index = 0; index < console.error.callCount; index++) {
        const args = console.error.getCall(index).args;
        expect(args.toString()).toMatchSnapshot();
      }
    }
  );

  test(
    "should log a console error message " +
      "when a children node has a forbidden property",
    () => {
      transformToHtml("!icon", {
        elements: {
          icon: {
            html: {
              tagName: "div",
              children: [
                {
                  type: "element",
                  tagName: "div",
                  properties: {
                    class: "foo"
                  }
                }
              ]
            }
          }
        }
      });

      expect(console.error.callCount).toBe(1);
      for (let index = 0; index < console.error.callCount; index++) {
        const args = console.error.getCall(index).args;
        expect(args.toString()).toMatchSnapshot();
      }
    }
  );
});
