import { LocalBusiness } from "./schemaTypes/LocalBusiness.js";
import { SchemaWrapper } from "./SchemaWrapper.js";

const doc = {
  __: {
    entityPageSet: {},
    name: "entity",
  },
  _env: {
    YEXT_PUBLIC_ANALYTICS_API_KEY: "1b360ec704e47b9fe53f34fbb0f2a370",
    YEXT_PUBLIC_MAPS_API_KEY: "AIzaSyAf5MdWCUFFeif-s8-3b0NIt1LmOd95AQ8",
  },
  _schema: {
    "@context": "https://schema.org",
    "@type": "Thing",
    description:
      "There's a Burger King® restaurant near you at 940 Lawrence Ave West. Visit us or call for more information. Every day, more than 11 million guests visit over 13,000 Burger King® restaurants near them in 97 countries around the world. And they do so because our fast food restaurants are known for serving high-quality, great-tasting and affordable food. The Burger King® restaurant in Toronto, ON serves burgers, breakfast, lunch and dinner prepared your way. The original HOME OF THE WHOPPER®, our commitment to quality ingredients, signature recipes, iconic sandwiches like the flame-grilled WHOPPER® Sandwich and fast, family-friendly dining experiences in a welcoming environment is what has defined our brand for more than 50 successful years.",
    name: "Burger King",
    url: "directory.yext.com/%!s(<nil>)",
  },
  _yext: {
    contentDeliveryAPIDomain: "https://cdn.yextapis.com",
    managementAPIDomain: "https://api.yext.com",
    platformDomain: "https://www.yext.com",
  },
  address: {
    city: "Toronto",
    countryCode: "CA",
    line1: "940 Lawrence Ave West",
    localizedCountryName: "Canada",
    localizedRegionName: "Ontario",
    postalCode: "M6A 1C4",
    region: "ON",
  },
  businessId: 0,
  description:
    "There's a Burger King® restaurant near you at 940 Lawrence Ave West. Visit us or call for more information. Every day, more than 11 million guests visit over 13,000 Burger King® restaurants near them in 97 countries around the world. And they do so because our fast food restaurants are known for serving high-quality, great-tasting and affordable food. The Burger King® restaurant in Toronto, ON serves burgers, breakfast, lunch and dinner prepared your way. The original HOME OF THE WHOPPER®, our commitment to quality ingredients, signature recipes, iconic sandwiches like the flame-grilled WHOPPER® Sandwich and fast, family-friendly dining experiences in a welcoming environment is what has defined our brand for more than 50 successful years.",
  facebookPageUrl: "https://www.facebook.com/134265579933118",
  hours: {
    friday: {
      isClosed: true,
    },
    monday: {
      openIntervals: [
        {
          end: "23:00",
          start: "00:00",
        },
      ],
    },
    saturday: {
      openIntervals: [
        {
          end: "23:59",
          start: "02:00",
        },
        {
          end: "01:00",
          start: "00:00",
        },
      ],
    },
    sunday: {
      openIntervals: [
        {
          end: "23:59",
          start: "00:00",
        },
      ],
    },
    thursday: {
      openIntervals: [
        {
          end: "23:59",
          start: "00:00",
        },
      ],
    },
    tuesday: {
      openIntervals: [
        {
          end: "05:30",
          start: "07:00",
        },
      ],
    },
    wednesday: {
      openIntervals: [
        {
          end: "23:59",
          start: "00:00",
        },
      ],
    },
  },
  id: "709",
  instagramHandle: "burgerkingcan",
  locale: "en",
  logo: {
    image: {
      height: 3788,
      url: "https://a.mktgcdn.com/p/QTBgr7_p93eAKBUnZCZTdLYxb-Uw30EuzAodZ7YTG04/3788x3788.png",
      width: 3788,
    },
  },
  mainPhone: "+14162569439",
  meta: {
    entityType: {
      id: "restaurant",
      uid: 5,
    },
    locale: "en",
  },
  name: "Burger King",
  photoGallery: [
    {
      image: {
        height: 250,
        url: "http://a.mktgcdn.com/p/WlnwwmOwQhwJBrO3-SMQKI9m4acwRbmlBBXY4g5cJaw/250x250.jpg",
        width: 250,
      },
    },
    {
      image: {
        height: 250,
        url: "http://a.mktgcdn.com/p/Y3z90OJv2DAOESKBN_XYBNx7cYrNiNtU9DO7k0BetfY/250x250.jpg",
        width: 250,
      },
    },
    {
      image: {
        height: 250,
        url: "http://a.mktgcdn.com/p/2Ezc1ySzhbdqLKxIjzIv2P7TzayeDivORE9TDlZSpeM/250x250.jpg",
        width: 250,
      },
    },
    {
      image: {
        height: 800,
        url: "http://a.mktgcdn.com/p/d4XtggL9QVc1fa_77qRfSvf41-ZGOJWBkLPtKaLO8EE/1400x800.jpg",
        width: 1400,
      },
    },
  ],
  ref_categories: [
    {
      name: "Restaurant",
    },
    {
      name: "Fast Food Restaurant",
    },
  ],
  ref_listings: [
    {
      listingUrl:
        "http://www.bing.com/maps?ss=ypid.YN1237x261910018&amp;amp;mkt=en-CA",
      publisher: "BING",
    },
    {
      listingUrl: "https://www.facebook.com/134265579933118",
      publisher: "FACEBOOK",
    },
    {
      listingUrl: "https://maps.google.com/maps?cid=13553689166373990046",
      publisher: "GOOGLEMYBUSINESS",
    },
  ],
  siteDomain: "directory.yext.com",
  siteId: 157201,
  siteInternalHostName: "directory.yext.com",
  timezone: "America/Toronto",
  twitterHandle: "burgerkingcan",
  uid: 8440226,
  websiteUrl: {
    displayUrl: "https://www.burgerking.ca/",
    url: "https://www.burgerking.ca/",
  },
  yextDisplayCoordinate: {
    latitude: 43.7142096466774,
    longitude: -79.4563959538936,
  },
};

export function SchemaBuilder(data: any): string {
  const url =
    data.document.landingPageUrl ??
    data.document.websiteUrl?.displayUrl ??
    data.document.websiteUrl?.url;

  const directionsLink = "directionslink";
  const localBusiness = data.document.address
    ? {
        ...LocalBusiness(data.document, "LocalBusiness"),
        url,
        hasMap: directionsLink,
        sameAs: [
          ...(data.document.facebookPageUrl
            ? [data.document.facebookPageUrl]
            : []),
          ...(data.document.linkedInUrl ? [data.document.linkedInUrl] : []),
          ...(data.document.tikTokUrl ? [data.document.tikTokUrl] : []),
          ...(data.document.pinterestUrl ? [data.document.pinterestUrl] : []),
          ...(data.document.instagramHandle
            ? [`https://www.instagram.com/${data.document.instagramHandle}`]
            : []),
          ...(data.document.twitterHandle
            ? [`https://x.com/${data.document.twitterHandle}`]
            : []),
        ],
      }
    : null;

  const json = {
    "@graph": [localBusiness && localBusiness],
  };

  return SchemaWrapper(json);
}

const s = SchemaBuilder({ document: doc });

console.log(s);
