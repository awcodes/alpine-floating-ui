# Alpine Floating UI

Add Floating UI functionality to Alpine 3.x components.

> This package only supports Alpine ^3.x.

## About

This plugin adds a `$float` magic to Alpine, with modifiers for [Floating UI](https://floating-ui.com/) functionality.

## Installation

### CDN

Include the following `<script>` tag in the `<head>` of your document, just before Alpine.

```html
<script src="https://cdn.jsdelivr.net/npm/@awcodes/alpine-floating-ui@2.x.x/dist/cdn.min.js" defer></script>
```

### NPM

```bash
npm install @awcodes/alpine-floating-ui
```

Add the `$float` magic property to your project by registering the plugin with Alpine.

```js
import Alpine from "alpinejs";
import FloatingUI from "@awcodes/alpine-floating-ui";

Alpine.plugin(FloatingUI);

window.Alpine = Alpine;
window.Alpine.start();
```

## CSS

See the [Floating UI Tutorial](https://floating-ui.com/docs/tutorial) for infomation about styling.

## Usage

To create a Floating UI component, use the `$float` magic on the trigger element and apply an `x-ref` to your 'panel'. You can then pass the 'panel' through to the `$float` magic function on your trigger.

```html
<div id="component" x-data>
  <button @click="$float($refs.panel)">Click me!</button>

  <div x-ref="panel" id="panel">I'm floating</div>
</div>
```

## Floating UI configuration

The second argument to `$float` should be an object.

This object currently accepts the 'position', 'flip', 'offset', 'shift', 'arrow', and 'hide' middleware for Floating UI. See the [Floating UI Tutorial](https://floating-ui.com/docs/tutorial) for infomation about these options.

Default options are:

```js
{
    placement: 'bottom',
    middleware: [autoPlacement()],
}
```

To use the default options for each middleware pass an empty object as the value.

```html
<button @click="$float($refs.panel, {
  offset: 10,
  flip: {},
  hide: {
    strategy: 'referenceHidden'
  }
})"></button>
```

### Arrow Middleware

To use the arrow middleware you must provide an element to use as the arrow and it should be placed inside your panel in the HTML.

```html
<div id="component" x-data>
  <button @click="$float($refs.panel, {
    offset: 10,
    arrow: {
      element: $refs.arrow
    }
  })">Click over me!</button>
  <div x-ref="panel" id="panel">
    I'm floating 2!
    <div x-ref="arrow" id="arrow"></div>
  </div>
</div>
```

Styling the arrow (this is just an example, you are free to style it anyway you choose):
```css
#arrow {
  position: absolute;
  background-color: inherit;
  width: 8px;
  height: 8px;
  transform: rotate(45deg);
}
```

## Versioning

This projects follow the [Semantic Versioning](https://semver.org/) guidelines.

## License

Copyright (c) 2022 Adam Weston and contributors

Licensed under the MIT license, see [LICENSE.md](LICENSE.md) for details.
