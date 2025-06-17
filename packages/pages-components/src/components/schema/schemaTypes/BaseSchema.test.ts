import { BaseSchema } from "./BaseSchema.js";

describe("BaseSchema", () => {
  it("returns the correct schema", () => {
    expect(BaseSchema({}, "LocalBusiness")).toEqual({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: undefined,
    });
    expect(BaseSchema({ name: "Yext" }, "LocalBusiness")).toEqual({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Yext",
    });
  });
});
