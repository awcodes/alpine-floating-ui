import { computePosition, flip, autoUpdate } from "@floating-ui/dom";
import { buildConfigFromModifiers } from "./buildConfigFromModifiers";

export default function (Alpine) {
  Alpine.magic("float", (el) => {
    return (floatEl, modifiers = {}, dismissable = true) => {
      const config = Object.keys(modifiers).length > 0 ? buildConfigFromModifiers(modifiers) : { placement: "bottom", middleware: [flip()] };

      function isFloating() {
        return floatEl.style.display == "block";
      }

      function toggleFloat() {
        if (isFloating()) {
          floatEl.style.display = "";
          autoUpdate(el, floatEl, update);
        } else {
          floatEl.style.display = "block";
          update().then(({ x, y }) => {
            Object.assign(floatEl.style, {
              left: `${x}px`,
              top: `${y}px`,
            });
          });
        }
      }

      async function update() {
        return await computePosition(el, floatEl, config);
      }

      if (dismissable) {
        window.addEventListener("click", (event) => {
          if (!el.contains(event.target) && isFloating()) {
            toggleFloat();
          }
        });

        window.addEventListener(
          "keydown",
          (event) => {
            if (event.key === "Escape" && isFloating()) {
              toggleFloat();
            }
          },
          true
        );
      }

      toggleFloat();
    };
  });
}
