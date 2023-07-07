/**
 * A manifest of bundled files present during a production build.
 *
 * @public
 */
export type Manifest = {
  /** A map of feature name to the bundle path of the feature */
  bundlePaths: {
    [key: string]: string;
  };
  /** A map of render template to its bundle path */
  renderPaths: {
    [key: string]: string;
  };
  /** A map of project roots to their paths */
  projectFilepaths: {
    /** The folder path where all template files live */
    templatesRoot: string;
    /** The folder path where the compiled files live */
    distRoot: string;
    /** The folder path where the compiled server bundles live */
    serverBundleOutputRoot: string;
    /** The folder path where a subset of template files use for the build live */
    scopedTemplatesPath?: string;
  };
  /** If the bundler used generates a manifest.json then this field will contain that json object */
  bundlerManifest?: any;
};

/**
 * The shape of the data passed directly to the different template functions with the
 * exception of the render function (getPath, getHeadConfig, etc).
 *
 * @public
 */
export interface TemplateProps<T = Record<string, any>> {
  /** The entire document returned after applying the stream to a single entity */
  document: T;
  /** Additional metadata added by the toolchain */
  __meta: {
    /** Specifies if the data is returned in development or production mode */
    mode: "development" | "production";
    /** A manifest of bundled files present during production mode */
    manifest?: Manifest;
  };
}
