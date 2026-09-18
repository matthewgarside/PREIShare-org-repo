import type { InvestorListing } from "../types";

// Intentionally wrong: the listing status must be one of the allowed union values.
export const invalidStatusString: InvestorListing = {
  id: "lis_invalid_status",
  title: "Harbor Point Townhomes",
  summary: "A well-located townhome project with upside in a strong rental corridor.",
  address: {
    line1: "110 Harbor Way",
    city: "Seattle",
    region: "WA",
    postalCode: "98101",
    country: "USA",
  },
  financialSummary: {
    askingPrice: 875000,
    currency: "USD",
    projectedIrrPercent: 15.3,
    capRatePercent: 5.8,
  },
  contacts: [
    {
      id: "contact_invalid_status",
      name: "Maya Brooks",
      role: "Listing Agent",
      email: "maya.brooks@example.com",
      phone: "+1 (206) 555-0101",
    },
  ],
  primaryContactId: "contact_invalid_status",
  ownership: {
    name: "Harbor Point Ventures",
    contactId: "contact_invalid_status",
    relationship: "Sponsor",
    percentage: 100,
  },
  createdAt: "2026-09-01T00:00:00.000Z",
  updatedAt: "2026-09-12T00:00:00.000Z",
  status: "pending_review",
  propertyType: "multi_family",
};

// Intentionally wrong: the address is missing the required city field.
export const missingAddressCity: InvestorListing = {
  id: "lis_missing_city",
  title: "Lakeview Residences",
  summary: "A small multifamily asset with stable occupancy and near-term value-add potential.",
  address: {
    line1: "229 Lakeview Avenue",
    region: "TX",
    postalCode: "78703",
    country: "USA",
  },
  financialSummary: {
    askingPrice: 420000,
    currency: "USD",
  },
  contacts: [
    {
      id: "contact_missing_city",
      name: "Elena Ruiz",
      role: "Broker",
      email: "elena.ruiz@example.com",
    },
  ],
  primaryContactId: "contact_missing_city",
  ownership: {
    name: "Lakeview Holdings",
    contactId: "contact_missing_city",
    relationship: "Owner",
    percentage: 100,
  },
  createdAt: "2026-08-05T12:00:00.000Z",
  updatedAt: "2026-09-11T12:00:00.000Z",
  status: "draft",
  propertyType: "single_family",
};

// Intentionally wrong: an ownership record is missing the required contact reference.
export const missingOwnershipContactId: InvestorListing = {
  id: "lis_missing_ownership_contact",
  title: "Riverview Flats",
  summary: "A compact mixed-income property with a stable local renter base.",
  address: {
    line1: "101 River Street",
    city: "Portland",
    region: "OR",
    postalCode: "97205",
    country: "USA",
  },
  financialSummary: {
    askingPrice: 950000,
    currency: "USD",
  },
  contacts: [
    {
      id: "contact_missing_ownership",
      name: "Rosa Patel",
      role: "Broker",
      email: "rosa.patel@example.com",
    },
  ],
  primaryContactId: "contact_missing_ownership",
  ownership: {
    name: "Riverview Partners",
    relationship: "Owner",
    percentage: 100,
  },
  createdAt: "2026-07-01T09:00:00.000Z",
  updatedAt: "2026-09-15T09:00:00.000Z",
  status: "active",
  propertyType: "multi_family",
};

// Intentionally wrong: financial numbers must be numbers, not strings.
export const financialNumberProvidedAsString: InvestorListing = {
  id: "lis_string_price",
  title: "Oak Lane Duplex",
  summary: "A duplex with modest renovation upside and a durable tenant profile.",
  address: {
    line1: "405 Oak Lane",
    city: "Austin",
    region: "TX",
    postalCode: "78704",
    country: "USA",
  },
  financialSummary: {
    askingPrice: "620000",
    currency: "USD",
    projectedIrrPercent: 18.4,
  },
  contacts: [
    {
      id: "contact_string_price",
      name: "Jon Park",
      role: "Investment Sales",
      email: "jon.park@example.com",
    },
  ],
  primaryContactId: "contact_string_price",
  ownership: {
    name: "Oak Lane Partners",
    contactId: "contact_string_price",
    relationship: "Owner",
    percentage: 100,
  },
  createdAt: "2026-02-09T08:30:00.000Z",
  updatedAt: "2026-09-13T08:30:00.000Z",
  status: "active",
  propertyType: "multi_family",
};

// Intentionally wrong: the contact record is missing the required name field.
export const missingContactName: InvestorListing = {
  id: "lis_missing_contact_name",
  title: "Crescent Industrial Park",
  summary: "Industrial facility with strong logistics access and a diversified tenant base.",
  address: {
    line1: "1900 Crescent Drive",
    city: "Phoenix",
    region: "AZ",
    postalCode: "85040",
    country: "USA",
  },
  financialSummary: {
    askingPrice: 9800000,
    currency: "USD",
    capRatePercent: 7.1,
  },
  contacts: [
    {
      id: "contact_missing_name",
      role: "Transaction Manager",
      email: "nora@crescentadvisory.com",
    },
  ],
  primaryContactId: "contact_missing_name",
  ownership: {
    name: "Crescent Industrial Holdings",
    contactId: "contact_missing_name",
    relationship: "Managing Member",
    percentage: 100,
  },
  createdAt: "2026-03-24T14:15:00.000Z",
  updatedAt: "2026-09-07T10:00:00.000Z",
  status: "under_contract",
  propertyType: "commercial",
};

// Intentionally wrong: the property type must be one of the defined enum-like literals.
export const invalidPropertyType: InvestorListing = {
  id: "lis_invalid_property_type",
  title: "Northwind Lot",
  summary: "A high-visibility land parcel near a major corridor with future residential potential.",
  address: {
    line1: "8300 Northwind Road",
    city: "Dallas",
    region: "TX",
    postalCode: "75249",
    country: "USA",
  },
  financialSummary: {
    askingPrice: 2500000,
    currency: "USD",
    projectedIrrPercent: 22.5,
  },
  contacts: [
    {
      id: "contact_invalid_property_type",
      name: "Chris Bennett",
      role: "Land Broker",
      email: "chris.bennett@example.com",
    },
  ],
  primaryContactId: "contact_invalid_property_type",
  ownership: {
    name: "Northwind Land LLC",
    contactId: "contact_invalid_property_type",
    relationship: "Owner",
    percentage: 100,
  },
  createdAt: "2025-11-10T09:00:00.000Z",
  updatedAt: "2026-09-06T09:00:00.000Z",
  status: "draft",
  propertyType: "condo",
};

// Intentionally wrong: closed listings require a closedAt timestamp, which is part of the discriminated union.
export const closedListingMissingClosedAt: InvestorListing = {
  id: "lis_closed_without_close_date",
  title: "Summit Campus Parcel",
  summary: "A fully developed campus parcel with a sold-out lease-up strategy and institutional buyer interest.",
  address: {
    line1: "1800 Summit Road",
    city: "Denver",
    region: "CO",
    postalCode: "80202",
    country: "USA",
  },
  financialSummary: {
    askingPrice: 14500000,
    currency: "USD",
    capRatePercent: 6.2,
  },
  contacts: [
    {
      id: "contact_closed_missing_date",
      name: "Sofia Nguyen",
      role: "Advisor",
      email: "sofia.nguyen@example.com",
    },
  ],
  primaryContactId: "contact_closed_missing_date",
  ownership: {
    name: "Summit Campus Trust",
    contactId: "contact_closed_missing_date",
    relationship: "Trustee",
    percentage: 100,
  },
  createdAt: "2025-08-14T09:00:00.000Z",
  updatedAt: "2026-09-08T09:00:00.000Z",
  status: "closed",
  propertyType: "commercial",
};
