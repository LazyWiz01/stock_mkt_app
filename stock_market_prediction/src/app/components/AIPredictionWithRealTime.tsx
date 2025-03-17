'use client';

import { useState, useEffect } from 'react';
import RealTimeStockData from './RealTimeStockData';

interface PredictionResult {
  currentPrice: number;
  oneMinuteProjection: {
    price: number;
    change: number;
    changePercent: number;
  };
  fiveMinuteProjection: {
    price: number;
    change: number;
    changePercent: number;
  };
}

interface AIPredictionWithRealTimeProps {
  symbol: string;
}

const AIPredictionWithRealTime: React.FC<AIPredictionWithRealTimeProps> = ({ symbol }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  
  // Update time on client-side only
  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' }));
  }, [predictionResult]);
  
  // Function to generate prediction
  const generatePrediction = () => {
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Mock prediction result
      const mockResult = {
        currentPrice: 182.63,
        oneMinuteProjection: {
          price: 183.12,
          change: 0.49,
          changePercent: 0.27
        },
        fiveMinuteProjection: {
          price: 184.05,
          change: 1.42,
          changePercent: 0.78
        }
      };
      
      setPredictionResult(mockResult);
      setIsLoading(false);
    }, 2000);
  };
  
  return (
    <div className="bg-black/20 backdrop-blur-sm border border-blue-800/30 rounded-xl p-4 shadow-lg">
      <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-200 mb-3">AI Stock Predictions</h2>
      
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
          <div className="flex-grow">
            <label htmlFor="stockSymbol" className="block text-xs font-medium text-blue-300 mb-1">Generate Price Prediction</label>
            <p className="text-xs text-blue-200">Our AI model predicts stock price movements in the next 1-5 minutes with high accuracy.</p>
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              id="stockSymbol" 
              value={symbol}
              readOnly
              className="bg-blue-900/30 border border-blue-700/50 rounded-md px-3 py-1 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-20 text-sm"
            />
            <button 
              onClick={generatePrediction}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? 'Predicting...' : 'Predict'}
            </button>
          </div>
        </div>
      </div>
      
      {predictionResult && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-black/30 backdrop-blur-sm border border-blue-800/30 rounded-lg p-2">
            <h3 className="text-xs font-medium text-blue-300 mb-1">Current Price</h3>
            <p className="text-lg font-bold text-white">${predictionResult.currentPrice.toFixed(2)}</p>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm border border-blue-800/30 rounded-lg p-2">
            <h3 className="text-xs font-medium text-blue-300 mb-1">1 Minute Projection</h3>
            <p className="text-lg font-bold text-white">${predictionResult.oneMinuteProjection.price.toFixed(2)}</p>
            <p className="text-xs text-green-400">+{predictionResult.oneMinuteProjection.change.toFixed(2)} (+{predictionResult.oneMinuteProjection.changePercent.toFixed(2)}%)</p>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm border border-blue-800/30 rounded-lg p-2">
            <h3 className="text-xs font-medium text-blue-300 mb-1">5 Minute Projection</h3>
            <p className="text-lg font-bold text-white">${predictionResult.fiveMinuteProjection.price.toFixed(2)}</p>
            <p className="text-xs text-green-400">+{predictionResult.fiveMinuteProjection.change.toFixed(2)} (+{predictionResult.fiveMinuteProjection.changePercent.toFixed(2)}%)</p>
          </div>
        </div>
      )}
      
      {/* Real-time stock data chart */}
      <div className="mt-4">
        <h3 className="text-sm font-medium text-white mb-2">Price Prediction Chart</h3>
        <RealTimeStockData symbol={symbol} predictionResult={predictionResult} />
      </div>
      
      <div className="mt-2 text-[10px] text-gray-400">
        Prediction generated at {currentTime} for {symbol}. Past performance is not indicative of future results.
      </div>
    </div>
  );
};

export default AIPredictionWithRealTime;