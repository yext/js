export type Performer = Array<string>;
export type Organization = {
  name?: string;
  url?: string;
};

export const PerformerSchema = (performers?: Performer) => {
  return (
    performers && {
      performer: {
        "@type": "PerformingGroup",
        name: performers.join(" and "),
      },
    }
  );
};

export const OrganizationSchema = (org?: Organization) => {
  return (
    org && {
      organizer: {
        "@type": "Organization",
        name: org.name,
        url: org.url,
      },
    }
  );
};
