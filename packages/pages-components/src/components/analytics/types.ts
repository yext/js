/**
 * The shape of the data passed directly to the different template functions with the
 * exception of the render function (getPath, getHeadConfig, etc).
 *
 * @public
 */
export interface TemplateProps<T = Record<string, any>> {
  /** The entire document returned after applying the stream to a single entity */
  document: T;
}
