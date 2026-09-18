export interface InvestorContact {
  /** Stable identifier for this contact within PREIshare. */
  id: string;

  /** Full name of the person or firm associated with the listing. */
  name: string;

  /** Role the contact plays on the listing. */
  role: string;

  /** Primary email address for this contact. */
  email: string;

  /** Optional phone number for this contact. */
  phone?: string;
}
