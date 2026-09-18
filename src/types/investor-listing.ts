import type { Address } from "./address";
import type { FinancialSummary } from "./financial-summary";
import type { InvestorContact } from "./investor-contact";
import type { ListingStatus } from "./listing-status";
import type { Ownership } from "./ownership";
import type { PropertyType } from "./property-type";

export interface InvestorListing {
  /** Unique identifier for this PREIshare listing record. */
  id: string;

  /** Short investor-facing title for the property or offering. */
  title: string;

  /** Plain-language summary of the investment opportunity. */
  summary: string;

  /** Address for the property being offered. */
  address: Address;

  /** Price and financial metrics for the offering. */
  financialSummary: FinancialSummary;

  /** Contact details associated with the listing. */
  contacts: InvestorContact[];

  /** Reference to the primary contact for this listing. */
  primaryContactId: InvestorContact["id"];

  /** Ownership details related to the asset. */
  ownership: Ownership;

  /** Date when this listing was first created in PREIshare. */
  createdAt: string;

  /** Date when this listing was last updated in PREIshare. */
  updatedAt: string;

  /** Current workflow status of the listing. */
  status: ListingStatus;

  /** Real-estate property category for the listing. */
  propertyType: PropertyType;
}