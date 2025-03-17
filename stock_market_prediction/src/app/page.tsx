"use client";

// Removed unused imports
import { useState, useRef } from "react";
import { Line } from "react-chartjs-2";
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
import FinancialNews from "./components/FinancialNews";
import AIPredictionWithRealTime from "./components/AIPredictionWithRealTime";

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

export default function Home() {
  // Remove activeSection state as we'll show all sections on one page
  const [investorType, setInvestorType] = useState('moderate');
  const [stockSymbol, setStockSymbol] = useState('AAPL');
  const [isLoading, setIsLoading] = useState(false);
  // Define the type for prediction result
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
  
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  
  // Chart options for dashboard charts
  const dashboardChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return value.toLocaleString();
          },
          color: '#94a3b8'
        },
        grid: { color: 'rgba(30, 64, 175, 0.1)' }
      },
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(30, 64, 175, 0.1)' }
      }
    },
    elements: {
      line: {
        tension: 0.4
      }
    }
  };

  // Market data for charts already defined above
  // Using the existing marketData state
  const marketData = {
    sp500: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      values: [4500, 4550, 4600, 4580, 4620, 4700, 4750, 4800, 4780, 4850, 4900, 4950],
      change: 1.2
    },
    nasdaq: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      values: [14000, 14200, 14400, 14300, 14500, 14700, 14800, 15000, 14900, 15200, 15400, 15500],
      change: 0.8
    },
    dowJones: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      values: [35000, 35200, 35400, 35300, 35100, 35000, 34900, 34800, 34700, 34600, 34500, 34400],
      change: -0.3
    }
  };
  
  // Function to create chart data for dashboard
  function createChartData(labels: string[], values: number[], color: string) {
    return {
      labels,
      datasets: [
        {
          label: 'Price',
          data: values,
          borderColor: color,
          backgroundColor: `${color}33`, // Add transparency
          fill: true,
          pointRadius: 2,
          pointBackgroundColor: color,
        },
      ],
    };
  };
  
  // Mock data for market indices
  const indexData = [
    { symbol: 'S&P 500', currentPrice: 4486.49, change: 19.70, changePercent: 0.44 },
    { symbol: 'NASDAQ', currentPrice: 13917.89, change: 128.41, changePercent: 0.93 },
    { symbol: 'DOW', currentPrice: 34991.21, change: -45.66, changePercent: -0.13 },
    { symbol: 'RUSSELL 2000', currentPrice: 1875.31, change: 4.53, changePercent: 0.24 },
  ];
  
  // Add refs for each section to enable smooth scrolling
  const homeRef = useRef(null);
  const dashboardRef = useRef(null);
  const predictionsRef = useRef(null);
  const analysisRef = useRef(null);
  
  // Function to scroll to a section
  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Add missing variable definitions
  const marketHealth = 65; // Mock market health percentage
  const advancesDeclines = { advances: 287, declines: 213 }; // Mock advances/declines data
  
  // Mock AI insights data
  const aiInsights = {
    historicalPerformance: "AAPL has shown strong performance over the past year, outperforming the S&P 500 by 12.3%.",
    movingAverages: "All major moving averages indicate a bullish trend with the 50-day MA crossing above the 200-day MA.",
    aiOutlook: "Our AI model predicts a positive outlook for AAPL in the next 3-6 months with potential upside of 8-12%.",
    sentiment: "Market sentiment is predominantly positive with institutional investors increasing their positions."
  };
  
  // Mock prediction chart options
  const predictionChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#e2e8f0'
        }
      },
      title: {
        display: true,
        text: 'Price Prediction Chart',
        color: '#e2e8f0'
      },
    },
    scales: {
      y: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(30, 64, 175, 0.1)' }
      },
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(30, 64, 175, 0.1)' }
      }
    }
  };
  
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
  
  // Function to create prediction chart data
  const createPredictionChartData = () => {
    if (!predictionResult) return null;
    
    return {
      labels: ['5 min ago', '4 min ago', '3 min ago', '2 min ago', '1 min ago', 'Current', '1 min forecast', '2 min forecast', '3 min forecast', '4 min forecast', '5 min forecast'],
      datasets: [
        {
          label: 'Historical Price',
          data: [181.20, 181.45, 181.80, 182.15, 182.40, predictionResult.currentPrice, null, null, null, null, null],
          borderColor: 'rgba(59, 130, 246, 0.8)',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          pointRadius: 4,
          tension: 0.1
        },
        {
          label: 'Predicted Price',
          data: [null, null, null, null, null, predictionResult.currentPrice, 
                 predictionResult.currentPrice + (predictionResult.oneMinuteProjection.change / 5),
                 predictionResult.currentPrice + (predictionResult.oneMinuteProjection.change * 2 / 5),
                 predictionResult.currentPrice + (predictionResult.oneMinuteProjection.change * 3 / 5),
                 predictionResult.currentPrice + (predictionResult.oneMinuteProjection.change * 4 / 5),
                 predictionResult.fiveMinuteProjection.price],
          borderColor: 'rgba(6, 182, 212, 0.8)',
          backgroundColor: 'rgba(6, 182, 212, 0.2)',
          borderDash: [5, 5],
          pointRadius: 4,
          tension: 0.1
        }
      ]
    };
  };
  // Mock data for dashboard
  const stockData = [
    { id: 1, symbol: 'AAPL', name: 'Apple Inc.', price: 182.63, change: 1.25, changePercent: 0.69 },
    { id: 2, symbol: 'MSFT', name: 'Microsoft Corp.', price: 337.22, change: 2.15, changePercent: 0.64 },
    { id: 3, symbol: 'GOOGL', name: 'Alphabet Inc.', price: 131.86, change: -0.57, changePercent: -0.43 },
    { id: 4, symbol: 'AMZN', name: 'Amazon.com Inc.', price: 127.74, change: 0.83, changePercent: 0.65 },
    { id: 5, symbol: 'NVDA', name: 'NVIDIA Corp.', price: 411.17, change: 7.62, changePercent: 1.89 },
  ];
  
  // Market data for charts already defined above
  // Using the existing marketData state

  
  // Mock analysis data
  // Commented out unused variable
  /*
  const mockAnalysisData = {
    AAPL: {
      price: 182.63,
      change: 1.25,
      volume: '58.7M',
      marketCap: '$2.87T',
      pe: 30.42,
      dividend: 0.51,
      technicalIndicators: {
        rsi: 64,
        macd: 'Bullish',
        movingAverages: 'Buy',
        supportLevel: 180.50,
        resistanceLevel: 185.00
      },
      fundamentalAnalysis: {
        revenueGrowth: 12.5,
        profitMargin: 25.3,
        debtToEquity: 1.2,
        returnOnEquity: 35.6,
        cashFlow: 'Strong'
      },
      sentimentAnalysis: {
        newsScore: 7.8,
        socialMediaScore: 8.0,
        analystRating: 'Buy',
        institutionalSentiment: 'Positive',
        insiderTrading: 'Neutral'
      },
      riskAssessment: {
        volatility: 'Medium',
        beta: 1.28,
        sharpeRatio: 0.82,
        valueAtRisk: '3.0%'
      }
    }
  };
  
  // Function to handle investor type tab change
  const handleTabChange = (type: string) => {
    setInvestorType(type);
  };
  
  // Chart options for dashboard charts
  const dashboardChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return value.toLocaleString();
          },
          color: '#94a3b8'
        },
        grid: { color: 'rgba(30, 64, 175, 0.1)' }
      },
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(30, 64, 175, 0.1)' }
      }
    },
    elements: {
      line: {
        tension: 0.4
      }
    }
  };
  

  
  // Chart options for dashboard charts
  const dashboardChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return value.toLocaleString();
          },
          color: '#94a3b8'
        },
        grid: { color: 'rgba(30, 64, 175, 0.1)' }
      },
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(30, 64, 175, 0.1)' }
      }
    },
    elements: {
      line: {
        tension: 0.4
      }
    }
  };

  // Mock data for news
  // Commented out unused variable
  /* const newsItems = [
    { id: 1, title: 'Fed signals potential rate cuts in upcoming meeting', source: 'Financial Times', date: '2 hours ago' },
    { id: 2, title: 'Tech stocks rally as inflation concerns ease', source: 'Wall Street Journal', date: '4 hours ago' },
    { id: 3, title: 'Retail sales exceed expectations in Q3', source: 'Bloomberg', date: '6 hours ago' },
  ]; */

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-black border-b border-blue-800/50 shadow-lg sticky top-0 z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Smart Stocks</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button 
                  onClick={() => scrollToSection(homeRef)}
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-gray-300 hover:border-blue-400 hover:text-blue-200 text-sm font-medium transition-colors duration-200"
                >
                  Home
                </button>
                <button 
                  onClick={() => scrollToSection(dashboardRef)}
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-gray-300 hover:border-blue-400 hover:text-blue-200 text-sm font-medium transition-colors duration-200"
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => scrollToSection(predictionsRef)}
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-gray-300 hover:border-blue-400 hover:text-blue-200 text-sm font-medium transition-colors duration-200"
                >
                  Predictions
                </button>
                <button 
                  onClick={() => scrollToSection(analysisRef)}
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-gray-300 hover:border-blue-400 hover:text-blue-200 text-sm font-medium transition-colors duration-200"
                >
                  Analysis
                </button>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <button className="bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 rounded-md text-white font-medium hover:from-blue-700 hover:to-cyan-600 transition-all duration-200 shadow-md">
                Sign In
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Index Ticker Bar */}
      <div className="bg-black py-2 border-b border-blue-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-6 overflow-x-auto scrollbar-hide">
            {(indexData || []).map((index, i) => (
              <div key={i} className="flex items-center space-x-2 whitespace-nowrap">
                <span className="text-gray-300 text-xs">{index.symbol}</span>
                <span className="text-white text-xs font-medium">{index.currentPrice.toFixed(2)}</span>
                <span className={`text-xs ${index.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)} ({index.change >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main>
        {/* Home Section */}
        <section ref={homeRef} className="min-h-screen py-10" id="home">
          <>
            {/* Hero Section */}
            <div className="relative overflow-hidden">
              <div className="max-w-7xl mx-auto">
                <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
                  <div className="pt-10 mx-auto max-w-7xl px-4 sm:pt-12 sm:px-6 md:pt-16 lg:pt-20 lg:px-8 xl:pt-28">
                    <div className="sm:text-center lg:text-center">
                      <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                        <span className="block">Predict the market</span>
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">with AI precision</span>
                      </h1>
                      <p className="mt-3 text-base text-blue-200 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
                        Smart Stocks uses advanced machine learning algorithms to analyze market trends and provide accurate stock predictions to help you make informed investment decisions.
                      </p>
                      <div className="mt-5 sm:mt-8 sm:flex sm:justify-center">
                        <div className="rounded-md shadow">
                          <button 
                            onClick={() => scrollToSection(dashboardRef)}
                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition-all duration-200 shadow-md md:py-4 md:text-lg md:px-10"
                          >
                            Get started
                          </button>
                        </div>
                        <div className="mt-3 sm:mt-0 sm:ml-3">
                          <button 
                            onClick={() => scrollToSection(predictionsRef)}
                            className="w-full flex items-center justify-center px-8 py-3 border border-blue-700/50 text-base font-medium rounded-md text-blue-100 bg-blue-900/30 backdrop-blur-sm hover:bg-blue-800/40 transition-all duration-200 md:py-4 md:text-lg md:px-10"
                          >
                            Try predictions
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Section */}
            <div className="py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center">
                  <h2 className="text-base text-cyan-400 font-semibold tracking-wide uppercase">Features</h2>
                  <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
                    Smart investment decisions
                  </p>
                  <p className="mt-4 max-w-2xl text-xl text-blue-200 lg:mx-auto">
                    Our platform provides comprehensive tools to analyze stocks and predict market trends.
                  </p>
                </div>

                <div className="mt-10">
                  <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                    {/* Feature items remain the same */}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-black/20 backdrop-blur-sm border border-blue-800/30 rounded-xl mx-4 sm:mx-8 lg:mx-16 overflow-hidden">
              <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  <span className="block">Ready to dive in?</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Start your investment journey today.</span>
                </h2>
                <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                  <div className="inline-flex rounded-md shadow">
                    <button 
                      onClick={() => scrollToSection(dashboardRef)}
                      className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-900 bg-gradient-to-r from-blue-200 to-cyan-200 hover:from-blue-300 hover:to-cyan-300 transition-all duration-200"
                    >
                      Get started
                    </button>
                  </div>
                  <div className="ml-3 inline-flex rounded-md shadow">
                    <button 
                      onClick={() => scrollToSection(analysisRef)}
                      className="inline-flex items-center justify-center px-5 py-3 border border-blue-700/50 text-base font-medium rounded-md text-white bg-blue-900/30 backdrop-blur-sm hover:bg-blue-800/40 transition-all duration-200"
                    >
                      Learn more
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        </section>

        {/* Dashboard Section */}
        <section ref={dashboardRef} className="min-h-screen py-10 border-t border-blue-800/30" id="dashboard">
        <div className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-200">Stock Market Dashboard</h1>
            <p className="mt-2 text-blue-200">
              Welcome to your personalized dashboard. View predictions and analysis based on your investor profile.
            </p>
            
            {/* Investor Type Tabs */}
            <div className="mt-6 bg-black backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-blue-800/30">
              <div className="border-b border-blue-800/50">
                <nav className="-mb-px flex" aria-label="Tabs">
                  <button
                    onClick={() => handleTabChange('conservative')}
                    className={`${investorType === 'conservative' ? 'border-blue-500 text-blue-300' : 'border-transparent text-gray-400 hover:text-blue-200 hover:border-blue-400'} whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200`}
                  >
                    Conservative
                  </button>
                  <button
                    onClick={() => handleTabChange('moderate')}
                    className={`${investorType === 'moderate' ? 'border-blue-500 text-blue-300' : 'border-transparent text-gray-400 hover:text-blue-200 hover:border-blue-400'} whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200`}
                  >
                    Moderate
                  </button>
                  <button
                    onClick={() => handleTabChange('aggressive')}
                    className={`${investorType === 'aggressive' ? 'border-blue-500 text-blue-300' : 'border-transparent text-gray-400 hover:text-blue-200 hover:border-blue-400'} whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200`}
                  >
                    Aggressive
                  </button>
                </nav>
              </div>

              {/* Dashboard Content */}
              <div className="px-4 py-5 sm:p-6">
                {/* Stock Charts Section */}
                <div className="mb-8">
                  <h2 className="text-lg font-medium text-white mb-4">Market Overview</h2>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Interactive Charts */}
                    <div className="bg-black rounded-lg p-4 h-64 shadow-lg border border-blue-800/50">
                      <div className="h-48">
                        <Line 
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                display: false,
                              },
                              tooltip: {
                                mode: 'index',
                                intersect: false,
                              }
                            },
                            scales: {
                              y: {
                                ticks: {
                                  callback: function(value) {
                                    return value.toLocaleString();
                                  },
                                  color: '#94a3b8'
                                },
                                grid: { color: 'rgba(30, 64, 175, 0.1)' }
                              },
                              x: {
                                ticks: { color: '#94a3b8' },
                                grid: { color: 'rgba(30, 64, 175, 0.1)' }
                              }
                            },
                            elements: {
                              line: {
                                tension: 0.4
                              }
                            }
                          }}
                          data={createChartData(marketData.sp500.labels, marketData.sp500.values, '#38bdf8')} 
                        />
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <p className="text-sm font-medium text-white">S&P 500</p>
                        <p className={`text-xs ${marketData.sp500.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {marketData.sp500.change > 0 ? '+' : ''}{marketData.sp500.change}% today
                        </p>
                      </div>
                    </div>
                    <div className="bg-black rounded-lg p-4 h-64 shadow-lg border border-blue-800/50">
                      <div className="h-48">
                        <Line 
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                display: false,
                              },
                              tooltip: {
                                mode: 'index',
                                intersect: false,
                              }
                            },
                            scales: {
                              y: {
                                ticks: {
                                  callback: function(value) {
                                    return value.toLocaleString();
                                  },
                                  color: '#94a3b8'
                                },
                                grid: { color: 'rgba(30, 64, 175, 0.1)' }
                              },
                              x: {
                                ticks: { color: '#94a3b8' },
                                grid: { color: 'rgba(30, 64, 175, 0.1)' }
                              }
                            },
                            elements: {
                              line: {
                                tension: 0.4
                              }
                            }
                          }}
                          data={createChartData(marketData.nasdaq.labels, marketData.nasdaq.values, '#22d3ee')} 
                        />
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <p className="text-sm font-medium text-white">NASDAQ</p>
                        <p className={`text-xs ${marketData.nasdaq.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {marketData.nasdaq.change > 0 ? '+' : ''}{marketData.nasdaq.change}% today
                        </p>
                      </div>
                    </div>
                    <div className="bg-black rounded-lg p-4 h-64 shadow-lg border border-blue-800/50">
                      <div className="h-48">
                        <Line 
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                display: false,
                              },
                              tooltip: {
                                mode: 'index',
                                intersect: false,
                              }
                            },
                            scales: {
                              y: {
                                ticks: {
                                  callback: function(value) {
                                    return value.toLocaleString();
                                  },
                                  color: '#94a3b8'
                                },
                                grid: { color: 'rgba(30, 64, 175, 0.1)' }
                              },
                              x: {
                                ticks: { color: '#94a3b8' },
                                grid: { color: 'rgba(30, 64, 175, 0.1)' }
                              }
                            },
                            elements: {
                              line: {
                                tension: 0.4
                              }
                            }
                          }}
                          data={createChartData(marketData.dowJones.labels, marketData.dowJones.values, '#0ea5e9')} 
                        />
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <p className="text-sm font-medium text-white">Dow Jones</p>
                        <p className={`text-xs ${marketData.dowJones.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {marketData.dowJones.change > 0 ? '+' : ''}{marketData.dowJones.change}% today
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations Section */}
                <div>
                  <h2 className="text-lg font-medium text-white mb-4">Recommended Stocks</h2>
                  <div className="bg-black backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-blue-800/30">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-blue-800/30">
                        <thead className="bg-black">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">Stock</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">Current Price</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">Predicted Change</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">Risk Level</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">Recommendation</th>
                          </tr>
                        </thead>
                        <tbody className="bg-black divide-y divide-blue-800/30">
                          {/* Conservative Stocks */}
                          {investorType === 'conservative' && (
                            <>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">JNJ</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">$165.32</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">+2.1%</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">Low</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900/70 text-green-200 border border-green-700">Buy</span>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">PG</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">$142.87</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">+1.8%</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">Low</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900/70 text-green-200 border border-green-700">Buy</span>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">KO</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">$58.65</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">+1.5%</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">Low</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900/70 text-blue-200 border border-blue-700">Hold</span>
                                </td>
                              </tr>
                            </>
                          )}
                          
                          {/* Moderate Stocks */}
                          {investorType === 'moderate' && (
                            <>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">AAPL</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">$182.63</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">+3.9%</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">Medium</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900/70 text-green-200 border border-green-700">Buy</span>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">MSFT</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">$340.25</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">+3.7%</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">Medium</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900/70 text-green-200 border border-green-700">Buy</span>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">GOOGL</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">$131.86</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">+3.5%</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">Medium</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900/70 text-green-200 border border-green-700">Buy</span>
                                </td>
                              </tr>
                            </>
                          )}
                          
                          {/* Aggressive Stocks */}
                          {investorType === 'aggressive' && (
                            <>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">NVDA</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">$450.80</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">+5.4%</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">High</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900/70 text-green-200 border border-green-700">Buy</span>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">AMZN</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">$178.22</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">+4.0%</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">High</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900/70 text-green-200 border border-green-700">Buy</span>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">TSLA</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">$245.34</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">+4.8%</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">Very High</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900/70 text-green-200 border border-green-700">Buy</span>
                                </td>
                              </tr>
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Watchlist */}
                <div className="bg-black backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-blue-800/30">
                  <div className="px-4 py-5 sm:p-6">
                    <h2 className="text-xl font-semibold text-white">Your Watchlist</h2>
                    <div className="mt-4 overflow-x-auto">
                      <table className="min-w-full divide-y divide-blue-800/30">
                        <thead>
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">Symbol</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-blue-300 uppercase tracking-wider">Price</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-blue-300 uppercase tracking-wider">Change</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-800/30">
                          {stockData.map((stock) => (
                            <tr key={stock.id} className="hover:bg-blue-900/10">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{stock.symbol}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">{stock.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-right">${stock.price.toFixed(2)}</td>
                              <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column */}
              <div className="space-y-6">
                {/* Market Health */}
                <div className="bg-black backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-blue-800/30">
                  <div className="px-4 py-5 sm:p-6">
                    <h2 className="text-xl font-semibold text-white">Market Health</h2>
                    <div className="mt-4">
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-200 bg-blue-900/30">
                              Sentiment
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-blue-200">
                              {marketHealth}%
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-900/20">
                          <div style={{ width: `${marketHealth}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-cyan-400"></div>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-blue-200">
                        <span>Advances: {advancesDeclines.advances}</span>
                        <span>Declines: {advancesDeclines.declines}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Financial News */}
                <FinancialNews maxItems={3} />
              </div>
            </div>
          </div>
        </div>
        </section>
        {/* Predictions Section */}
        <section ref={predictionsRef} className="min-h-screen py-10 border-t border-blue-800/30" id="predictions">
          <div className="py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-white mb-8">Stock Market & AI Predictions</h1>
              
              {/* Two-column layout for stock market and AI predictions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Left column - Stock Market Section */}
                <div className="bg-black backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-blue-800/30">
                  <div className="px-4 py-5 sm:p-6">
                    <h2 className="text-xl font-semibold text-white">Stock Market Dashboard</h2>
                    <p className="mt-1 text-sm text-blue-200">
                      Real-time market data and stock performance tracking.
                    </p>
                    
                    {/* Stock Symbol Input */}
                    <div className="mt-4 flex items-center">
                      <div className="relative rounded-md shadow-sm flex-1">
                        <input
                          type="text"
                          value={stockSymbol}
                          onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
                          className="bg-blue-900/20 border border-blue-800/50 text-white placeholder-blue-400 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm rounded-md py-2 px-3"
                          placeholder="Enter stock symbol"
                        />
                      </div>
                    </div>
                    
                    {/* Real-time Stock Chart */}
                    <div className="mt-4">
                      <AIPredictionWithRealTime symbol={stockSymbol} />
                    </div>
                  </div>
                </div>
                
                {/* Right column - AI Predictions Section */}
                <div className="bg-black backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-blue-800/30">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-white">Generate Price Prediction</h2>
                      <p className="mt-1 text-sm text-blue-200">
                        Our AI model predicts stock price movements in the next 1-5 minutes with high accuracy.
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center">
                      <div className="relative rounded-md shadow-sm">
                        <input
                          type="text"
                          value={stockSymbol}
                          onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
                          className="bg-blue-900/20 border border-blue-800/50 text-white placeholder-blue-400 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm rounded-md py-2 px-3"
                          placeholder="Enter stock symbol"
                        />
                      </div>
                      <button
                        onClick={generatePrediction}
                        disabled={isLoading}
                        className={`ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {isLoading ? 'Processing...' : 'Predict'}
                      </button>
                    </div>
                  </div>
                  
                  {isLoading && (
                    <div className="mt-8 flex justify-center">
                      <div className="animate-pulse flex space-x-4">
                        <div className="flex-1 space-y-4 py-1">
                          <div className="h-4 bg-blue-900/40 rounded w-3/4"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-blue-900/40 rounded"></div>
                            <div className="h-4 bg-blue-900/40 rounded w-5/6"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {!isLoading && predictionResult && (
                    <div className="mt-8">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-blue-900/10 rounded-lg p-4 border border-blue-800/30">
                          <div className="text-sm text-blue-300">Current Price</div>
                          <div className="text-2xl font-bold text-white">${predictionResult.currentPrice.toFixed(2)}</div>
                        </div>
                        <div className="bg-blue-900/10 rounded-lg p-4 border border-blue-800/30">
                          <div className="text-sm text-blue-300">1 Minute Projection</div>
                          <div className="text-2xl font-bold text-white">${predictionResult.oneMinuteProjection.price.toFixed(2)}</div>
                          <div className={`text-sm ${predictionResult.oneMinuteProjection.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {predictionResult.oneMinuteProjection.change >= 0 ? '+' : ''}{predictionResult.oneMinuteProjection.change.toFixed(2)} ({predictionResult.oneMinuteProjection.changePercent >= 0 ? '+' : ''}{predictionResult.oneMinuteProjection.changePercent.toFixed(2)}%)
                          </div>
                        </div>
                        <div className="bg-blue-900/10 rounded-lg p-4 border border-blue-800/30">
                          <div className="text-sm text-blue-300">5 Minute Projection</div>
                          <div className="text-2xl font-bold text-white">${predictionResult.fiveMinuteProjection.price.toFixed(2)}</div>
                          <div className={`text-sm ${predictionResult.fiveMinuteProjection.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {predictionResult.fiveMinuteProjection.change >= 0 ? '+' : ''}{predictionResult.fiveMinuteProjection.change.toFixed(2)} ({predictionResult.fiveMinuteProjection.changePercent >= 0 ? '+' : ''}{predictionResult.fiveMinuteProjection.changePercent.toFixed(2)}%)
                          </div>
                        </div>
                      </div>
                      
                      <div className="h-64 bg-blue-900/10 rounded-lg border border-blue-800/20 p-4">
                        {createPredictionChartData() && (
                          <Line 
                            data={createPredictionChartData()} 
                            options={predictionChartOptions} 
                          />
                        )}
                      </div>
                      
                      <div className="mt-4 text-sm text-blue-300">
                        <p>Prediction generated at {new Date().toLocaleTimeString()} for {stockSymbol}. Past performance is not indicative of future results.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              </div>
              
              {/* How AI Predictions Work - Full width section */}
              <div className="bg-black backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-blue-800/30 mt-6">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-xl font-semibold text-white">How Our AI Predictions Work</h2>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-white">Data Sources</h3>
                      <ul className="mt-2 text-blue-200 space-y-2">
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-cyan-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Historical price data with 1-minute resolution
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-cyan-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Real-time market indicators and technical signals
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-cyan-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Market sentiment analysis from news and social media
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-cyan-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Order book data and trading volume analysis
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">AI Model</h3>
                      <ul className="mt-2 text-blue-200 space-y-2">
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-cyan-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Deep learning neural networks trained on millions of market data points
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-cyan-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Recurrent neural networks (RNN) for time-series forecasting
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-cyan-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Reinforcement learning algorithms that adapt to changing market conditions
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-cyan-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Continuous model retraining with the latest market data
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Analysis Section */}
        <section ref={analysisRef} className="min-h-screen py-10 border-t border-blue-800/30" id="analysis">
          <div className="py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-white mb-8"> Stock Analysis </h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Stock Search */}
                  <div className="bg-black backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-blue-800/30">
                    <div className="px-4 py-5 sm:p-6">
                      <h2 className="text-xl font-semibold text-white">Analyze Stock</h2>
                      <p className="mt-1 text-sm text-blue-200">
                        Enter a stock symbol to view detailed analysis and AI insights.
                      </p>
                      <div className="mt-4 flex">
                        <div className="relative rounded-md shadow-sm flex-1">
                          <input
                            type="text"
                            value={stockSymbol}
                            onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
                            className="bg-blue-900/20 border border-blue-800/50 text-white placeholder-blue-400 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm rounded-md py-2 px-3"
                            placeholder="Enter stock symbol (e.g. AAPL)"
                          />
                        </div>
                        <button
                          className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Analyze
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Technical Analysis */}
                  <div className="bg-black backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-blue-800/30">
                    <div className="px-4 py-5 sm:p-6">
                      <h2 className="text-xl font-semibold text-white">Technical Analysis</h2>
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-900/10 rounded-lg p-4 border border-blue-800/30">
                          <h3 className="text-lg font-medium text-white">Moving Averages</h3>
                          <div className="mt-2 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-blue-200">MA (20)</span>
                              <span className="text-sm font-medium text-white">$178.45</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-blue-200">MA (50)</span>
                              <span className="text-sm font-medium text-white">$175.32</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-blue-200">MA (200)</span>
                              <span className="text-sm font-medium text-white">$169.87</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-blue-200">EMA (14)</span>
                              <span className="text-sm font-medium text-white">$180.12</span>
                            </div>
                          </div>
                          <div className="mt-3 text-xs text-green-400 font-medium">
                            Bullish: Price above all major moving averages
                          </div>
                        </div>
                        <div className="bg-blue-900/10 rounded-lg p-4 border border-blue-800/30">
                          <h3 className="text-lg font-medium text-white">Oscillators</h3>
                          <div className="mt-2 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-blue-200">RSI (14)</span>
                              <span className="text-sm font-medium text-white">58.32</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-blue-200">MACD</span>
                              <span className="text-sm font-medium text-white">1.24</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-blue-200">Stochastic</span>
                              <span className="text-sm font-medium text-white">72.45</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-blue-200">CCI</span>
                              <span className="text-sm font-medium text-white">98.76</span>
                            </div>
                          </div>
                          <div className="mt-3 text-xs text-yellow-400 font-medium">
                            Neutral: Mixed signals from oscillators
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-900/10 rounded-lg p-4 border border-blue-800/30">
                          <h3 className="text-lg font-medium text-white">Support & Resistance</h3>
                          <div className="mt-2 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-blue-200">Strong Resistance</span>
                              <span className="text-sm font-medium text-white">$185.00</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-blue-200">Resistance</span>
                              <span className="text-sm font-medium text-white">$183.25</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-blue-200">Support</span>
                              <span className="text-sm font-medium text-white">$180.50</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-blue-200">Strong Support</span>
                              <span className="text-sm font-medium text-white">$178.75</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-blue-900/10 rounded-lg p-4 border border-blue-800/30">
                          <h3 className="text-lg font-medium text-white">Pivot Points</h3>
                          <div className="mt-2 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-blue-200">R3</span>
                              <span className="text-sm font-medium text-white">$187.42</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-blue-200">R2</span>
                              <span className="text-sm font-medium text-white">$185.18</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-blue-200">R1</span>
                              <span className="text-sm font-medium text-white">$183.76</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-blue-200">Pivot</span>
                              <span className="text-sm font-medium text-white">$181.52</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Column */}
                <div className="space-y-6">
                  {/* AI Insights */}
                  <div className="bg-black backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-blue-800/30">
                    <div className="px-4 py-5 sm:p-6">
                      <h2 className="text-xl font-semibold text-white">AI Insights</h2>
                      <div className="mt-4 space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-blue-300">Historical Performance</h3>
                          <p className="mt-1 text-sm text-white">{aiInsights.historicalPerformance}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-blue-300">Moving Averages</h3>
                          <p className="mt-1 text-sm text-white">{aiInsights.movingAverages}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-blue-300">AI Outlook</h3>
                          <p className="mt-1 text-sm text-white">{aiInsights.aiOutlook}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-blue-300">Market Sentiment</h3>
                          <p className="mt-1 text-sm text-white">{aiInsights.sentiment}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Analyst Recommendations */}
                  <div className="bg-black backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-blue-800/30">
                    <div className="px-4 py-5 sm:p-6">
                      <h2 className="text-xl font-semibold text-white">Analyst Recommendations</h2>
                      <div className="mt-4">
                        <div className="flex items-center">
                          <div className="w-1/3 text-center">
                            <div className="text-2xl font-bold text-white">75%</div>
                            <div className="text-xs text-blue-200">Buy</div>
                          </div>
                          <div className="w-1/3 text-center">
                            <div className="text-2xl font-bold text-white">20%</div>
                            <div className="text-xs text-blue-200">Hold</div>
                          </div>
                          <div className="w-1/3 text-center">
                            <div className="text-2xl font-bold text-white">5%</div>
                            <div className="text-xs text-blue-200">Sell</div>
                          </div>
                        </div>
                        <div className="mt-4 h-2 bg-blue-900/20 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-blue-200">
                        <p>Based on 32 analyst ratings in the last 30 days</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional content can be added here if needed */}
                </div>
              </div>
                  {/* Additional content can be added here if needed */}
              {/* Financial Data */}
              <div className="mt-6 bg-black backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-blue-800/30">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-xl font-semibold text-white">Financial Data</h2>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-900/10 rounded-lg p-4 border border-blue-800/30">
                      <div className="text-sm text-blue-300">Market Cap</div>
                      <div className="text-lg font-bold text-white">$2.87T</div>
                    </div>
                    <div className="bg-blue-900/10 rounded-lg p-4 border border-blue-800/30">
                      <div className="text-sm text-blue-300">P/E Ratio</div>
                      <div className="text-lg font-bold text-white">30.42</div>
                    </div>
                    <div className="bg-blue-900/10 rounded-lg p-4 border border-blue-800/30">
                      <div className="text-sm text-blue-300">EPS (TTM)</div>
                      <div className="text-lg font-bold text-white">$6.14</div>
                    </div>
                    <div className="bg-blue-900/10 rounded-lg p-4 border border-blue-800/30">
                      <div className="text-sm text-blue-300">Dividend Yield</div>
                      <div className="text-lg font-bold text-white">0.51%</div>
                    </div>
                    <div className="bg-blue-900/10 rounded-lg p-4 border border-blue-800/30">
                      <div className="text-sm text-blue-300">52-Week High</div>
                      <div className="text-lg font-bold text-white">$198.23</div>
                    </div>
                    <div className="bg-blue-900/10 rounded-lg p-4 border border-blue-800/30">
                      <div className="text-sm text-blue-300">52-Week Low</div>
                      <div className="text-lg font-bold text-white">$124.17</div>
                    </div>
                    <div className="bg-blue-900/10 rounded-lg p-4 border border-blue-800/30">
                      <div className="text-sm text-blue-300">Avg. Volume</div>
                      <div className="text-lg font-bold text-white">58.72M</div>
                    </div>
                    <div className="bg-blue-900/10 rounded-lg p-4 border border-blue-800/30">
                      <div className="text-sm text-blue-300">Beta</div>
                      <div className="text-lg font-bold text-white">1.28</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>


      <footer className="bg-black border-t border-blue-800/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:order-2 space-x-6">
              <a href="#" className="text-blue-400 hover:text-blue-300">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-300">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-300">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <p className="text-center text-base text-blue-300">
                &copy; 2023 Smart Stocks. All rights reserved.
              </p>
            </div>
          </div>
          <div className="mt-8 border-t border-blue-800/30 pt-8 md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <a href="#" className="text-sm text-blue-300 hover:text-blue-200">Privacy Policy</a>
              <a href="#" className="text-sm text-blue-300 hover:text-blue-200">Terms of Service</a>
              <a href="#" className="text-sm text-blue-300 hover:text-blue-200">Contact Us</a>
            </div>
            <p className="mt-8 text-base text-blue-300 md:mt-0 md:order-1">
              Disclaimer: This platform is for educational purposes only. Trading involves risk.
            </p>
          </div>
        </div>
      </footer>
    </div>
)}