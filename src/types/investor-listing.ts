export interface InvestorListing {
  /** Unique identifier for this PREIshare listing record. */
  id: string;

  /** Short investor-facing title for the property or offering. */
  title: string;

  /** Plain-language summary of the investment opportunity. */
  summary: string;

  /** Asking price in whole US dollars. */
  askingPrice: number;

  /** Date when this listing was first created in PREIshare. */
  createdAt: string;

  /** Date when this listing was last updated in PREIshare. */
  updatedAt: string;
}