import { transformToHtml } from "./helpers/transform";

describe("html inline extensions", () => {
  test("should add an extension", () =>
    expect(transformToHtml("!icon")).toMatchSnapshot());

  test("should add an extension with an id", () =>
    expect(transformToHtml("!icon{ #my-id }")).toMatchSnapshot());

  test("should add an extension with a class", () =>
    expect(transformToHtml("!icon{ .my-class }")).toMatchSnapshot());

  test("should add an extension with an attribute", () =>
    expect(transformToHtml("!icon{ attr=my-attr }")).toMatchSnapshot());

  test("should add an extension with a quoted attribute", () =>
    expect(transformToHtml(`!icon{ attr="my attribute" }`)).toMatchSnapshot());

  test("should add an extension with a lone attribute", () =>
    expect(transformToHtml(`!icon{ attr }`)).toMatchSnapshot());

  test("should add an extension with a lone attribute with a default value", () =>
    expect(
      transformToHtml(`!icon{ attr }`, {
        elements: {
          icon: {
            propsDefaultValues: {
              attr: "default"
            }
          }
        }
      })
    ).toMatchSnapshot());

  test("should add an extension with a lone attribute with a default boolean value", () =>
    expect(
      transformToHtml(`!icon{ highlight }`, {
        elements: {
          icon: {
            propsDefaultValues: {
              highlight: true
            }
          }
        }
      })
    ).toMatchSnapshot());

  test("should add an extension with all types of parameters", () =>
    expect(
      transformToHtml(
        `!icon{ #my-id .my-class attr attr2=my-attr attr3="my attribute" }`,
        {
          elements: {
            icon: {
              propsDefaultValues: {
                attr: "default"
              }
            }
          }
        }
      )
    ).toMatchSnapshot());

  test("should add an extension with a boolean property", () =>
    expect(
      transformToHtml("!checkbox", {
        elements: {
          checkbox: {
            html: {
              tagName: "checkbox",
              properties: {
                checked: true
              }
            }
          }
        }
      })
    ).toMatchSnapshot());

  test("should add an extension with a mapped content", () =>
    expect(
      transformToHtml("!icon[my-tooltip]", {
        elements: {
          icon: {
            html: {
              properties: {
                tooltip: "::content::"
              }
            }
          }
        }
      })
    ).toMatchSnapshot());

  test("should add an extension with a mapped argument", () =>
    expect(
      transformToHtml("!icon(my-icon)", {
        elements: {
          icon: {
            html: {
              properties: {
                icon: "::argument::"
              }
            }
          }
        }
      })
    ).toMatchSnapshot());

  test("should work with a different placeholder affix", () =>
    expect(
      transformToHtml("!icon(my-icon)", {
        placeholderAffix: "||",
        elements: {
          icon: {
            html: {
              properties: {
                icon: "||argument||"
              }
            }
          }
        }
      })
    ).toMatchSnapshot());

  test("should add an extension with a replaced tag", () =>
    expect(
      transformToHtml("!icon", {
        elements: {
          icon: {
            html: {
              tagName: "my-icon"
            }
          }
        }
      })
    ).toMatchSnapshot());

  test("should work with other markdown", () =>
    expect(
      transformToHtml(
        `#heading

!icon`
      )
    ).toMatchSnapshot());

  test("should work with an element with multiple children", () =>
    expect(
      transformToHtml("!icon", {
        elements: {
          icon: {
            html: {
              children: [
                {
                  tagName: "p",
                  children: [
                    {
                      type: "text",
                      value: "test"
                    }
                  ]
                }
              ]
            }
          }
        }
      })
    ).toMatchSnapshot());

  test("should work with an element with a mapped property on a child", () =>
    expect(
      transformToHtml("!icon{ #test }", {
        elements: {
          icon: {
            html: {
              children: [
                {
                  tagName: "p",
                  properties: {
                    id: "::prop::id::"
                  }
                }
              ]
            }
          }
        }
      })
    ).toMatchSnapshot());

  test("should work with an element with a mapped content on a child value", () =>
    expect(
      transformToHtml("!icon[my-content]", {
        elements: {
          icon: {
            html: {
              children: [
                {
                  tagName: "p",
                  children: [
                    {
                      type: "text",
                      value: "::content::"
                    }
                  ]
                }
              ]
            }
          }
        }
      })
    ).toMatchSnapshot());

  test("should work with an element with multiple children on the same level", () =>
    expect(
      transformToHtml("!icon", {
        elements: {
          icon: {
            html: {
              children: [
                {
                  tagName: "p",
                  children: [
                    {
                      type: "text",
                      value: "test"
                    }
                  ]
                },
                {
                  tagName: "span",
                  children: [
                    {
                      type: "text",
                      value: "bla"
                    }
                  ]
                }
              ]
            }
          }
        }
      })
    ).toMatchSnapshot());

  test("should work with the example from README", () =>
    expect(
      transformToHtml(
        `# Alpha

!alert[My message!](my subtext is rad){ #my-alert .custom-alert }

## Bravo

## Delta`,
        {
          elements: {
            alert: {
              html: {
                tagName: "span",
                children: [
                  {
                    type: "element",
                    tagName: "i",
                    properties: {
                      className: "fa fa-exclamation",
                      ariaHidden: true
                    }
                  },
                  {
                    type: "element",
                    tagName: "span",
                    children: [
                      {
                        type: "text",
                        value: "::content::"
                      }
                    ]
                  },
                  {
                    type: "element",
                    tagName: "span",
                    properties: {
                      className: "subtext"
                    },
                    children: [
                      {
                        type: "text",
                        value: "::argument::"
                      }
                    ]
                  }
                ]
              }
            }
          }
        }
      )
    ).toMatchSnapshot());
});
