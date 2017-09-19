import { transformToReact } from "./helpers/transform";

describe("react inline extensions", () => {
  test("should add an extension", () =>
    expect(transformToReact("!Icon")).toMatchSnapshot());

  test("should add an extension with an id", () =>
    expect(transformToReact("!Icon{ #my-id }")).toMatchSnapshot());

  test("should add an extension with a class", () =>
    expect(transformToReact("!Icon{ .my-class }")).toMatchSnapshot());

  test("should add an extension with an attribute", () =>
    expect(transformToReact("!Icon{ attr=my-attr }")).toMatchSnapshot());

  test("should add an extension with a quoted attribute", () =>
    expect(transformToReact(`!Icon{ attr="my attribute" }`)).toMatchSnapshot());

  test("should add an extension with a lone attribute", () =>
    expect(transformToReact(`!Icon{ attr }`)).toMatchSnapshot());

  test("should add an extension with a lone attribute with a default value", () =>
    expect(
      transformToReact(`!Icon{ attr }`, {
        elements: {
          Icon: {
            propsDefaultValues: {
              attr: "default"
            }
          }
        }
      })
    ).toMatchSnapshot());

  test("should add an extension with a lone attribute with a default boolean value", () =>
    expect(
      transformToReact(`!Icon{ highlight }`, {
        elements: {
          Icon: {
            propsDefaultValues: {
              highlight: true
            }
          }
        }
      })
    ).toMatchSnapshot());

  test("should add an extension with all types of parameters", () =>
    expect(
      transformToReact(
        `!Icon{ #my-id .my-class attr attr2=my-attr attr3="my attribute" }`,
        {
          elements: {
            Icon: {
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
      transformToReact("!Icon", {
        elements: {
          Icon: {
            html: {
              properties: {
                highlight: true
              }
            }
          }
        }
      })
    ).toMatchSnapshot());

  test("should add an extension with a mapped content", () =>
    expect(
      transformToReact("!Icon[my-tooltip]", {
        elements: {
          Icon: {
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
      transformToReact("!Icon(my-icon)", {
        elements: {
          Icon: {
            html: {
              properties: {
                icon: "::argument::"
              }
            }
          }
        }
      })
    ).toMatchSnapshot());

  test("should work with other markdown", () =>
    expect(
      transformToReact(
        `#heading

!Icon`
      )
    ).toMatchSnapshot());
});

describe("react block extensions", () => {
  test("should add an extension", () =>
    expect(
      transformToReact(
        `Icon:
:::
:::`
      )
    ).toMatchSnapshot());

  test("should add an extension with an id", () =>
    expect(
      transformToReact(
        `Icon:
:::
:::
{ #my-id }`
      )
    ).toMatchSnapshot());

  test("should add an extension with a class", () =>
    expect(
      transformToReact(
        `Icon:
:::
:::
{ .my-class }`
      )
    ).toMatchSnapshot());

  test("should add an extension with an attribute", () =>
    expect(
      transformToReact(
        `Icon:
:::
:::
{ attr=my-attr }`
      )
    ).toMatchSnapshot());

  test("should add an extension with a quoted attribute", () =>
    expect(
      transformToReact(
        `Icon:
:::
:::
{ attr="my attribute" }`
      )
    ).toMatchSnapshot());

  test("should add an extension with a lone attribute", () =>
    expect(
      transformToReact(
        `Icon:
:::
:::
{ attr }`
      )
    ).toMatchSnapshot());

  test("should add an extension with a lone attribute with a default value", () =>
    expect(
      transformToReact(
        `Icon:
:::
:::
{ attr }`,
        {
          elements: {
            Icon: {
              propsDefaultValues: {
                attr: "default"
              }
            }
          }
        }
      )
    ).toMatchSnapshot());

  test("should add an extension with a lone attribute with a default boolean value", () =>
    expect(
      transformToReact(
        `Icon:
:::
:::
{ highlight }`,
        {
          elements: {
            Icon: {
              propsDefaultValues: {
                highlight: true
              }
            }
          }
        }
      )
    ).toMatchSnapshot());

  test("should add an extension with all types of parameters", () =>
    expect(
      transformToReact(
        `Icon:
:::
:::
{ #my-id .my-class attr attr2=my-attr attr3="my attribute" }`,
        {
          elements: {
            Icon: {
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
      transformToReact(
        `Icon:
:::
:::`,
        {
          elements: {
            Icon: {
              html: {
                properties: {
                  highlight: true
                }
              }
            }
          }
        }
      )
    ).toMatchSnapshot());

  test("should add an extension with a mapped content", () =>
    expect(
      transformToReact(
        `Icon:
:::
my-tooltip
:::`,
        {
          elements: {
            Icon: {
              html: {
                properties: {
                  tooltip: "::content::"
                }
              }
            }
          }
        }
      )
    ).toMatchSnapshot());

  test("should add an extension with a mapped argument", () =>
    expect(
      transformToReact(
        `Icon: my-icon
:::
:::`,
        {
          elements: {
            Icon: {
              html: {
                properties: {
                  icon: "::argument::"
                }
              }
            }
          }
        }
      )
    ).toMatchSnapshot());

  test("should work with other markdown", () =>
    expect(
      transformToReact(
        `#heading

Icon:
:::
:::`
      )
    ).toMatchSnapshot());
});
