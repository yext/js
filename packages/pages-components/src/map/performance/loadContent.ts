/**
 * Insert script element into HTML from provided src url
 * @param src
 * @param cb Function that runs on script load
 */
function LoadScript(src: string, cb = () => null) {
  const script = document.createElement("script");

  script.async = true;
  script.onload = cb;
  script.src = src;

  document.head.appendChild(script);
}

export { LoadScript };
