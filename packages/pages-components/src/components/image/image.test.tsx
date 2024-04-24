import { describe, it, expect, vi } from "vitest";
import {
  Image,
  validateRequiredProps,
  handleLayout,
  getImageSizeForFixedLayout,
} from "./image.js";
import { ImageLayoutOption } from "./types.js";
import { render, screen } from "@testing-library/react";

const imgWidth = 20;
const imgHeight = 10;
const imgUUID = "uuid";
const width = 200;
const height = 100;
const widths = [100, 200, 300];
const aspectRatio = 1;
const simpleImage = {
  alternateText: "alt text",
  width: imgWidth,
  height: imgHeight,
  url: `https://a.mktgcdn.com/p/${imgUUID}/2x1.jpg`,
};
const image = {
  image: simpleImage,
};

describe("Image", () => {
  it("properly renders the image with the pass through style and imgOverrides", () => {
    const overrideSrc = "https://overridesrc/";
    const overrideObjectFit = "none";

    render(
      <Image
        image={image}
        layout={ImageLayoutOption.FIXED}
        width={width}
        height={height}
        style={{ objectFit: overrideObjectFit }}
        imgOverrides={{ src: overrideSrc }}
      />
    );

    expect(screen.getByRole("img").style.objectFit).toEqual(overrideObjectFit);
    expect(screen.getByRole("img")).toHaveProperty("src", overrideSrc);
    expect(screen.getByRole("img")).toHaveProperty(
      "alt",
      image.image.alternateText
    );
  });

  it("properly renders non-complex image field", () => {
    const overrideSrc = "https://overridesrc/";
    const overrideObjectFit = "none";

    render(
      <Image
        image={simpleImage}
        layout={ImageLayoutOption.FIXED}
        width={width}
        height={height}
        style={{ objectFit: overrideObjectFit }}
        imgOverrides={{ src: overrideSrc }}
      />
    );

    expect(screen.getByRole("img").style.objectFit).toEqual(overrideObjectFit);
    expect(screen.getByRole("img")).toHaveProperty("src", overrideSrc);
    expect(screen.getByRole("img")).toHaveProperty(
      "alt",
      simpleImage.alternateText
    );
  });

  it("properly renders non-complex image field with EU url", () => {
    const overrideSrc = "https://overridesrc/";
    const overrideObjectFit = "none";
    const euUrl = `https://a.eu.mktgcdn.com/f/0/${imgUUID}.jpg`;

    render(
      <Image
        image={{
          image: { ...image.image, url: euUrl },
        }}
        layout={ImageLayoutOption.FIXED}
        width={width}
        height={height}
        style={{ objectFit: overrideObjectFit }}
        imgOverrides={{ src: overrideSrc }}
      />
    );

    expect(screen.getByRole("img").style.objectFit).toEqual(overrideObjectFit);
    expect(screen.getByRole("img")).toHaveProperty("src", overrideSrc);
    expect(screen.getByRole("img")).toHaveProperty(
      "alt",
      simpleImage.alternateText
    );
  });

  it("properly renders the placeholder before the image is loaded", () => {
    const placeholderText = "Placeholder";
    const placeholder = <div>{placeholderText}</div>;
    const onLoad = vi.fn();

    render(
      <Image
        image={image}
        placeholder={placeholder}
        imgOverrides={{ onLoad: () => onLoad() }}
      />
    );

    expect(screen.getByText(placeholderText)).toBeTruthy();
  });

  it("properly renders the placeholder if image's UUID is invalid and a placeholder is provided", () => {
    const placeholderText = "Placeholder";
    const placeholder = <div>{placeholderText}</div>;

    const logMock = vi.spyOn(console, "error").mockImplementation(() => {
      /* do nothing */
    });
    const invalidUrl = "random";

    expect(logMock.mock.calls.length).toBe(0);

    render(
      <Image
        image={{
          image: { ...image.image, url: invalidUrl },
        }}
        placeholder={placeholder}
      />
    );

    expect(screen.getByText(placeholderText)).toBeTruthy();
    expect(logMock.mock.calls.length).toBe(1);
    expect(logMock.mock.calls[0][0]).toBe(`Invalid image url: ${invalidUrl}`);

    vi.clearAllMocks();
  });

  it("renders nothing if image's UUID is invalid and a placeholder is not provided", () => {
    const logMock = vi.spyOn(console, "error").mockImplementation(() => {
      /* do nothing */
    });
    const invalidUrl = "random";

    expect(logMock.mock.calls.length).toBe(0);
    render(
      <Image
        image={{
          image: { ...image.image, url: invalidUrl },
        }}
      />
    );

    expect(screen.queryByRole("img")).toBeNull();
    expect(logMock.mock.calls.length).toBe(1);
    expect(logMock.mock.calls[0][0]).toBe(`Invalid image url: ${invalidUrl}`);

    vi.clearAllMocks();
  });

  it("properly renders the srcset based on the correct prod env", () => {
    render(<Image image={image} />);

    const img = screen.getByRole("img", {
      name: /alt text/i,
    });

    expect(img.getAttribute("srcset")).toContain("dyn.mktgcdn.com/p/");
  });

  it("properly renders the srcset based on the correct sandbox env", () => {
    const sbxImage = Object.assign(image.image, {
      url: `https://a.mktgcdn.com/p-sandbox/${imgUUID}/2x1.jpg`,
    });

    render(<Image image={sbxImage} />);

    const img = screen.getByRole("img", {
      name: /alt text/i,
    });

    expect(img.getAttribute("srcset")).toContain("dyn.mktgcdn.com/p-sandbox/");
  });

  it("properly renders the srcset based on the correct eu prod env", () => {
    const sbxImage = Object.assign(image.image, {
      url: `https://a.eu.mktgcdn.com/f/0/${imgUUID}.jpg`,
    });

    render(<Image image={sbxImage} />);

    const img = screen.getByRole("img", {
      name: /alt text/i,
    });

    expect(img.getAttribute("srcset")).toContain("dyn.eu.mktgcdn.com/f/");
  });

  it("properly renders the sizes for a fixed width", () => {
    render(
      <Image
        image={image}
        layout={ImageLayoutOption.FIXED}
        width={width}
        height={height}
      />
    );

    const img = screen.getByRole("img", {
      name: /alt text/i,
    });

    expect(img.getAttribute("sizes")).toEqual(`${width}px`);
  });

  it("properly renders the sizes for the default widths", () => {
    render(<Image image={image} />);

    const img = screen.getByRole("img", {
      name: /alt text/i,
    });

    expect(img.getAttribute("sizes")).toEqual(
      "(max-width: 640px) 100px, (max-width: 768px) 320px, (max-width: 1024px) 640px, (max-width: 1280px) 960px, (max-width: 1536px) 1280px, 1920px"
    );
  });

  it(`properly renders the image with 'loading' set to 'eager'.`, () => {
    render(<Image image={image} loading="eager" />);

    const img = screen.getByRole("img", {
      name: /alt text/i,
    });

    expect(img.getAttribute("loading")).toEqual("eager");
  });
});

describe("handleLayout", () => {
  it(`properly sets aspectRatio when layout is ${ImageLayoutOption.INTRINSIC} and aspectRatio is provided`, () => {
    const { imgStyle } = handleLayout(
      ImageLayoutOption.INTRINSIC,
      imgWidth,
      imgHeight,
      {},
      "https://a.mktgcdn.com/p/uuid/20x10",
      width,
      height,
      aspectRatio
    );

    expect(imgStyle.aspectRatio).toEqual(aspectRatio.toString());
  });

  it(`properly sets aspectRatio when layout is ${ImageLayoutOption.INTRINSIC} and aspectRatio is not provided`, () => {
    const { imgStyle } = handleLayout(
      ImageLayoutOption.INTRINSIC,
      imgWidth,
      imgHeight,
      {},
      "https://a.mktgcdn.com/p/uuid/20x10",
      width,
      height,
      undefined
    );

    expect(imgStyle.aspectRatio).toEqual(`${imgWidth} / ${imgHeight}`);
  });

  it(`properly sets src, imgStyle and widths when layout is ${ImageLayoutOption.FIXED} and only width is provided`, () => {
    const { src, imgStyle, widths } = handleLayout(
      ImageLayoutOption.FIXED,
      imgWidth,
      imgHeight,
      {},
      "https://a.mktgcdn.com/p/uuid/20x10",
      width,
      undefined,
      undefined
    );

    expect(src).toEqual(
      `https://dyn.mktgcdn.com/p/${imgUUID}/width=${width},height=${height}`
    );
    expect(imgStyle.width).toEqual(width);
    expect(imgStyle.height).toEqual(height);
    expect(widths).toEqual([width]);
  });

  it(`properly sets aspectRatio when layout is ${ImageLayoutOption.ASPECT} and aspectRatio is provided`, () => {
    const { imgStyle } = handleLayout(
      ImageLayoutOption.ASPECT,
      imgWidth,
      imgHeight,
      {},
      "https://a.mktgcdn.com/p/uuid/20x10",
      undefined,
      undefined,
      aspectRatio
    );

    expect(imgStyle.aspectRatio).toEqual(aspectRatio.toString());
  });

  it(`properly sets width when layout is ${ImageLayoutOption.FILL}`, () => {
    const { imgStyle } = handleLayout(
      ImageLayoutOption.FILL,
      imgWidth,
      imgHeight,
      {},
      "",
      undefined,
      undefined,
      aspectRatio
    );

    expect(imgStyle.width).toEqual("100%");
    expect(imgStyle.aspectRatio).toEqual(aspectRatio.toString());
  });
});

describe("validateRequiredProps", () => {
  it(`properly logs warning when layout is not ${ImageLayoutOption.FIXED} and width or height is provided`, () => {
    const logMock = vi.spyOn(console, "warn").mockImplementation(() => {
      /* do nothing */
    });

    expect(logMock.mock.calls.length).toBe(0);
    validateRequiredProps(
      ImageLayoutOption.INTRINSIC,
      imgWidth,
      imgHeight,
      width,
      undefined,
      undefined
    );
    expect(logMock.mock.calls.length).toBe(1);
    expect(logMock.mock.calls[0][0]).toBe(
      "Width or height is passed in but layout is not fixed. These will have no impact. If you want to have a fixed height or width then set layout to fixed."
    );
    vi.clearAllMocks();
  });

  it(`properly logs warning when layout is ${ImageLayoutOption.FIXED} and neither width nor height is provided`, () => {
    const logMock = vi.spyOn(console, "warn").mockImplementation(() => {
      /* do nothing */
    });

    expect(logMock.mock.calls.length).toBe(0);

    validateRequiredProps(
      ImageLayoutOption.FIXED,
      imgWidth,
      imgHeight,
      undefined,
      undefined,
      undefined
    );

    expect(logMock.mock.calls.length).toBe(1);
    expect(logMock.mock.calls[0][0]).toBe(
      "Using fixed layout but neither width nor height is passed as props."
    );
    vi.clearAllMocks();
  });

  it(`properly logs warning when layout is ${ImageLayoutOption.FIXED} and width is a negative value`, () => {
    const logMock = vi.spyOn(console, "warn").mockImplementation(() => {
      /* do nothing */
    });
    const invalidWidth = -100;

    expect(logMock.mock.calls.length).toBe(0);

    validateRequiredProps(
      ImageLayoutOption.FIXED,
      imgWidth,
      imgHeight,
      invalidWidth,
      undefined,
      undefined
    );

    expect(logMock.mock.calls.length).toBe(1);
    expect(logMock.mock.calls[0][0]).toBe(
      `Using fixed layout but width is invalid: ${invalidWidth}.`
    );
    vi.clearAllMocks();
  });

  it(`properly logs warning when layout is ${ImageLayoutOption.ASPECT} and aspectRatio is not provided`, () => {
    const logMock = vi.spyOn(console, "warn").mockImplementation(() => {
      /* do nothing */
    });

    expect(logMock.mock.calls.length).toBe(0);

    validateRequiredProps(
      ImageLayoutOption.ASPECT,
      imgWidth,
      imgHeight,
      undefined,
      undefined,
      undefined
    );

    expect(logMock.mock.calls.length).toBe(1);
    expect(logMock.mock.calls[0][0]).toBe(
      "Using aspect layout but aspectRatio is not passed as a prop."
    );
    vi.clearAllMocks();
  });

  it(`properly logs warning when image.width is a negative value`, () => {
    const logMock = vi.spyOn(console, "warn").mockImplementation(() => {
      /* do nothing */
    });
    const invalidImgWidth = -100;

    expect(logMock.mock.calls.length).toBe(0);

    validateRequiredProps(
      ImageLayoutOption.FILL,
      invalidImgWidth,
      imgHeight,
      undefined,
      undefined,
      undefined
    );

    expect(logMock.mock.calls.length).toBe(1);
    expect(logMock.mock.calls[0][0]).toBe(
      `Invalid image width: ${invalidImgWidth}.`
    );
    vi.clearAllMocks();
  });
});

describe("getImageSizeForFixedLayout", () => {
  it("properly sets fixedWidth and fixedHeight", () => {
    expect(
      getImageSizeForFixedLayout(
        imgWidth,
        imgHeight,
        widths,
        undefined,
        undefined
      )
    ).toEqual({
      fixedWidth: imgWidth,
      fixedHeight: imgHeight,
      fixedWidths: widths,
    });
    expect(
      getImageSizeForFixedLayout(imgWidth, imgHeight, widths, width, undefined)
    ).toEqual({ fixedWidth: width, fixedHeight: height, fixedWidths: [width] });
    expect(
      getImageSizeForFixedLayout(imgWidth, imgHeight, widths, undefined, height)
    ).toEqual({ fixedWidth: width, fixedHeight: height, fixedWidths: [width] });
    expect(
      getImageSizeForFixedLayout(imgWidth, imgHeight, widths, width, height)
    ).toEqual({ fixedWidth: width, fixedHeight: height, fixedWidths: [width] });
  });
});
