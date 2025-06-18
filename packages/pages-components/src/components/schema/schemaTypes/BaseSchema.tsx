const BaseSchema = (document: Record<string, any>, schemaType: string) => {
  if (!document.name || typeof document.name !== "string") {
    return;
  }

  return {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: document.name,
  };
};

export { BaseSchema };
