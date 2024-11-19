# Provided components

## Address

Render a localized address from a Knowledge Graph field.

## Image

Render an image from a Knowledge Graph field.

## Link

Render an anchor tag with an `href` or from a `CTA` type Knowledge Graph field.

## Map

Render a map using either the `Mapbox` or `Google` provider.

## Marker

Render a marker in a Map component at a given coorindate.

## LocationMap

Render a Map component with a single marker that links to an `href`.

## Clusterer

Cluster the Marker components rendered within a Map component.

## JSON-LD Schema Markup

`SchemaWrapper` takes JSON-LD data and returns a `<script>` tag for use in the HeadConfig.

### Yext Fields

A set of adapter functions that take Yext fields (i.e. Address, Hours, CFTs, etc) and return a JSON object that matches schema.org specifications.

- AddressSchema
- LocationSchema
- OpeningHoursSchema
- OfferSchema
- PerformerSchema
- OrganizationSchema
- PhotoGallerySchema
- PhotoSchema
- ReviewSchema
- AggregateRatingSchema

### Schema Types

A set of functions that represent larger schema.org types, composed of data from several Yext fields. These can be thought of as Yext Entity level objects.

- BaseSchema
- Event
- FAQPage
- LocalBusiness
- Product
