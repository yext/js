import { BaseSchema } from "./BaseSchema.js";

describe("BaseSchema", () => {
  it("returns undefined if no name is present", () => {
    expect(BaseSchema({}, "LocalBusiness")).toBe(undefined);
  });

  it("returns the correct schema", () => {
    expect(BaseSchema({ name: "Yext" }, "LocalBusiness")).toEqual({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Yext",
    });
  });
});
