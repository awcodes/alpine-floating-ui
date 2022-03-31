import { buildConfigFromModifiers } from "../src/buildConfigFromModifiers";

test("placement", () => {
  expect(buildConfigFromModifiers(["placement", "top"])).toStrictEqual({
    placement: "top",
    middleware: [],
  });
});
