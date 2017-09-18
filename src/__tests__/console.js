import test from "ava";
import sinon from "sinon";

import { transformToHtml } from "./helpers/transform";

let originalConsoleError;

test.beforeEach(setup);
test.afterEach(cleanup);

function setup() {
  originalConsoleError = console.error;
  console.error = sinon.spy();
}

function cleanup() {
  console.error = originalConsoleError;
}

test("should not log an error message to console by default", t => {
  transformToHtml("!icon");
  t.true(console.error.callCount === 0);
});

test("should log a console error message when an invalid schema is provided", t => {
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

  t.true(console.error.callCount === 1);
  for (let index = 0; index < console.error.callCount; index++) {
    const args = console.error.getCall(index).args;
    t.snapshot(args.toString());
  }
});

test("should log a console error message when a comment node hasn't a value", t => {
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

  t.true(console.error.callCount === 1);
  for (let index = 0; index < console.error.callCount; index++) {
    const args = console.error.getCall(index).args;
    t.snapshot(args.toString());
  }
});

test("should log a console error message when a text node hasn't a value", t => {
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

  t.true(console.error.callCount === 1);
  for (let index = 0; index < console.error.callCount; index++) {
    const args = console.error.getCall(index).args;
    t.snapshot(args.toString());
  }
});

test("should log a console error message when an element node hasn't a tagName", t => {
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

  t.true(console.error.callCount === 1);
  for (let index = 0; index < console.error.callCount; index++) {
    const args = console.error.getCall(index).args;
    t.snapshot(args.toString());
  }
});

test(
  "should log a console error message " +
    "when an element node has a dashed property",
  t => {
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

    t.true(console.error.callCount === 1);
    for (let index = 0; index < console.error.callCount; index++) {
      const args = console.error.getCall(index).args;
      t.snapshot(args.toString());
    }
  }
);

test(
  "should log a console error message " +
    "when the top-level node has a forbidden property",
  t => {
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

    t.true(console.error.callCount === 1);
    for (let index = 0; index < console.error.callCount; index++) {
      const args = console.error.getCall(index).args;
      t.snapshot(args.toString());
    }
  }
);

test(
  "should log a console error message " +
    "when a children node has a forbidden property",
  t => {
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

    t.true(console.error.callCount === 1);
    for (let index = 0; index < console.error.callCount; index++) {
      const args = console.error.getCall(index).args;
      t.snapshot(args.toString());
    }
  }
);
