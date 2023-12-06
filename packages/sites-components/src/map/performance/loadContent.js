// @ts-nocheck
/**
 * Insert script element into HTML from provided src url
 * @param {string} src
 * @param {function} [cb] Function that runs on script load
 */
function LoadScript(src, cb = () => null) {
  const script = document.createElement("script");

  script.async = true;
  script.onload = cb;
  script.src = src;

  document.head.appendChild(script);
}

export { LoadScript };
