// mockMarketApi.ts
// Mock API client to replace real market data API

import { StockData, MarketData } from '../types/stockTypes';
import { mockDataService } from './mockDataService';

// Configuration for mock market API
interface MockMarketApiConfig {
  apiKey?: string;
}

// Mock market data API class
class MockMarketApi {
  private static instance: MockMarketApi;
  private isInitialized: boolean = false;
  private subscribedSymbols: Set<string> = new Set();
  
  // Singleton pattern
  public static getInstance(): MockMarketApi {
    if (!MockMarketApi.instance) {
      MockMarketApi.instance = new MockMarketApi();
    }
    return MockMarketApi.instance;
  }
  
  private constructor() {}
  
  // Initialize the API with configuration
  public initialize(config?: Partial<MockMarketApiConfig>): void {
    this.isInitialized = true;
    
    // Connect to mock data service
    this.connectWebSocket();
  }
  
  // Connect to mock data service
  public connectWebSocket(): void {
    if (!this.isInitialized) {
      console.error('Mock Market API not initialized. Call initialize() first.');
      return;
    }
    
    mockDataService.connect();
  }
  
  // Disconnect from mock data service
  public disconnectWebSocket(): void {
    mockDataService.disconnect();
  }
  
  // Get the mock data service instance
  public getStockDataService() {
    return mockDataService;
  }
  
  // Fetch initial stock data
  public async fetchInitialStockData(symbols: string[]): Promise<Map<string, StockData>> {
    if (!this.isInitialized) {
      throw new Error('Mock Market API not initialized. Call initialize() first.');
    }
    
    const stockDataMap = new Map<string, StockData>();
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get mock data for each symbol
    symbols.forEach(symbol => {
      // Subscribe to the symbol to ensure we have data
      mockDataService.subscribeToSymbol(symbol);
      
      // Get the current data
      const data = mockDataService.getStockData(symbol);
      if (data) {
        stockDataMap.set(symbol, data);
      }
    });
    
    return stockDataMap;
  }
  
  // Subscribe to real-time updates for a symbol
  public subscribeToSymbol(symbol: string): void {
    if (!this.isInitialized) {
      console.error('Mock Market API not initialized. Call initialize() first.');
      return;
    }
    
    this.subscribedSymbols.add(symbol);
    mockDataService.subscribeToSymbol(symbol);
  }
  
  // Unsubscribe from real-time updates for a symbol
  public unsubscribeFromSymbol(symbol: string): void {
    if (!this.isInitialized) {
      return;
    }
    
    this.subscribedSymbols.delete(symbol);
    mockDataService.unsubscribeFromSymbol(symbol);
  }
  
  // Get current stock data for a symbol
  public getStockData(symbol: string): StockData | null {
    return mockDataService.getStockData(symbol);
  }
  
  // Get all market data
  public getMarketData(): MarketData {
    return mockDataService.getMarketData();
  }
}

// Create and export singleton instance
export const mockMarketApi = MockMarketApi.getInstance();