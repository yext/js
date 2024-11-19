const BaseSchema = (data: any, schemaType: string) => {
  return {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: data.document.name,
  };
};

export { BaseSchema };
