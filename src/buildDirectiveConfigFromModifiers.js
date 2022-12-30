import { flip, inline, offset, shift, autoPlacement, arrow, size, hide } from "@floating-ui/dom";

export const buildDirectiveConfigFromModifiers = (modifiers, settings) => {
  const config = {
    component: {
      trap: false,
    },
    float: {
      placement: "bottom",
      strategy: "absolute",
      middleware: [],
    },
  };

  const getModifierArgument = (modifier) => {
    return modifiers[modifiers.indexOf(modifier) + 1];
  };

  if (modifiers.includes("trap")) {
    config.component.trap = true;
  }

  if (modifiers.includes("teleport")) {
    config.float.strategy = "fixed";
  }

  if (modifiers.includes("offset")) {
    config.float.middleware.push(offset(settings["offset"] || 10));
  }

  if (modifiers.includes("placement")) {
    config.float.placement = getModifierArgument("placement");
  }

  if (modifiers.includes("autoPlacement") && !modifiers.includes("flip")) {
    config.float.middleware.push(autoPlacement(settings["autoPlacement"]));
  }

  if (modifiers.includes("flip")) {
    config.float.middleware.push(flip(settings["flip"]));
  }

  if (modifiers.includes("shift")) {
    config.float.middleware.push(shift(settings["shift"]));
  }

  if (modifiers.includes("inline")) {
    config.float.middleware.push(inline(settings["inline"]));
  }

  if (modifiers.includes("arrow")) {
    config.float.middleware.push(arrow(settings["arrow"]));
  }

  if (modifiers.includes("hide")) {
    config.float.middleware.push(hide(settings["hide"]));
  }
  
  if (modifiers.includes("size")) {
    config.float.middleware.push(size(settings["size"]));
  }

  return config;
};
