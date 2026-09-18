import type { Address } from "./address";
import type { FinancialSummary } from "./financial-summary";
import type { InvestorContact } from "./investor-contact";
import type { Ownership } from "./ownership";
import type { PropertyType } from "./property-type";

interface InvestorListingBase {
  /** Unique identifier for this PREIshare listing record. */
  readonly id: string;

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
  readonly createdAt: string;

  /** Date when this listing was last updated in PREIshare. */
  readonly updatedAt: string;

  /** Real-estate property category for the listing. */
  propertyType: PropertyType;
}

type InvestorListingDraft = InvestorListingBase & {
  /** Current workflow status of the listing. */
  status: "draft";
  closedAt?: undefined;
};

type InvestorListingActive = InvestorListingBase & {
  /** Current workflow status of the listing. */
  status: "active";
  closedAt?: undefined;
};

type InvestorListingUnderContract = InvestorListingBase & {
  /** Current workflow status of the listing. */
  status: "under_contract";
  closedAt?: undefined;
};

type InvestorListingClosed = InvestorListingBase & {
  /** Current workflow status of the listing. */
  status: "closed";

  /** Date when the listing was closed. */
  closedAt: string;
};

/** status is the discriminant used to determine which listing shape is valid. */
export type InvestorListing =
  | InvestorListingDraft
  | InvestorListingActive
  | InvestorListingUnderContract
  | InvestorListingClosed;