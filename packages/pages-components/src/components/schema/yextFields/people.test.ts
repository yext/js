import {
  OrganizationSchema,
  PerformerSchema,
  validateOrganization,
  validatePerformers,
} from "./people.js";

describe("validateOrganization", () => {
  it("returns false for invalid organizations", () => {
    expect(validateOrganization(undefined)).toBe(false);
    expect(validateOrganization({})).toBe(false);
    expect(validateOrganization("string")).toBe(false);
    expect(validateOrganization({ key: "value" })).toBe(false);
    expect(validateOrganization({ url: "https://google.com" })).toBe(false);
  });

  it("should return true for valid organizations", () => {
    expect(validateOrganization({ name: "Google" })).toBe(true);
    expect(
      validateOrganization({ name: "Google", url: "https://google.com" })
    ).toBe(true);
  });
});

describe("validatePerformers", () => {
  it("returns false for invalid performers input", () => {
    expect(validatePerformers(undefined)).toBe(false);
    expect(validatePerformers({})).toBe(false);
    expect(validatePerformers("string")).toBe(false);
    expect(validatePerformers([])).toBe(false);
  });

  it("should return true for valid performers input (arrays)", () => {
    expect(validatePerformers(["Performer One", "Performer Two"])).toBe(true);
    expect(validatePerformers([1, "Performer Two"])).toBe(true);
  });
});

describe("PerformerSchema", () => {
  it("returns false for invalid performers input", () => {
    expect(PerformerSchema(undefined)).toBe(false);
    expect(PerformerSchema({} as any)).toBe(false);
    expect(PerformerSchema("string" as any)).toBe(false);

    const performers1: string[] = [];
    expect(PerformerSchema(performers1)).toBe(false);
  });

  it("returns the correct schema for valid performers", () => {
    const performers2 = ["Artist A"];
    expect(PerformerSchema(performers2)).toEqual({
      performer: {
        "@type": "PerformingGroup",
        name: "Artist A",
      },
    });

    const performers3 = ["Artist B", "Artist C"];
    expect(PerformerSchema(performers3)).toEqual({
      performer: {
        "@type": "PerformingGroup",
        name: "Artist B and Artist C",
      },
    });
  });
});

describe("OrganizationSchema", () => {
  it("returns false for invalid organization input", () => {
    expect(OrganizationSchema(undefined)).toBe(false);
    expect(OrganizationSchema({})).toBe(false);
    expect(OrganizationSchema("string" as any)).toBe(false);

    const org1 = { url: "https://example.com" };
    expect(OrganizationSchema(org1)).toBe(false);
  });

  it("returns the correct schema for valid organizations", () => {
    const org2 = { name: "Yext" };
    expect(OrganizationSchema(org2)).toEqual({
      organizer: {
        "@type": "Organization",
        name: "Yext",
      },
    });

    const org3 = { name: "Yext", url: "https://yext.com" };
    expect(OrganizationSchema(org3)).toEqual({
      organizer: {
        "@type": "Organization",
        name: "Yext",
        url: "https://yext.com",
      },
    });
  });
});
