export type Organization = {
  name?: string;
  url?: string;
};

export const validateOrganization = (org: any): org is Organization => {
  if (typeof org !== "object") {
    return false;
  }
  return !!org.name;
};

export const validatePerformers = (performers: any): performers is any[] => {
  return Array.isArray(performers) && performers.length > 0;
};

export const PerformerSchema = (performers?: string[]) => {
  return (
    validatePerformers(performers) && {
      performer: {
        "@type": "PerformingGroup",
        name: performers.join(" and "),
      },
    }
  );
};

export const OrganizationSchema = (org?: Organization) => {
  return (
    validateOrganization(org) && {
      organizer: {
        "@type": "Organization",
        name: org.name,
        ...(org.url && { url: org.url }),
      },
    }
  );
};
