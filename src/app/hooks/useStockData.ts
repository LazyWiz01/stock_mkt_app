// useStockData.ts
// Custom hook for accessing stock data (using mock data)

import { useState, useEffect, useCallback, useRef } from 'react';
import { mockMarketApi } from '../services/mockMarketApi';
import { StockData, MarketData, ConnectionState } from '../types/stockTypes';

interface UseStockDataOptions {
  symbols?: string[];
  autoConnect?: boolean;
  apiKey?: string;
}

interface UseStockDataResult {
  stockData: { [symbol: string]: StockData };
  marketData: MarketData;
  connectionState: ConnectionState;
  isLoading: boolean;
  error: Error | null;
  connect: () => void;
  disconnect: () => void;
  subscribeToSymbol: (symbol: string) => void;
  unsubscribeFromSymbol: (symbol: string) => void;
}

// Default API configuration
const DEFAULT_CONFIG = {
  nseEndpoint: 'https://api.example.com/nse/quotes', // Replace with actual NSE API endpoint
  bseEndpoint: 'https://api.example.com/bse/quotes', // Replace with actual BSE API endpoint
  webSocketEndpoint: 'wss://stream.example.com/market', // Replace with actual WebSocket endpoint
};

export function useStockData(options: UseStockDataOptions = {}): UseStockDataResult {
  const { symbols = [], autoConnect = true, apiKey } = options;
  
  const [stockData, setStockData] = useState<{ [symbol: string]: StockData }>({});
  const [marketData, setMarketData] = useState<MarketData>({ indices: {}, stocks: {} });
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  
  // Use refs to track subscribed symbols and update intervals
  const subscribedSymbolsRef = useRef<Set<string>>(new Set());
  const updateIntervalsRef = useRef<{ [symbol: string]: NodeJS.Timeout }>({});
  
  // Initialize the API
  useEffect(() => {
    if (!isInitialized) {
      try {
        mockMarketApi.initialize({
          ...DEFAULT_CONFIG,
          apiKey,
        });
        setIsInitialized(true);
        
        if (autoConnect) {
          connect();
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize market data API'));
      }
    }
    
    return () => {
      // Cleanup on unmount
      disconnect();
      
      // Clear all update intervals
      Object.values(updateIntervalsRef.current).forEach(interval => clearInterval(interval));
      updateIntervalsRef.current = {};
    };
  }, [isInitialized, apiKey, autoConnect]);
  
  // Subscribe to symbols
  useEffect(() => {
    if (isInitialized && symbols.length > 0 && connectionState === 'connected') {
      // Fetch initial data
      fetchInitialData(symbols);
      
      // Subscribe to real-time updates
      symbols.forEach(symbol => {
        subscribeToSymbol(symbol);
      });
    }
    
    return () => {
      // Unsubscribe when symbols change or component unmounts
      if (isInitialized && symbols.length > 0) {
        symbols.forEach(symbol => {
          unsubscribeFromSymbol(symbol);
        });
      }
    };
  }, [isInitialized, symbols, connectionState]);
  
  // Setup periodic updates for subscribed symbols
  const setupSymbolUpdates = useCallback((symbol: string) => {
    // Clear existing interval if any
    if (updateIntervalsRef.current[symbol]) {
      clearInterval(updateIntervalsRef.current[symbol]);
    }
    
    // Create new interval for updates
    updateIntervalsRef.current[symbol] = setInterval(() => {
      // Get current data
      const currentData = mockMarketApi.getStockData(symbol);
      if (currentData) {
        // Update stock data
        setStockData(prev => ({
          ...prev,
          [symbol]: currentData
        }));
        
        // Update market data if needed
        setMarketData(prev => {
          const newMarketData = { ...prev };
          
          // Update stocks if this is a stock
          if (prev.stocks[symbol]) {
            newMarketData.stocks = {
              ...prev.stocks,
              [symbol]: currentData
            };
          }
          
          // Update indices if this is an index
          if (prev.indices[symbol]) {
            newMarketData.indices = {
              ...prev.indices,
              [symbol]: currentData
            };
          }
          
          return newMarketData;
        });
      }
    }, 3000); // Update every 3 seconds
  }, []);
  
  // Fetch initial data for symbols
  const fetchInitialData = async (symbolsToFetch: string[]) => {
    if (!isInitialized || symbolsToFetch.length === 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await mockMarketApi.fetchInitialStockData(symbolsToFetch);
      
      // Update stock data state
      const newStockData: { [symbol: string]: StockData } = {};
      data.forEach((stockData, symbol) => {
        newStockData[symbol] = stockData;
      });
      
      setStockData(prev => ({
        ...prev,
        ...newStockData
      }));
      
      // Setup periodic updates for each symbol
      symbolsToFetch.forEach(symbol => {
        setupSymbolUpdates(symbol);
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch initial stock data'));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Connect to WebSocket
  const connect = useCallback(() => {
    if (!isInitialized) return;
    
    try {
      setConnectionState('connecting');
      
      // Simulate connection delay
      setTimeout(() => {
        setConnectionState('connected');
        
        // Re-subscribe to symbols when connection is established
        if (subscribedSymbolsRef.current.size > 0) {
          const symbolsToResubscribe = Array.from(subscribedSymbolsRef.current);
          fetchInitialData(symbolsToResubscribe);
        }
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to connect to WebSocket'));
    }
  }, [isInitialized]);
  
  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (!isInitialized) return;
    
    try {
      // Clear all update intervals
      Object.values(updateIntervalsRef.current).forEach(interval => clearInterval(interval));
      updateIntervalsRef.current = {};
      
      setConnectionState('disconnected');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to disconnect from WebSocket'));
    }
  }, [isInitialized]);
  
  // Subscribe to a symbol
  const subscribeToSymbol = useCallback((symbol: string) => {
    if (!isInitialized || !symbol) return;
    
    // Add to subscribed symbols
    subscribedSymbolsRef.current.add(symbol);
    
    // If connected, setup updates
    if (connectionState === 'connected') {
      mockMarketApi.subscribeToSymbol(symbol);
      setupSymbolUpdates(symbol);
    }
  }, [isInitialized, connectionState, setupSymbolUpdates]);
  
  // Unsubscribe from a symbol
  const unsubscribeFromSymbol = useCallback((symbol: string) => {
    if (!isInitialized || !symbol) return;
    
    // Remove from subscribed symbols
    subscribedSymbolsRef.current.delete(symbol);
    
    // Clear update interval
    if (updateIntervalsRef.current[symbol]) {
      clearInterval(updateIntervalsRef.current[symbol]);
      delete updateIntervalsRef.current[symbol];
    }
    
    mockMarketApi.unsubscribeFromSymbol(symbol);
  }, [isInitialized]);
  
  return {
    stockData,
    marketData,
    connectionState,
    isLoading,
    error,
    connect,
    disconnect,
    subscribeToSymbol,
    unsubscribeFromSymbol
  };
}