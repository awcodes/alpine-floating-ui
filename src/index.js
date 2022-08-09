import { computePosition, autoUpdate, autoPlacement } from "@floating-ui/dom";
import { buildConfigFromModifiers } from "./buildConfigFromModifiers";
import { buildDirectiveConfigFromModifiers } from "./buildDirectiveConfigFromModifiers";
import { randomString } from "./randomString";
import { mutateDom } from "alpinejs/src/mutation";
import { once } from "alpinejs/src/utils/once";

export default function (Alpine) {
  const defaultOptions = {
    dismissable: true,
    trap: false,
  };

  function setupA11y(component, trigger, panel = null) {
    if (!trigger) return;

    if (!trigger.hasAttribute("aria-expanded")) {
      trigger.setAttribute("aria-expanded", false);
    }

    if (!panel.hasAttribute("id")) {
      const panelId = `panel-${randomString(8)}`;
      trigger.setAttribute("aria-controls", panelId);
      panel.setAttribute("id", panelId);
    } else {
      trigger.setAttribute("aria-controls", panel.getAttribute("id"));
    }

    panel.setAttribute("aria-modal", true);
    panel.setAttribute("role", "dialog");
  }

  /**
   * set up a11y for magic instances
   */
  const atMagicTrigger = document.querySelectorAll('[\\@click^="$float"]');
  const xMagicTrigger = document.querySelectorAll('[x-on\\:click^="$float"]');

  [...atMagicTrigger, ...xMagicTrigger].forEach((trigger) => {
    const component = trigger.parentElement.closest("[x-data]");
    const panel = component.querySelector('[x-ref="panel"]');
    setupA11y(component, trigger, panel);
  });

  Alpine.magic("float", (el) => {
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

  Alpine.directive("float", (panel, { modifiers, expression }, { evaluate, effect }) => {
    const settings = expression ? evaluate(expression) : {};
    const config = modifiers.length > 0 ? buildDirectiveConfigFromModifiers(modifiers, settings) : {};
    let cleanup = null;

    if (config.float.strategy == "fixed") {
      panel.style.position = "fixed";
    }

    const clickAway = (event) => (panel.parentElement && !panel.parentElement.closest("[x-data]").contains(event.target) ? panel.close() : null);
    const keyEscape = (event) => (event.key === "Escape" ? panel.close() : null);

    const refName = panel.getAttribute("x-ref");

    const component = panel.parentElement.closest("[x-data]");
    const atTrigger = component.querySelectorAll(`[\\@click^="$refs.${refName}"]`);
    const xTrigger = component.querySelectorAll(`[x-on\\:click^="$refs.${refName}"]`);

    panel.style.setProperty("display", "none");

    setupA11y(component, [...atTrigger, ...xTrigger][0], panel);

    panel._x_isShown = false;
    panel.trigger = null;

    if (!panel._x_doHide)
      panel._x_doHide = () => {
        mutateDom(() => {
          panel.style.setProperty("display", "none", modifiers.includes("important") ? "important" : undefined);
        });
      };

    if (!panel._x_doShow)
      panel._x_doShow = () => {
        mutateDom(() => {
          panel.style.setProperty("display", "block", modifiers.includes("important") ? "important" : undefined);
        });
      };

    let hide = () => {
      panel._x_doHide();
      panel._x_isShown = false;
    };

    let show = () => {
      panel._x_doShow();
      panel._x_isShown = true;
    };

    let clickAwayCompatibleShow = () => setTimeout(show);

    let toggle = once(
      (value) => (value ? show() : hide()),
      (value) => {
        if (typeof panel._x_toggleAndCascadeWithTransitions === "function") {
          panel._x_toggleAndCascadeWithTransitions(panel, value, show, hide);
        } else {
          value ? clickAwayCompatibleShow() : hide();
        }
      }
    );

    let oldValue;
    let firstTime = true;

    effect(() =>
      evaluate((value) => {
        // Let's make sure we only call this effect if the value changed.
        // This prevents "blip" transitions. (1 tick out, then in)
        if (!firstTime && value === oldValue) return;

        if (modifiers.includes("immediate")) value ? clickAwayCompatibleShow() : hide();

        toggle(value);

        oldValue = value;
        firstTime = false;
      })
    );

    panel.open = async function (event) {
      panel.trigger = event.currentTarget ? event.currentTarget : event;

      // if (typeof panel._x_toggleAndCascadeWithTransitions === "function") {
      //   panel._x_toggleAndCascadeWithTransitions(panel, true, show, hide);
      // }

      toggle(true);

      panel.trigger.setAttribute("aria-expanded", true);

      if (config.component.trap) panel.setAttribute("x-trap", true);

      cleanup = autoUpdate(panel.trigger, panel, () => {
        computePosition(panel.trigger, panel, config.float).then(({ middlewareData, placement, x, y }) => {
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
      });

      window.addEventListener("click", clickAway);
      window.addEventListener("keydown", keyEscape, true);
    };

    panel.close = function () {
      // if (typeof panel._x_toggleAndCascadeWithTransitions === "function") {
      //   panel._x_toggleAndCascadeWithTransitions(panel, false, show, hide);
      // }
      toggle(false);

      panel.trigger.setAttribute("aria-expanded", false);

      if (config.component.trap) panel.setAttribute("x-trap", false);

      cleanup();

      window.removeEventListener("click", clickAway);
      window.removeEventListener("keydown", keyEscape, false);
    };

    panel.toggle = function (event) {
      panel._x_isShown ? panel.close() : panel.open(event);
    };
  });
}
