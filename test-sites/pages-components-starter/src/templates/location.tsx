import * as React from "react";
import {
  GetHeadConfig,
  GetPath,
  HeadConfig,
  Template,
  TemplateConfig,
  TemplateProps,
  TemplateRenderProps,
} from "@yext/pages";
import { Address } from "@yext/pages-components";
import "../index.css";

export const config: TemplateConfig = {
  name: "location",
  stream: {
    $id: "location-stream-aaa",
    filter: {
      entityTypes: ["location"],
    },
    fields: [
      "id",
      "uid",
      "meta",
      "name",
      "address",
      "slug",
      "hours",
      "photoGallery",
      "c_lrt",
      "c_subfieldRTFTest.title",
      "c_subfieldRTFTest.rtf.html",
    ],
    localization: {
      locales: ["en"],
    },
  },
};

export const getPath: GetPath<TemplateProps> = ({ document }) => {
  return `${document.slug}`;
};

export const getHeadConfig: GetHeadConfig<TemplateRenderProps> = ({
  relativePrefixToRoot,
  document,
}): HeadConfig => {
  return {
    title: document.name,
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1",
    tags: [
      {
        type: "meta",
        attributes: {
          name: "description",
          content: document.description,
        },
      },
    ],
  };
};

const Location: Template<TemplateRenderProps> = ({
  relativePrefixToRoot,
  document,
  __meta,
}) => {
  const { address, c_subfieldRTFTest } = document;

  return (
    <div className="tailwind">
      <div>
        <h1>Hello Pages Components</h1>
      </div>
      <div>
        <Address
          address={address}
          lines={[
            ["line1", ",", "line2"],
            ["city", ",", "region", ",", "postalCode"],
          ]}
        />
      </div>
      <div>
        LRT via HTML:{" "}
        {c_subfieldRTFTest.rtf.html && (
          <div
            dangerouslySetInnerHTML={{ __html: c_subfieldRTFTest.rtf.html }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default Location;
