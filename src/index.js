import { computePosition, autoUpdate, autoPlacement } from "@floating-ui/dom";
import { buildConfigFromModifiers } from "./buildConfigFromModifiers";

export default function (Alpine) {
  Alpine.magic("float", (el) => {
    return (
      floatEl,
      modifiers = {},
      options = {
        dismissable: true,
      }
    ) => {
      const config = Object.keys(modifiers).length > 0 ? buildConfigFromModifiers(modifiers) : { middleware: [autoPlacement()] };
      const parentComponent = el.closest("[x-data]");
      const trigger = el;
      const panel = parentComponent.querySelector('[x-ref="panel"]');

      function isFloating() {
        return floatEl.style.display == "block";
      }

      function closePanel() {
        floatEl.style.display = "";
        floatEl.setAttribute('x-trap', false);
        autoUpdate(el, floatEl, update);
      }

      function openPanel() {
        floatEl.style.display = "block";
        floatEl.setAttribute('x-trap', true);
        update();
      }

      function togglePanel() {
        isFloating() ? closePanel() : openPanel();
      }

      async function update() {
        return await computePosition(el, floatEl, config).then(({ middlewareData, placement, x, y }) => {
          if (middlewareData.arrow) {
            const ax = middlewareData.arrow?.x;
            const ay = middlewareData.arrow?.y;
            const aEl = config.middleware.filter((middleware) => middleware.name == "arrow")[0].options.element;

            const staticSide = {
              top: "bottom",
              right: "left",
              bottom: "top",
              left: "right",
            }[placement.split("-")[0]];

            Object.assign(aEl.style, {
              left: ax != null ? `${ax}px` : "",
              top: ay != null ? `${ay}px` : "",
              right: "",
              bottom: "",
              [staticSide]: "-4px",
            });
          }

          if (middlewareData.hide) {
            const { referenceHidden } = middlewareData.hide;

            Object.assign(floatEl.style, {
              visibility: referenceHidden ? "hidden" : "visible",
            });
          }

          Object.assign(floatEl.style, {
            left: `${x}px`,
            top: `${y}px`,
          });
        });
      }

      if (options.dismissable) {
        window.addEventListener("click", (event) => {
          if (!parentComponent.contains(event.target) && isFloating()) {
            togglePanel();
          }
        });

        window.addEventListener(
          "keydown",
          (event) => {
            if (event.key === "Escape" && isFloating()) {
              togglePanel();
            }
          },
          true
        );
      }

      togglePanel();
    };
  });
}
