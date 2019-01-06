import { transformToVue } from "./helpers/transform";

describe("vue inline extensions", () => {
  test("should add an extension", async () =>
    expect(await transformToVue("!Icon")).toMatchSnapshot());

  test("should add an extension with an id", async () =>
    expect(await transformToVue("!Icon{ #my-id }")).toMatchSnapshot());

  test("should add an extension with a class", async () =>
    expect(await transformToVue("!Icon{ .my-class }")).toMatchSnapshot());

  test("should add an extension with an attribute", async () =>
    expect(await transformToVue("!Icon{ attr=my-attr }")).toMatchSnapshot());

  test("should add an extension with a quoted attribute", async () =>
    expect(
      await transformToVue(`!Icon{ attr="my attribute" }`)
    ).toMatchSnapshot());

  test("should add an extension with a lone attribute", async () =>
    expect(await transformToVue(`!Icon{ attr }`)).toMatchSnapshot());

  test("should add an extension with a lone attribute with a default value", async () =>
    expect(
      await transformToVue(`!Icon{ attr }`, {
        elements: {
          Icon: {
            propsDefaultValues: {
              attr: "default"
            }
          }
        }
      })
    ).toMatchSnapshot());

  test("should add an extension with a lone attribute with a default boolean value", async () =>
    expect(
      await transformToVue(`!Icon{ highlight }`, {
        elements: {
          Icon: {
            propsDefaultValues: {
              highlight: true
            }
          }
        }
      })
    ).toMatchSnapshot());

  test("should add an extension with all types of parameters", async () =>
    expect(
      await transformToVue(
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

  test("should add an extension with a boolean property", async () =>
    expect(
      await transformToVue("!Icon", {
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

  test("should add an extension with a mapped content", async () =>
    expect(
      await transformToVue("!Icon[my-tooltip]", {
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

  test("should add an extension with a mapped argument", async () =>
    expect(
      await transformToVue("!Icon(my-icon)", {
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

  test("should work with other markdown", async () =>
    expect(
      await transformToVue(
        `# heading

!Icon`
      )
    ).toMatchSnapshot());
});

describe("vue block extensions", () => {
  test("should add an extension", async () =>
    expect(
      await transformToVue(
        `Icon:
:::
:::`
      )
    ).toMatchSnapshot());

  test("should add an extension with an id", async () =>
    expect(
      await transformToVue(
        `Icon:
:::
:::
{ #my-id }`
      )
    ).toMatchSnapshot());

  test("should add an extension with a class", async () =>
    expect(
      await transformToVue(
        `Icon:
:::
:::
{ .my-class }`
      )
    ).toMatchSnapshot());

  test("should add an extension with an attribute", async () =>
    expect(
      await transformToVue(
        `Icon:
:::
:::
{ attr=my-attr }`
      )
    ).toMatchSnapshot());

  test("should add an extension with a quoted attribute", async () =>
    expect(
      await transformToVue(
        `Icon:
:::
:::
{ attr="my attribute" }`
      )
    ).toMatchSnapshot());

  test("should add an extension with a lone attribute", async () =>
    expect(
      await transformToVue(
        `Icon:
:::
:::
{ attr }`
      )
    ).toMatchSnapshot());

  test("should add an extension with a lone attribute with a default value", async () =>
    expect(
      await transformToVue(
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

  test("should add an extension with a lone attribute with a default boolean value", async () =>
    expect(
      await transformToVue(
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

  test("should add an extension with all types of parameters", async () =>
    expect(
      await transformToVue(
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

  test("should add an extension with a boolean property", async () =>
    expect(
      await transformToVue(
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

  test("should add an extension with a mapped content", async () =>
    expect(
      await transformToVue(
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

  test("should add an extension with a mapped argument", async () =>
    expect(
      await transformToVue(
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

  test("should work with other markdown", async () =>
    expect(
      await transformToVue(
        `# heading

Icon:
:::
:::`
      )
    ).toMatchSnapshot());
});
