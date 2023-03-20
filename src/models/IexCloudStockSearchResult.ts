export enum IexCloudSecurityType {
  ad = 'ADR', // ADR
  cs = 'Stock', // Common Stock
  cef = 'Closed End Fund', // Closed End Fund
  et = 'ETF', // ETF
  oef = 'Open Ended Fund', // Open Ended Fund
  ps = 'Preferred Stock', // Preferred Stock
  rt = 'Right', // Right
  struct = 'Structured Product', // Structured Product
  ut = 'Unit', // Unit
  wi = 'When Issued', // When Issued
  wt = 'Warrant', // Warrant
}

export interface IexCloudStockSearchResult {
  symbol: string;
  cik: string;
  securityName: string;
  securityType: IexCloudSecurityType;
  region: string;
  exchange: string;
  sector: string;
}

