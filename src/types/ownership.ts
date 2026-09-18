import type { InvestorContact } from "./investor-contact";

export interface Ownership {
  /** Name of the owner or entity associated with the ownership record. */
  name: string;

  /** Contact reference tied to this ownership row. */
  contactId: InvestorContact["id"];

  /** Relationship to the asset, when defined in the domain docs. */
  relationship: string;

  /** Optional percentage share for this ownership record. */
  percentage?: number;

  /** Optional notes about the ownership relationship. */
  notes?: string;
}
