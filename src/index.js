import { computePosition, autoUpdate, autoPlacement } from "@floating-ui/dom";
import { buildConfigFromModifiers } from "./buildConfigFromModifiers";
import { buildDirectiveConfigFromModifiers } from "./buildDirectiveConfigFromModifiers";
import { randomString } from "./randomString";

export default function (Alpine) {
  const defaultOptions = {
    dismissable: true,
    trap: false,
  };

  function setupA11y(component, trigger, panel = null) {
    if (!trigger.hasAttribute("aria-expanded")) {
      trigger.setAttribute("aria-expanded", false);
    }

    if (!panel.hasAttribute("id")) {
      const panelId = `panel-${randomString(8)}`;
      trigger.setAttribute("aria-controls", panelId);
      panel.setAttribute("id", panelId);
    } else {
      trigger.setAttribute("aria-controls", panelId);
    }

    panel.setAttribute("aria-modal", true);
    panel.setAttribute("role", "dialog");
  }

  Alpine.magic("float", (el) => {
    const component = el.parentElement.closest("[x-data]");
    const panel = component.querySelector('[x-ref="panel"]');

    setupA11y(component, el, panel);

    return (modifiers = {}, settings = {}) => {
      const options = { ...defaultOptions, ...settings };
      const config = Object.keys(modifiers).length > 0 ? buildConfigFromModifiers(modifiers) : { middleware: [autoPlacement()] };

      const trigger = el;
      const component = el.parentElement.closest("[x-data]");
      const panel = component.querySelector('[x-ref="panel"]');

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
          if (!component.contains(event.target) && isFloating()) {
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

  Alpine.directive("float", (panel, { modifiers, expression }, { evaluate }) => {
    const settings = expression ? evaluate(expression) : {};
    const config = modifiers.length > 0 ? buildDirectiveConfigFromModifiers(modifiers, settings) : {};

    const clickAway = (event) => (!panel.parentElement.closest("[x-data]").contains(event.target) ? panel.close() : null);
    const keyEscape = (event) => (event.key === "Escape" ? panel.close() : null);

    async function update() {
      return await computePosition(panel.trigger, panel, config.float).then(({ middlewareData, placement, x, y }) => {
        if (middlewareData.arrow) {
          const ax = middlewareData.arrow?.x;
          const ay = middlewareData.arrow?.y;
          const aEl = config.float.middleware.filter((middleware) => middleware.name == "arrow")[0].options.element;

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

    const refName = panel.getAttribute("x-ref");

    const component = panel.parentElement.closest("[x-data]");
    const atTrigger = component.querySelectorAll(`[\\@click^="$refs.${refName}"]`);
    const xTrigger = component.querySelectorAll(`[x-on\\:click^="$refs.${refName}"]`);

    setupA11y(component, [...atTrigger, ...xTrigger][0], panel);

    panel.isOpen = false;
    panel.trigger = null;

    panel.open = async function (event) {
      panel.trigger = event.currentTarget;

      panel.isOpen = true;

      panel.style.display = "block";

      panel.trigger.setAttribute("aria-expanded", true);

      if (config.component.trap) panel.setAttribute("x-trap", true);

      await update();

      window.addEventListener("click", clickAway);
      window.addEventListener("keydown", keyEscape, true);
    };

    panel.close = function () {
      panel.isOpen = false;

      panel.style.display = "";

      panel.trigger.setAttribute("aria-expanded", false);

      if (config.component.trap) panel.setAttribute("x-trap", false);

      autoUpdate(panel.trigger, panel, update);

      window.removeEventListener("click", clickAway);
      window.removeEventListener("keydown", keyEscape, false);
    };

    panel.toggle = function (event) {
      panel.isOpen ? panel.close() : panel.open(event);
    };
  });
}
