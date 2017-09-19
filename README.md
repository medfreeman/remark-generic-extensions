# remark-generic-extensions

[![npm version](https://img.shields.io/npm/v/remark-generic-extensions.svg)](https://www.npmjs.com/package/remark-generic-extensions)
[![npm](https://img.shields.io/npm/dt/remark-generic-extensions.svg?style=flat-square)](https://npmjs.com/package/remark-generic-extensions)
[![Build Status](https://img.shields.io/travis/medfreeman/remark-generic-extensions.svg?label=build)](https://travis-ci.org/medfreeman/remark-generic-extensions)
[![Coverage Status](https://img.shields.io/coveralls/medfreeman/remark-generic-extensions/master.svg)](https://coveralls.io/github/medfreeman/remark-generic-extensions?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/medfreeman/remark-generic-extensions.svg)](https://greenkeeper.io/)
[![dependencies Status](https://img.shields.io/david/medfreeman/remark-generic-extensions.svg)](https://david-dm.org/medfreeman/remark-generic-extensions)
[![devDependencies Status](https://img.shields.io/david/dev/medfreeman/remark-generic-extensions.svg)](https://david-dm.org/medfreeman/remark-generic-extensions?type=dev)

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Allows the use of [commonmark generic directive extension](https://github.com/jgm/CommonMark/wiki/Generic-Directive-Extension-List) in markdown,
generating components through [remark-html](https://github.com/wooorm/remark-html) or [remark-react](https://github.com/mapbox/remark-react).

[📖 **Release Notes**](./CHANGELOG.md)

### Demo

Here's a demo using [remark-react](https://github.com/mapbox/remark-react) and [react-toolbox](https://github.com/react-toolbox/react-toolbox).
It is made using [create-react-app](https://github.com/facebookincubator/create-react-app), the [source is here](https://github.com/medfreeman/remark-generic-extensions/tree/master/examples/react-toolbox-icon) and can also be run locally.

[![Edit medfreeman/remark-generic-extensions: react-toolbox-icon](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/medfreeman/remark-generic-extensions/tree/master/examples/react-toolbox-icon)

## Disclaimer

Remember that the following syntax is experimental in regards to the commonmark spec, and will perhaps never be supported officialy.

```
Generic Directives is still in active discussion in http://talk.commonmark.org/t/generic-directives-plugins-syntax . But for brainstorming purposes, here is some possible extensions to support, or at least adhere to if not included.

It might look like !extensionName[](){} for inline

and for block (Current talk page at http://talk.commonmark.org/t/block-directives/802 )

extentionNames: argumentField 
:::
...BlockContent...
:::
{ #id .class key1=value key2=value }
```

There is a [known bug in remark-react < 4.0.1](https://github.com/mapbox/remark-react/issues/41), that wrongly coerces non-string values to strings.

Make sure to use at least v4.0.1.

## Syntax

### Inline extensions

`!Extension[Content](Argument){Properties}`

:information_source: The extension syntax is validated through [regexes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp), that you can inspect [here](https://github.com/medfreeman/remark-generic-extensions/blob/master/src/utils/regexes.js) if needed

- `Extension` defines the element you want to use

  It matches the `\w` character class.

  ```
  Matches any alphanumeric character from the basic Latin alphabet, including the underscore. Equivalent to [A-Za-z0-9_].
  ```

- `Content` defines the element content

  It matches everything but the `]` character.
  
  It can be mapped to any hast element property or value, see [placeholders](#placeholders).

- `Argument` defines the element argument

  It matches everything but the `)` character.
  
  It can be mapped to any hast element property or value, see [placeholders](#placeholders).

- `Properties` defines the element properties

  They can have leading and / or trailing spaces before / after the opening / closing braces.
  
  The different properties are separated by spaces, and so each of them match any character but spaces, except for quoted properties.

### Block extensions

```
Extension: Argument
:::
[Content]
:::
{Properties}
```

:information_source: The extension syntax is validated through [regexes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp), that you can inspect [here](https://github.com/medfreeman/remark-generic-extensions/blob/master/src/utils/regexes.js) if needed

- `Extension` defines the element you want to use

  It matches the `\w` character class.

  ```
  Matches any alphanumeric character from the basic Latin alphabet, including the underscore. Equivalent to [A-Za-z0-9_].
  ```

- `Argument` defines the element argument

  It matches everything but a line break.
  
  It can be mapped to any hast element property or value, see [placeholders](#placeholders).

- `Content` defines the element content

  It matches everything, and stops at the next `:::` occurence.

  Leading and trailing line breaks will be stripped.
  
  It can be mapped to any hast element property or value, see [placeholders](#placeholders).

- `Properties` defines the element properties

  They can have leading and / or trailing spaces before / after the opening / closing braces.
  
  The different properties are separated by spaces, and so each of them match any character but spaces, except for quoted properties.

### Available properties

  - id: `#my-id`

    It will be applied to the top-level hast element.
  - class: `.my-class .my-other-class`

    It will be applied to the top-level hast element.
  - key / value property: `my-prop=my-value`

    It can be mapped to any hast element property or value, see [placeholders](#placeholders).
  - key / value quoted property: `my-other-prop="my value with spaces"`

    It can be mapped to any hast element property or value, see [placeholders](#placeholders).
  - lone property: `my-alone-prop`

    It can be mapped to any hast element property or value, see [placeholders](#placeholders).

## Installation

```bash
npm install remark-generic-extensions
```

OR

```bash
yarn add remark-generic-extensions
```

## Usage (es6)

### *with [`remark-react`](https://github.com/mapbox/remark-react)*

See [demo](#demo)

### *with [`remark-html`](https://github.com/wooorm/remark-html)*

Say we have the following file, `example.md`:

```markdown
# Alpha

!alert[My message!](my subtext is rad){ #my-alert .custom-alert }

youtube: C8NAYW-Z54o
:::
My featured video!
:::
{ #my-video .custom-video-style spanClassName=custom-span-class }

## Bravo

## Delta
```

And our script, `example.js`, looks as follows:

```javascript
import vfile from "to-vfile"
import remark from "remark"
import genericExtensions from "remark-generic-extensions"
import html from "remark-html"

remark()
.use(genericExtensions,
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
    },
    youtube: {
      html: {
        tagName: "div",
        children: [
          {
            type: "element",
            tagName: "iframe",
            properties: {
              width: 420,
              height: 315,
              src: "https://www.youtube.com/embed/::argument::"
            }
          },
          {
            tagName: "span",
            properties: {
              className: "::prop::spanClassName::"
            },
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
)
.use(html)
.process(vfile.readSync('example.md'), (err, file) => {
  if (err) throw err
  console.log(String(file))
})
```

Now, running `node example` yields (indented):

```html
<h1>Alpha</h1>

<p>
  <span id="my-alert" class="custom-alert">
    <i class="fa fa-exclamation" aria-hidden="true"></i>
    <span>My message!</span>
    <span class="subtext">my subtext is rad</span>
  </span>
</p>

<div class="custom-video-style" id="my-video">
  <iframe width="420" height="315" src="https://www.youtube.com/embed/C8NAYW-Z54o"></iframe>
  <span class="custom-span-class">My featured video!</span>
</div>

<h2>Bravo</h2>

<h2>Delta</h2>
```

## API

### `remark().use(genericExtensions[, options])`

Convert generic extensions in a markdown document to an [hast](https://github.com/syntax-tree/hast) syntax tree,
suitable for rendering to html / react.

*   Looks for all inline extensions (if providing elements configuration the extension names are case sensitive)
*   Tells remark how to interpret them according to the options

#### `options` (object)

All options are validated through [joi](https://github.com/hapijs/joi).
You can find the schema [here](https://github.com/medfreeman/remark-generic-extensions/blob/master/src/utils/optionsSchema.js).
In case of error, it will be logged to the console and this module bypassed by remark.

##### Properties

- elements ([`Elements`](#elements-object), optional, default `{}`) - A list of inline elements to support
    along with their configuration

- placeholderAffix (string, optional, default `"::"`) - String that encloses `content`,
    `argument` and `prop` tokens in properties
    of the `elements` option, for dynamic replacement with properties specified in the markdown element.

    See [`HastProperties`](#hastproperties-object) for more information.

- debug (boolean, default: `false`) - Whether to show debug messages
  through [vfile-reporter](https://github.com/vfile/vfile-reporter)
    
    See [Logging](#logging) for more information.

---

#### `Elements` (object)

This object defines the extensions configuration.

The keys are strings corresponding to the inline extension names (i.e. `Icon`).

You can define one or more extensions if needed.

##### Properties

- *extensionName* (string): (object)
  - propsDefaultValues (object, optional)
    - *propertyName* (string): (any) - default value of the property
      
      It will be applied to items that specify
      the corresponding property without a defined value, i.e.

      <details><summary>example with `highlight` property on `icon` extension (es6)</summary><p>

      ```javascript
      import remark from "remark"
      import genericExtensions "remark-generic-extensions"
      import html from "remark-html"

      remark()
      .use(genericExtensions,
        {
          elements: {
            icon: {
              propsDefaultValues: {
                highlight: true,
              }
            }
          }
        }
      )
      .use(html)
      .process("!icon{highlight}", (err, file) => {
        if (err) throw err
        console.log(String(file))
      })
      ```

      Running this example would yield `<p><icon highlight="true"></icon></p>`

      </p></details>

  - html (object, optional) - html element representation used for rendering the extension
    - tagName (string, optional, defaults to the extension name) - html5 element tag name
    - children ([`Hast`](#hast-arrayobject), optional) - the element children
    - properties ([`HastProperties`](#hastproperties-object), optional) - the element properties

---

#### `Hast` (array[object])

This structure is a [hast](https://github.com/syntax-tree/hast) tree, with a few restrictions.

It is recursive, the `children` property also being of `Hast` type.

##### Properties

- type (enum[string], optional, default `"element"`) - hast node type
  - element
  - comment
  - text
- tagName (string, required when type === "element") - html5 element tag name
- value (string, required when type === ("comment" || "text")) - comment or text content, supports [placeholders](#placeholders)
- children ([`Hast`](#hast-arrayobject), optional) - the element children
- properties ([`HastProperties`](#hastproperties-object)) - the element properties

---

#### `HastProperties` (object)

This object pairs are mapped to [hast properties](https://github.com/syntax-tree/hast#properties), and thus follow the same rules.

##### Properties

- *propertyName* (string, except "class" && "for"): (enum)
  - (string) - When a property value is a string,
    it supports [placeholders](#placeholders) that will be replaced by their corresponding value.

  - (any) - A property value can also be of any other type

:information_source: Any property present in a markdown extension and not referenced by a placeholder will be applied to the top-level element.

## Placeholders

The `value` property and all `properties` members in [`Hast`](#hast-arrayobject) children support placeholders.

The available placeholders are:
  - "::content::" -> will be replaced by the `content` part of the extension in markdown (the part between `[]`)
  - "::argument::" -> will be replaced by the `argument` part of the extension in markdown (the part between `()`)
  - "::prop::*property*::" -> will be replaced by the corresponding `property` value present in the extension in markdown (in the part between `{}`)

Specifying the [`placeholderAffix` option](#properties) allows changing the placeholders.
For example, using "||" would make the available placeholders become "||content||", "||argument||" and "||prop||*property*||".

## Logging

All logging, except the [options validation](#options-object) that is directly logged to the console, takes place through [vfile-reporter](https://github.com/vfile/vfile-reporter).

It allows having nice error messages with positional information, and is also the standard way of logging with [unifiedjs](https://github.com/unifiedjs/unified).

By default, this module logs warnings, but enabling the [`debug` option](#properties) will also log debug messages, useful for troubleshooting.

<details><summary>logging example (es6)</summary><p>

```javascript
import remark from "remark"
import genericExtensions "remark-generic-extensions"
import html from "remark-html"
import report from "vfile-reporter"

remark()
.use(genericExtensions, {})
.use(html)
.process(input, function(err, file) {
  console.log(report(err || file))
})
```

</p></details>

<details><summary>debugging example (es6)</summary><p>

```javascript
import remark from "remark"
import genericExtensions "remark-generic-extensions"
import html from "remark-html"
import report from "vfile-reporter"

remark()
.use(genericExtensions, { debug: true })
.use(html)
.process(input, function(err, file) {
  console.log(report(err || file))
})
```

</p></details>

---

## CONTRIBUTING

* ⇄ Pull requests and ★ Stars are always welcome.
* For bugs and feature requests, please create an issue.
* Pull requests must be accompanied by passing automated tests (`$ yarn test`).

## LICENSE

[Apache License 2.0](./LICENSE)

Copyright (c) Mehdi Lahlou <mlahlou@protonmail.ch>
