// mockDataService.ts
// Simplified mock data service without complex event listeners

import { StockData, MarketData, ConnectionState } from '../types/stockTypes';

// Mock stock symbols with initial data
const mockStocks: { [symbol: string]: StockData } = {
  'AAPL': {
    symbol: 'AAPL',
    price: 175.25,
    change: 2.35,
    changePercent: 1.36,
    volume: '45,678,912',
    timestamp: Date.now()
  },
  'MSFT': {
    symbol: 'MSFT',
    price: 325.76,
    change: 1.25,
    changePercent: 0.38,
    volume: '23,456,789',
    timestamp: Date.now()
  },
  'GOOGL': {
    symbol: 'GOOGL',
    price: 134.67,
    change: -0.89,
    changePercent: -0.66,
    volume: '12,345,678',
    timestamp: Date.now()
  },
  'AMZN': {
    symbol: 'AMZN',
    price: 128.91,
    change: 0.45,
    changePercent: 0.35,
    volume: '9,876,543',
    timestamp: Date.now()
  },
  'TSLA': {
    symbol: 'TSLA',
    price: 245.32,
    change: -5.67,
    changePercent: -2.26,
    volume: '34,567,890',
    timestamp: Date.now()
  },
  'NIFTY': {
    symbol: 'NIFTY',
    price: 22456.8,
    change: 123.45,
    changePercent: 0.55,
    volume: '156,789,012',
    timestamp: Date.now()
  },
  'SENSEX': {
    symbol: 'SENSEX',
    price: 73945.6,
    change: 345.67,
    changePercent: 0.47,
    volume: '234,567,890',
    timestamp: Date.now()
  }
};

// Initial market data
const initialMarketData: MarketData = {
  indices: {
    'NIFTY': mockStocks['NIFTY'],
    'SENSEX': mockStocks['SENSEX']
  },
  stocks: {
    'AAPL': mockStocks['AAPL'],
    'MSFT': mockStocks['MSFT'],
    'GOOGL': mockStocks['GOOGL'],
    'AMZN': mockStocks['AMZN'],
    'TSLA': mockStocks['TSLA']
  }
};

// Simplified mock data service
class MockDataService {
  private stockData: { [symbol: string]: StockData } = { ...mockStocks };
  private marketData: MarketData = { ...initialMarketData };
  private connectionState: ConnectionState = 'disconnected';
  private updateIntervals: { [symbol: string]: NodeJS.Timeout } = {};
  private listeners: { [key: string]: Array<(data: any) => void> } = {
    stockUpdate: [],
    indexUpdate: [],
    connectionState: []
  };
  
  // Connect to mock data source
  public connect(): void {
    this.setConnectionState('connecting');
    
    // Simulate connection delay
    setTimeout(() => {
      this.setConnectionState('connected');
    }, 1000);
  }
  
  // Disconnect from mock data source
  public disconnect(): void {
    // Clear all update intervals
    Object.values(this.updateIntervals).forEach(interval => clearInterval(interval));
    this.updateIntervals = {};
    
    this.setConnectionState('disconnected');
  }
  
  // Subscribe to symbol updates
  public subscribeToSymbol(symbol: string): void {
    if (this.updateIntervals[symbol]) {
      return; // Already subscribed
    }
    
    // If we don't have data for this symbol, create mock data
    if (!this.stockData[symbol]) {
      this.stockData[symbol] = {
        symbol,
        price: 100 + Math.random() * 900, // Random price between 100 and 1000
        change: Math.random() * 10 - 5, // Random change between -5 and 5
        changePercent: Math.random() * 5 - 2.5, // Random percent between -2.5% and 2.5%
        volume: `${Math.floor(Math.random() * 50)},${Math.floor(Math.random() * 1000)},${Math.floor(Math.random() * 1000)}`,
        timestamp: Date.now()
      };
    }
    
    // Start sending periodic updates
    this.updateIntervals[symbol] = setInterval(() => {
      this.updateStockPrice(symbol);
    }, 3000); // Update every 3 seconds
  }
  
  // Unsubscribe from symbol updates
  public unsubscribeFromSymbol(symbol: string): void {
    if (this.updateIntervals[symbol]) {
      clearInterval(this.updateIntervals[symbol]);
      delete this.updateIntervals[symbol];
    }
  }
  
  // Get current stock data for a symbol
  public getStockData(symbol: string): StockData | null {
    return this.stockData[symbol] || null;
  }
  
  // Get all market data
  public getMarketData(): MarketData {
    return this.marketData;
  }
  
  // Add event listener - simplified implementation
  public addEventListener(event: string, listener: (data: any) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    
    this.listeners[event].push(listener);
  }
  
  // Remove event listener - simplified implementation
  public removeEventListener(event: string, listener: (data: any) => void): void {
    if (!this.listeners[event]) return;
    
    this.listeners[event] = this.listeners[event].filter(l => l !== listener);
  }
  
  // Set connection state and notify listeners
  private setConnectionState(state: ConnectionState): void {
    this.connectionState = state;
    this.notifyListeners('connectionState', state);
  }
  
  // Update stock price with random movement
  private updateStockPrice(symbol: string): void {
    if (!this.stockData[symbol]) return;
    
    const currentPrice = this.stockData[symbol].price;
    const maxChange = currentPrice * 0.01; // Max 1% change per update
    const change = (Math.random() * maxChange * 2) - maxChange; // Random change between -maxChange and +maxChange
    const newPrice = Math.max(0.01, currentPrice + change); // Ensure price doesn't go below 0.01
    
    const changeFromPrevious = newPrice - currentPrice;
    const changePercentFromPrevious = (changeFromPrevious / currentPrice) * 100;
    
    const updatedStock: StockData = {
      ...this.stockData[symbol],
      price: newPrice,
      change: changeFromPrevious,
      changePercent: changePercentFromPrevious,
      timestamp: Date.now()
    };
    
    // Update stock data
    this.stockData[symbol] = updatedStock;
    
    // Update market data if this is a tracked stock
    if (this.marketData.stocks[symbol]) {
      this.marketData.stocks[symbol] = updatedStock;
    }
    
    // Update market data if this is a tracked index
    if (this.marketData.indices[symbol]) {
      this.marketData.indices[symbol] = updatedStock;
    }
    
    // Notify listeners
    this.notifyListeners('stockUpdate', { symbol, data: updatedStock });
  }
  
  // Notify all listeners of an event - simplified implementation
  private notifyListeners(event: string, data: any): void {
    if (!this.listeners[event]) return;
    
    this.listeners[event].forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error(`Error in ${event} listener:`, error);
      }
    });
  }
}

// Create and export singleton instance
export const mockDataService = new MockDataService();