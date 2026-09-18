import type { InvestorListing } from "../types";

export const draftSingleFamilyListing: InvestorListing = {
  id: "lis_draft_001",
  title: "Cedar Grove Bungalow",
  summary:
    "Move-in-ready single-family residence in a quiet neighborhood with strong rental demand and recent cosmetic upgrades.",
  address: {
    line1: "1847 Cedar Grove Lane",
    city: "Bend",
    region: "OR",
    postalCode: "97701",
    country: "USA",
  },
  financialSummary: {
    askingPrice: 485000,
    currency: "USD",
    projectedIrrPercent: 12.4,
    capRatePercent: 6.8,
  },
  contacts: [
    {
      id: "contact_draft_01",
      name: "Alicia Morgan",
      role: "Listing Agent",
      email: "alicia.morgan@northstarre.com",
      phone: "+1 (541) 555-0188",
    },
    {
      id: "contact_draft_02",
      name: "Harbor Capital Group",
      role: "Investor Sponsor",
      email: "partners@harborcapital.example",
      phone: "+1 (503) 555-0134",
    },
  ],
  primaryContactId: "contact_draft_01",
  ownership: {
    name: "Cedar Grove Homes LLC",
    relationship: "Seller",
    percentage: 100,
    notes: "Existing owner-operator with a pre-listing disclosure package available.",
  },
  createdAt: "2025-08-12T10:30:00.000Z",
  updatedAt: "2025-08-23T16:15:00.000Z",
  status: "draft",
  propertyType: "single_family",
};

export const activeMultiFamilyListing: InvestorListing = {
  id: "lis_active_002",
  title: "Willow Creek Apartments",
  summary:
    "Seven-unit multifamily property offering stable in-place cash flow, value-add renovation potential, and low vacancy history.",
  address: {
    line1: "930 Willow Creek Blvd",
    line2: "Unit 2",
    city: "Spokane",
    region: "WA",
    postalCode: "99201",
    country: "USA",
  },
  financialSummary: {
    askingPrice: 2150000,
    currency: "USD",
    projectedIrrPercent: 14.1,
    capRatePercent: 7.3,
  },
  contacts: [
    {
      id: "contact_active_01",
      name: "Daniel Ross",
      role: "Acquisition Lead",
      email: "daniel@atlasacq.example",
      phone: "+1 (509) 555-0177",
    },
    {
      id: "contact_active_02",
      name: "Mira Patel",
      role: "Property Manager",
      email: "mira@willowcreekpm.example",
    },
  ],
  primaryContactId: "contact_active_01",
  ownership: {
    name: "Valley Crest Partners",
    relationship: "Current Owner",
    percentage: 100,
    notes: "Long-term owner seeking a 1031 exchange transition with full rent roll available.",
  },
  createdAt: "2025-06-05T08:00:00.000Z",
  updatedAt: "2025-09-14T10:05:00.000Z",
  status: "active",
  propertyType: "multi_family",
};

export const underContractCommercialListing: InvestorListing = {
  id: "lis_under_contract_003",
  title: "Summit Commerce Center",
  summary:
    "Prime retail and flex space asset positioned near transit corridors with diversified tenant mix and strong occupancy trends.",
  address: {
    line1: "2400 Summit Commerce Way",
    city: "Denver",
    region: "CO",
    postalCode: "80202",
    country: "USA",
  },
  financialSummary: {
    askingPrice: 6400000,
    currency: "USD",
    projectedIrrPercent: 16.2,
    capRatePercent: 8.1,
  },
  contacts: [
    {
      id: "contact_uc_01",
      name: "Catherine Hsu",
      role: "Investment Advisor",
      email: "catherine@evergreenadvisory.example",
      phone: "+1 (303) 555-0199",
    },
    {
      id: "contact_uc_02",
      name: "Brightline Retail Advisors",
      role: "Broker",
      email: "info@brightline.example",
    },
  ],
  primaryContactId: "contact_uc_01",
  ownership: {
    name: "Summit Property Trust",
    relationship: "Seller",
    percentage: 65,
    contactId: "contact_uc_02",
    notes: "Joint venture ownership with a local operating partner handling tenant relations.",
  },
  createdAt: "2025-04-18T13:45:00.000Z",
  updatedAt: "2025-09-17T09:20:00.000Z",
  status: "under_contract",
  propertyType: "commercial",
};

export const closedLandListing: InvestorListing = {
  id: "lis_closed_004",
  title: "Mesa Vista Development Parcel",
  summary:
    "Raw development site with entitlements in progress and direct access to major regional infrastructure and utility corridors.",
  address: {
    line1: "Off Highway 93",
    line2: "Parcel B-17",
    city: "Kingman",
    region: "AZ",
    postalCode: "86409",
    country: "USA",
  },
  financialSummary: {
    askingPrice: 1280000,
    currency: "USD",
  },
  contacts: [
    {
      id: "contact_closed_01",
      name: "Lena Ortiz",
      role: "Development Broker",
      email: "lena@desertpathland.example",
      phone: "+1 (928) 555-0181",
    },
    {
      id: "contact_closed_02",
      name: "Northline Utilities",
      role: "Utility Coordination",
      email: "projects@northlineutilities.example",
    },
  ],
  primaryContactId: "contact_closed_01",
  ownership: {
    name: "Mesa Vista Land Co.",
    relationship: "Former Owner",
    percentage: 100,
    notes: "Acquired by a regional residential developer after a competitive bid process.",
  },
  createdAt: "2024-11-02T14:00:00.000Z",
  updatedAt: "2025-01-18T11:40:00.000Z",
  status: "closed",
  closedAt: "2025-01-15T12:00:00.000Z",
  propertyType: "land",
};

export const sampleInvestorListings: InvestorListing[] = [
  draftSingleFamilyListing,
  activeMultiFamilyListing,
  underContractCommercialListing,
  closedLandListing,
];
