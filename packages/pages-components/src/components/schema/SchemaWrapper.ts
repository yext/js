// Main wrapper of all JSON-LD schema that is injected into the head script.
export const SchemaWrapper = (json: any) => {
  return `<script type="application/ld+json">
  ${JSON.stringify(json)}
  </script>`;
};
