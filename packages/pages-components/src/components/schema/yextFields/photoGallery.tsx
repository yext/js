export type PhotoGallery = Array<Photo>;

type Photo = {
  image: {
    url: string;
  };
};

// takes in a list of Yext images and return a list of image urls
export const PhotoGallerySchema = (gallery?: PhotoGallery) => {
  if (!gallery) {
    return {};
  }

  const imageArray = new Array<string>();

  for (const photo of gallery) {
    imageArray.push(photo.image.url);
  }

  return {
    image: imageArray,
  };
};

// takes in a single Yext image
export const PhotoSchema = (photo?: Photo) => {
  return (
    photo && {
      image: photo.image.url,
    }
  );
};