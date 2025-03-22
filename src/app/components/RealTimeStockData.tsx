'use client';

import { useState, useEffect } from 'react';
import { useStockData } from '../hooks/useStockData';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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

interface RealTimeStockDataProps {
  symbol: string;
  predictionResult?: PredictionResult;
}

const RealTimeStockData: React.FC<RealTimeStockDataProps> = ({ symbol, predictionResult }) => {
  const [historicalData, setHistoricalData] = useState<number[]>([]);
  const [timestamps, setTimestamps] = useState<string[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Use our custom hook to get real-time stock data
  const { 
    stockData, 
    connectionState, 
    isLoading, 
    error,
    subscribeToSymbol,
    unsubscribeFromSymbol 
  } = useStockData({
    symbols: [symbol],
    autoConnect: true
  });
  
  // Update historical data when new stock data arrives
  useEffect(() => {
    if (stockData[symbol]) {
      const currentTime = new Date();
      const timeString = `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`;
      
      setHistoricalData(prev => {
        const newData = [...prev, stockData[symbol].price];
        // Keep only the last 10 data points
        if (newData.length > 10) {
          return newData.slice(newData.length - 10);
        }
        return newData;
      });
      
      setTimestamps(prev => {
        const newTimestamps = [...prev, timeString];
        // Keep only the last 10 timestamps
        if (newTimestamps.length > 10) {
          return newTimestamps.slice(newTimestamps.length - 10);
        }
        return newTimestamps;
      });
      
      setLastUpdated(currentTime);
    }
  }, [stockData, symbol]);
  
  // Subscribe to symbol updates
  useEffect(() => {
    // Re-subscribe when symbol changes
    subscribeToSymbol(symbol);
    
    return () => {
      // Unsubscribe when component unmounts or symbol changes
      unsubscribeFromSymbol(symbol);
    };
  }, [symbol, subscribeToSymbol, unsubscribeFromSymbol]);
  
  // Create chart data
  const chartData = {
    labels: timestamps,
    datasets: [
      {
        label: 'Real-time Price',
        data: historicalData,
        borderColor: 'rgba(59, 130, 246, 0.8)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        pointRadius: 3,
        tension: 0.1
      },
      // Add prediction data if available
      predictionResult && {
        label: 'Predicted Price',
        data: Array(historicalData.length).fill(null).concat([
          predictionResult.currentPrice,
          predictionResult.oneMinuteProjection.price,
          predictionResult.fiveMinuteProjection.price
        ]),
        borderColor: 'rgba(6, 182, 212, 0.8)',
        backgroundColor: 'rgba(6, 182, 212, 0.2)',
        borderDash: [5, 5],
        pointRadius: 3,
        tension: 0.1
      }
    ].filter(Boolean)
  };
  
  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 8,
          padding: 3,
          font: {
            size: 8
          },
          color: '#e2e8f0'
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        titleFont: {
          size: 8
        },
        bodyFont: {
          size: 8
        },
        padding: 4
      }
    },
    scales: {
      y: {
        ticks: { 
          color: '#94a3b8',
          font: {
            size: 8
          },
          padding: 2
        },
        grid: { color: 'rgba(30, 64, 175, 0.1)' }
      },
      x: {
        ticks: { 
          color: '#94a3b8',
          font: {
            size: 8
          },
          padding: 2
        },
        grid: { color: 'rgba(30, 64, 175, 0.1)' }
      }
    },
    animation: {
      duration: 300
    }
  };
  
  return (
    <div className="bg-black/30 backdrop-blur-sm border border-blue-800/30 rounded-lg p-1 h-40">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-solid border-blue-500 border-r-transparent">
            <span className="sr-only">Loading...</span>
          </div>
          <span className="ml-2 text-[10px] text-blue-300">Connecting to market data...</span>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-full">
          <span className="text-[10px] text-red-400">Error connecting to market data</span>
        </div>
      ) : (
        <>
          <div className="h-32">
            <Line data={chartData} options={chartOptions} />
          </div>
          <div className="flex justify-between items-center mt-0.5 text-[9px] text-gray-400">
            <div>
              <span className={connectionState === 'connected' ? 'text-green-400' : 'text-yellow-400'}>●</span>
              <span className="ml-1">{connectionState === 'connected' ? 'Live' : 'Connecting...'}</span>
            </div>
            {lastUpdated && (
              <div>Updated: {lastUpdated.toLocaleTimeString()}</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default RealTimeStockData;