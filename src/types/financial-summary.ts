export interface FinancialSummary {
  /** Asked sale price for the property. */
  askingPrice: number;

  /** Currency used for the asking price. */
  currency: string;

  /** Optional projected return estimate. */
  projectedIrrPercent?: number;

  /** Optional cap rate estimate. */
  capRatePercent?: number;
}
