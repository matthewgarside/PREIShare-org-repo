export interface InvestorListing {
  /** Unique identifier for this PREIshare listing record. */
  listingId: string;

  /** Short investor-facing title for the property or offering. */
  listingTitle: string;

  /** Plain-language summary of the investment opportunity. */
  description: string;

  /** Date when this listing was first created in PREIshare. */
  createdDate: string;

  /** Date when this listing was last updated, if available. */
  updatedDate?: string;
}