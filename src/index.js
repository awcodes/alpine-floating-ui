import { computePosition, autoUpdate, autoPlacement } from "@floating-ui/dom";
import { buildConfigFromModifiers } from "./buildConfigFromModifiers";

export default function (Alpine) {
  Alpine.data("floater", (
    modifiers = {},
    dismissable = true
  ) => {
    const config = Object.keys(modifiers).length > 0 ? buildConfigFromModifiers(modifiers) : { middleware: [autoPlacement()] };

    return {
      open: false,

      init() {
        console.log('initializing floater component');
        console.log(this.$refs);
      },

      trigger: {
        ['x-ref']() {
          return 'trigger';
        },
        ['@click']() {
          this.togglePanel();
        }
      },

      panel: {
        ['x-ref']() {
          return 'panel';
        },
        ['@click.outside']() {
          this.closePanel();
        },
        ['@keyup.escape.window']() {
          this.closePanel();
        }
      },

      closePanel() {
        this.open = false;
        this.$refs.panel.style.display = "";
        autoUpdate(this.$refs.trigger, this.$refs.panel, this.updatePanel);
      },

      openPanel() {
        this.open = true;
        this.$refs.panel.style.display = "block";
        this.updatePanel();
      },

      togglePanel() {
        this.open ? this.closePanel() : this.openPanel();
      },

      async updatePanel() {
        console.log(this.$refs.trigger);
        let triggerEl = this.$refs.trigger;
        let panelEl = this.$refs.panel;

        return await computePosition(triggerEl, panelEl, config).then(({ middlewareData, placement, x, y }) => {
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

            Object.assign(panelEl.style, {
              visibility: referenceHidden ? "hidden" : "visible",
            });
          }

          Object.assign(panelEl.style, {
            left: `${x}px`,
            top: `${y}px`,
          });
        });
      }
    }
  });

  Alpine.magic("float", (el) => {
    return (floatEl, modifiers = {}, dismissable = true) => {
      const config = Object.keys(modifiers).length > 0 ? buildConfigFromModifiers(modifiers) : { middleware: [autoPlacement()] };

      function isFloating() {
        return floatEl.style.display == "block";
      }

      function closePanel() {
        floatEl.style.display = "";
        autoUpdate(el, floatEl, update);
      }

      function openPanel() {
        floatEl.style.display = "block";
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

      if (dismissable) {
        window.addEventListener("click", (event) => {
          const parent = el.closest("[x-data]");
          if (!parent.contains(event.target) && isFloating()) {
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
