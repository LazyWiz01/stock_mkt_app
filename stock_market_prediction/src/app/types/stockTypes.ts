// stockTypes.ts
// Type definitions for stock data

export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string | number;
  timestamp: number;
}

export interface MarketData {
  indices: { [symbol: string]: StockData };
  stocks: { [symbol: string]: StockData };
}

export type ConnectionState = 'connected' | 'connecting' | 'disconnected';