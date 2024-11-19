const BaseSchema = (document: Record<string, any>, schemaType: string) => {
  return {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: document.name,
  };
};

export { BaseSchema };
