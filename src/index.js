import { computePosition, autoUpdate, autoPlacement } from "@floating-ui/dom";
import { buildConfigFromModifiers } from "./buildConfigFromModifiers";
import { randomString } from "./randomString";

export default function (Alpine) {
  const defaultOptions = {
    dismissable: true,
    trap: false,
  };

  const atTriggers = document.querySelectorAll('[\\@click*="$float"]');
  const xTriggers = document.querySelectorAll('[x-on\\:click*="$float"]');

  const triggers = [...atTriggers, ...xTriggers].forEach(function (trig) {
    const parentComponent = trig.parentElement.closest("[x-data]");
    const panel = parentComponent.querySelector('[x-ref="panel"]');

    if (!trig.hasAttribute("aria-expanded")) {
      trig.setAttribute("aria-expanded", false);
    }

    if (!panel.hasAttribute("id")) {
      const panelId = `panel-${randomString(8)}`;
      trig.setAttribute("aria-controls", panelId);
      panel.setAttribute("id", panelId);
    } else {
      trig.setAttribute("aria-controls", panel.getAttribute("id"));
    }

    panel.setAttribute("aria-modal", true);
    panel.setAttribute("role", "dialog");
  });

  Alpine.magic("float", (el) => {
    return (modifiers = {}, settings = {}) => {
      const options = { ...defaultOptions, ...settings };
      const config = Object.keys(modifiers).length > 0 ? buildConfigFromModifiers(modifiers) : { middleware: [autoPlacement()] };

      const parentComponent = el.parentElement.closest("[x-data]");
      const trigger = el;
      const panel = parentComponent.querySelector('[x-ref="panel"]');

      function isFloating() {
        return panel.style.display == "block";
      }

      function closePanel() {
        panel.style.display = "";
        trigger.setAttribute("aria-expanded", false);
        if (options.trap) panel.setAttribute("x-trap", false);
        autoUpdate(el, panel, update);
      }

      function openPanel() {
        panel.style.display = "block";
        trigger.setAttribute("aria-expanded", true);
        if (options.trap) panel.setAttribute("x-trap", true);
        update();
      }

      function togglePanel() {
        isFloating() ? closePanel() : openPanel();
      }

      async function update() {
        return await computePosition(el, panel, config).then(({ middlewareData, placement, x, y }) => {
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

            Object.assign(panel.style, {
              visibility: referenceHidden ? "hidden" : "visible",
            });
          }

          Object.assign(panel.style, {
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
