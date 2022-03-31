import FloatingUI from "../src/index";

document.addEventListener("alpine:initializing", () => {
  FloatingUI(window.Alpine);
});
