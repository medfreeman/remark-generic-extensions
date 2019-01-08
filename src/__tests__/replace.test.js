import { transformToHtml } from "./helpers/transform";

describe("replace inline extension", () => {
  test("should add an extension", () =>
    expect(
      transformToHtml("!icon", {
        elements: {
          icon: {
            replace: function(type) {
              return {
                type,
                data: {
                  hName: "icon",
                  hChildren: [
                    {
                      type: "text",
                      value: "¬|¬"
                    }
                  ],
                  hProperties: {}
                }
              };
            }
          }
        }
      })
    ).toMatchSnapshot());
});

describe("replace block extension", () => {
  test("should add an extension", () =>
    expect(
      transformToHtml(
        `icon:
:::
:::`,
        {
          elements: {
            icon: {
              replace: function(type) {
                return {
                  type,
                  data: {
                    hName: "icon",
                    hChildren: [
                      {
                        type: "text",
                        value: "¬|¬"
                      }
                    ],
                    hProperties: {}
                  }
                };
              }
            }
          }
        }
      )
    ).toMatchSnapshot());
});
