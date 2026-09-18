export interface Address {
  /** Street number and name of the property. */
  line1: string;

  /** Unit, suite, or apartment number if needed. */
  line2?: string;

  /** City where the property is located. */
  city: string;

  /** State, province, or region. */
  region: string;

  /** Postal or ZIP code for the property. */
  postalCode: string;

  /** Country for the property location. */
  country: string;
}
