# Alpine Floating UI

Add Floating UI functionality to Alpine 3.x components.

> This package only supports Alpine ^3.x.

## About

This plugin adds a `$float` magic to Alpine, with modifiers for [Floating UI](https://floating-ui.com/) functionality.

## Installation

### CDN

Include the following `<script>` tag in the `<head>` of your document, just before Alpine. This plugin has the option to use x-trap, but you must also include the Alpine Focus plugin as well to make use of it.

```html
<script src="https://cdn.jsdelivr.net/npm/@awcodes/alpine-floating-ui@3.x.x/dist/cdn.min.js" defer></script>

<!-- optional unless you want to use x-trap -->
<script defer src="https://unpkg.com/@alpinejs/focus@3.x.x/dist/cdn.min.js"></script>
```

### NPM

```bash
npm install @awcodes/alpine-floating-ui
```

Add the `$float` magic property to your project by registering the plugin with Alpine. This plugin has the option to use x-trap, but you must also include the Alpine Focus plugin as well to make use of it.

```js
import Alpine from "alpinejs";
import Focus from "@alpinejs/focus"; // optional unless you want to use x-trap
import FloatingUI from "@awcodes/alpine-floating-ui";

Alpine.plugin(Focus); // optional unless you want to use x-trap
Alpine.plugin(FloatingUI);

window.Alpine = Alpine;
window.Alpine.start();
```

## CSS

See the [Floating UI Tutorial](https://floating-ui.com/docs/tutorial) for infomation about styling.

## Usage

To create a Floating UI component, use the `$float` magic on the trigger element and apply an `x-ref` to your 'panel'. Don't forget to have `x-data` on the root element of your component.

```html
<div class="component" x-data>
  <button @click="$float()">I have a floating panel. Woot!</button>
  <div x-ref="panel" class="panel">I'm floating</div>
</div>
```

## Floating UI configuration

The first argument of  `$float` should be an object.

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
<button @click="$float({
  offset: 10,
  flip: {},
  hide: {
    strategy: 'referenceHidden'
  }
})"></button>
```

### Arrow Middleware

To use the arrow middleware you must provide an element to use as the arrow, placed inside your panel in the HTML and passed into the arrow middleware as a $ref to the element.

```html
<div class="component" x-data>
  <button @click="$float({
    offset: 10,
    arrow: {
      element: $refs.arrow
    }
  })">I'm a fancy button with a fancy arrow panel</button>
  <div x-ref="panel" class="panel">
    I'm floating 2!
    <div x-ref="arrow" class="arrow"></div>
  </div>
</div>
```

Styling the arrow (this is just an example, you are free to style it anyway you choose):
```css
.arrow {
  position: absolute;
  background-color: inherit;
  width: 8px;
  height: 8px;
  transform: rotate(45deg);
}
```

### X-Trap and Dissmissable

The second argument that can be passed to `$float` is an object of plugin options for each float-ui element.

```html
<button @click="$float({
  offset: 10,
  placement: 'bottom-start',
},{
  dismissable: true,
  trap: false
})"></button>
```

* Setting `dismissable` to `false` will disable hiding the panel when clicking away or hitting the escape key.
* Setting `trap` to `true` will enable Alpine's x-trap functionality to keep tab focus inside the panel until it is hidden.

## Versioning

This projects follow the [Semantic Versioning](https://semver.org/) guidelines.

## License

Copyright (c) 2022 Adam Weston and contributors

Licensed under the MIT license, see [LICENSE.md](LICENSE.md) for details.
