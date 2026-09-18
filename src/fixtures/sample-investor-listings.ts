import type { InvestorListing } from "../types";

export const draftSingleFamilyListing: InvestorListing = {
  id: "lis_draft_001",
  title: "Cedar Grove Value-Add Home",
  summary:
    "Well-located single-family asset with near-term cosmetic renovation potential and strong renter demand in a growing suburban submarket.",
  address: {
    line1: "1824 Cedar Grove Lane",
    city: "Austin",
    region: "TX",
    postalCode: "78704",
    country: "USA",
  },
  financialSummary: {
    askingPrice: 485000,
    currency: "USD",
    projectedIrrPercent: 14.8,
    capRatePercent: 6.4,
  },
  contacts: [
    {
      id: "contact_draft_001",
      name: "Alicia Moreno",
      role: "Listing Agent",
      email: "alicia.moreno@northbridge-re.com",
      phone: "+1 (512) 555-0191",
    },
    {
      id: "contact_draft_002",
      name: "Northbridge Residential Partners",
      role: "Sponsor",
      email: "investments@northbridge-re.com",
    },
  ],
  primaryContactId: "contact_draft_001",
  ownership: {
    name: "Northbridge Residential Partners",
    contactId: "contact_draft_002",
    relationship: "Sponsor",
    percentage: 100,
    notes: "Property held in a single-asset vehicle with value-add execution plan.",
  },
  createdAt: "2026-08-02T15:30:00.000Z",
  updatedAt: "2026-08-16T09:45:00.000Z",
  status: "draft",
  propertyType: "single_family",
};

export const activeMultiFamilyListing: InvestorListing = {
  id: "lis_active_002",
  title: "Harbor View Apartments",
  summary:
    "Stabilized multifamily property with durable occupancy, utility efficiency upgrades, and access to strong employer demand from the adjacent innovation district.",
  address: {
    line1: "2401 Harbor Avenue",
    line2: "Building C",
    city: "Seattle",
    region: "WA",
    postalCode: "98121",
    country: "USA",
  },
  financialSummary: {
    askingPrice: 9750000,
    currency: "USD",
    projectedIrrPercent: 12.6,
    capRatePercent: 5.9,
  },
  contacts: [
    {
      id: "contact_active_001",
      name: "Daniel Brooks",
      role: "Senior Investment Advisor",
      email: "daniel.brooks@pacificbridge.com",
      phone: "+1 (206) 555-0138",
    },
    {
      id: "contact_active_002",
      name: "Pacific Bridge Capital",
      role: "Operating Partner",
      email: "ops@pacificbridge.com",
    },
  ],
  primaryContactId: "contact_active_001",
  ownership: {
    name: "Harbor View Equity LLC",
    contactId: "contact_active_002",
    relationship: "Owner",
    percentage: 100,
    notes: "Long-term hold with recent lease-up initiatives and modest capex program.",
  },
  createdAt: "2025-11-12T12:00:00.000Z",
  updatedAt: "2026-09-10T16:20:00.000Z",
  status: "active",
  propertyType: "multi_family",
};

export const underContractCommercialListing: InvestorListing = {
  id: "lis_uc_003",
  title: "Summit Commerce Center",
  summary:
    "Five-building industrial campus offering diversified tenant mix, strong logistics access, and long-duration leases with embedded rent escalations.",
  address: {
    line1: "8800 Summit Commerce Boulevard",
    city: "Phoenix",
    region: "AZ",
    postalCode: "85040",
    country: "USA",
  },
  financialSummary: {
    askingPrice: 26850000,
    currency: "USD",
    projectedIrrPercent: 16.2,
    capRatePercent: 7.1,
  },
  contacts: [
    {
      id: "contact_uc_001",
      name: "Priya Shah",
      role: "Transaction Manager",
      email: "priya.shah@crestlineadvisory.com",
      phone: "+1 (602) 555-0199",
    },
    {
      id: "contact_uc_002",
      name: "Crestline Advisory Group",
      role: "Investment Banking",
      email: "team@crestlineadvisory.com",
    },
  ],
  primaryContactId: "contact_uc_001",
  ownership: {
    name: "Summit Industrial Holdings",
    contactId: "contact_uc_002",
    relationship: "Managing Member",
    percentage: 80,
    notes: "Seller is maintaining a minority carry interest while underwriting a sale to an institutional buyer.",
  },
  createdAt: "2026-01-14T08:00:00.000Z",
  updatedAt: "2026-09-11T11:40:00.000Z",
  status: "under_contract",
  propertyType: "commercial",
};

export const closedLandListing: InvestorListing = {
  id: "lis_closed_004",
  title: "Ridgeview Industrial Parcel",
  summary:
    "Raw land site with shovel-ready entitlement package, strategic highway frontage, and favorable rezoning upside for industrial development.",
  address: {
    line1: "4200 Ridgeview Road",
    city: "Dallas",
    region: "TX",
    postalCode: "75261",
    country: "USA",
  },
  financialSummary: {
    askingPrice: 5400000,
    currency: "USD",
    projectedIrrPercent: 19.4,
    capRatePercent: 0,
  },
  contacts: [
    {
      id: "contact_closed_001",
      name: "Evelyn Martinez",
      role: "Land Broker",
      email: "evelyn.martinez@altislandland.com",
      phone: "+1 (214) 555-0147",
    },
    {
      id: "contact_closed_002",
      name: "Altis Land Advisory",
      role: "Seller Representative",
      email: "info@altislandland.com",
    },
  ],
  primaryContactId: "contact_closed_001",
  ownership: {
    name: "Ridgeview Development Trust",
    contactId: "contact_closed_002",
    relationship: "Trustee",
    percentage: 100,
    notes: "Transaction closed after site plan approval and final purchase agreement execution.",
  },
  createdAt: "2025-04-22T09:15:00.000Z",
  updatedAt: "2026-02-07T14:50:00.000Z",
  status: "closed",
  closedAt: "2026-02-07T14:50:00.000Z",
  propertyType: "land",
};

export const sampleInvestorListings: InvestorListing[] = [
  draftSingleFamilyListing,
  activeMultiFamilyListing,
  underContractCommercialListing,
  closedLandListing,
];