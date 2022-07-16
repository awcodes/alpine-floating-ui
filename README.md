# Alpine Floating UI

Add Floating UI functionality to Alpine 3.x components.

> This package only supports Alpine ^3.x.

## About

This plugin adds a `$float` magic and an `x-float` directive to Alpine, with modifiers for [Floating UI](https://floating-ui.com/) functionality.

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

This plugin has the option to use x-trap, but you must also include the Alpine Focus plugin as well to make use of it.

```js
import Alpine from "alpinejs";
import Focus from "@alpinejs/focus"; // optional unless you want to use x-trap
import AlpineFloatingUI from "@awcodes/alpine-floating-ui";

Alpine.plugin(Focus); // optional unless you want to use x-trap
Alpine.plugin(AlpineFloatingUI);

window.Alpine = Alpine;
window.Alpine.start();
```

## CSS

See the [Floating UI Tutorial](https://floating-ui.com/docs/tutorial) for infomation about styling.

## Usage

### `$float` Magic
To create a Floating UI component, use the `$float` magic on the trigger element and apply an `x-ref` to your 'panel'. Don't forget to have `x-data` on the root element of your component.

```html
<div class="component" x-data>
  <button @click="$float()">I have a floating panel. Woot!</button>
  <div x-ref="panel" class="panel">I'm floating</div>
</div>
```

### `x-float` Directive

To create a floating UI component with x-float, add the directive to your floating element with an x-ref to name the name. You can then trigger the panel with a click event using `$refs` to target the panel.

Available methods on the trigger are `toggle`, `open`, and `close`.

To use the middleware with `x-float` simply chain on the middleware you need to use.

```html
<div class="component" x-data>
  <button @click="$refs.panel.toggle">Trigger</button>
  <div x-ref="panel" class="panel" x-float.placement.bottom-start.flip.offset>
    <p>I'm floating</p>
  </div>
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

### With `$float` Magic

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

### With `x-float` Directive

All settings should be configured within the expression of the x-float directive with the exception of `placement` which should be used directly on the directive itself. See [https://floating-ui.com/docs/computePosition#placement](https://floating-ui.com/docs/computePosition#placement) placement options.

```html
<div
  x-ref="panel"
  class="panel"
  x-float.placement.top.flip.offset.hide="{
    offset: 30,
    hide: {
      strategy: 'referenceHidden'
    }
  }"
>
```

## Arrow Middleware

To use the arrow middleware you must provide an element to use as the arrow, placed inside your panel in the HTML and passed into the arrow middleware as a $ref to the element.

### With `$float` Magic

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

### With `x-float` Directive

```html
<div class="component" x-data>
  <button @click="$refs.panel.toggle">I'm a fancy button with a fancy arrow panel</button>
  <div
    x-ref="panel"
    class="panel"
    x-float.flip.offset.trap.arrow="{
    offset: 30,
    arrow: {
      element: $refs.arrow
    }
  }"
  >
    <p>I'm floating 2!</p>
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

## X-Trap

The second argument that can be passed to `$float` is an object of plugin options for each float-ui element.

### With `$float` Magic

```html
<button @click="$float({
  offset: 10,
  placement: 'bottom-start',
},{
  trap: true
})"></button>
```

### With `x-float` Directive

```html
<div
  x-ref="panel"
  class="panel"
  x-float.trap
>
```

## Versioning

This projects follow the [Semantic Versioning](https://semver.org/) guidelines.

## License

Copyright (c) 2022 Adam Weston and contributors

Licensed under the MIT license, see [LICENSE.md](LICENSE.md) for details.
