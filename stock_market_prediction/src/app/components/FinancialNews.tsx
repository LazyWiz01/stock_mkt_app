'use client';

import { useState, useEffect } from 'react';

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  source: string;
  date: string;
  url?: string;
  category: 'market' | 'stocks' | 'economy' | 'crypto' | 'general';
  sentiment: 'positive' | 'negative' | 'neutral';
  relatedSymbols?: string[];
}

interface FinancialNewsProps {
  maxItems?: number;
  defaultCategory?: string;
}

const FinancialNews: React.FC<FinancialNewsProps> = ({ maxItems = 5, defaultCategory = 'all' }) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Mock news data
  const mockNewsData: NewsItem[] = [
    {
      id: 1,
      title: 'Fed signals potential rate cuts in upcoming meeting',
      summary: 'Federal Reserve officials have indicated they may consider cutting interest rates in their next policy meeting as inflation shows signs of cooling.',
      source: 'Financial Times',
      date: '2 hours ago',
      category: 'economy',
      sentiment: 'positive',
      relatedSymbols: ['SPY', 'QQQ', 'DIA']
    },
    {
      id: 2,
      title: 'Tech stocks rally as inflation concerns ease',
      summary: 'Major technology stocks saw significant gains as recent economic data suggests inflation pressures may be subsiding, potentially leading to a more favorable interest rate environment.',
      source: 'Wall Street Journal',
      date: '4 hours ago',
      category: 'stocks',
      sentiment: 'positive',
      relatedSymbols: ['AAPL', 'MSFT', 'GOOGL', 'AMZN']
    },
    {
      id: 3,
      title: 'Retail sales exceed expectations in Q3',
      summary: 'Consumer spending showed resilience in the third quarter, with retail sales figures surpassing analyst expectations despite ongoing economic uncertainties.',
      source: 'Bloomberg',
      date: '6 hours ago',
      category: 'economy',
      sentiment: 'positive',
      relatedSymbols: ['WMT', 'TGT', 'AMZN']
    },
    {
      id: 4,
      title: 'Oil prices drop amid global demand concerns',
      summary: 'Crude oil prices fell sharply as investors worry about weakening demand in major economies and potential oversupply issues.',
      source: 'Reuters',
      date: '8 hours ago',
      category: 'market',
      sentiment: 'negative',
      relatedSymbols: ['XOM', 'CVX', 'USO']
    },
    {
      id: 5,
      title: 'Bitcoin surpasses $60,000 mark after ETF approval',
      summary: 'The world\'s largest cryptocurrency reached new heights following regulatory approval for several Bitcoin exchange-traded funds, signaling growing mainstream acceptance.',
      source: 'CoinDesk',
      date: '12 hours ago',
      category: 'crypto',
      sentiment: 'positive',
      relatedSymbols: ['COIN', 'MSTR']
    },
    {
      id: 6,
      title: 'Manufacturing activity contracts for third consecutive month',
      summary: 'The manufacturing sector continues to show signs of weakness as the latest PMI data indicates contraction, raising concerns about industrial output.',
      source: 'CNBC',
      date: '1 day ago',
      category: 'economy',
      sentiment: 'negative',
      relatedSymbols: ['CAT', 'DE', 'MMM']
    },
    {
      id: 7,
      title: 'Apple unveils new AI features for upcoming devices',
      summary: 'The tech giant announced significant artificial intelligence capabilities that will be integrated into its next generation of products, potentially reshaping user experience.',
      source: 'TechCrunch',
      date: '1 day ago',
      category: 'stocks',
      sentiment: 'positive',
      relatedSymbols: ['AAPL']
    }
  ];

  // Simulate fetching news data
  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        setNewsItems(mockNewsData);
        setIsLoading(false);
      }, 1000);
    };

    fetchNews();
  }, []);

  // Filter news based on selected category
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredNews(newsItems.slice(0, maxItems));
    } else {
      const filtered = newsItems.filter(item => item.category === selectedCategory);
      setFilteredNews(filtered.slice(0, maxItems));
    }
  }, [selectedCategory, newsItems, maxItems]);

  // Get sentiment badge color
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-900/70 text-green-200 border-green-700';
      case 'negative':
        return 'bg-red-900/70 text-red-200 border-red-700';
      default:
        return 'bg-blue-900/70 text-blue-200 border-blue-700';
    }
  };

  return (
    <div className="bg-black backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-blue-800/30">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Financial News</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2 py-1 text-xs rounded-md ${selectedCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-blue-900/30 text-blue-300 hover:bg-blue-800/40'}`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedCategory('market')}
              className={`px-2 py-1 text-xs rounded-md ${selectedCategory === 'market' ? 'bg-blue-600 text-white' : 'bg-blue-900/30 text-blue-300 hover:bg-blue-800/40'}`}
            >
              Market
            </button>
            <button
              onClick={() => setSelectedCategory('stocks')}
              className={`px-2 py-1 text-xs rounded-md ${selectedCategory === 'stocks' ? 'bg-blue-600 text-white' : 'bg-blue-900/30 text-blue-300 hover:bg-blue-800/40'}`}
            >
              Stocks
            </button>
            <button
              onClick={() => setSelectedCategory('economy')}
              className={`px-2 py-1 text-xs rounded-md ${selectedCategory === 'economy' ? 'bg-blue-600 text-white' : 'bg-blue-900/30 text-blue-300 hover:bg-blue-800/40'}`}
            >
              Economy
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-blue-900/40 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-blue-900/40 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNews.length > 0 ? (
              filteredNews.map((item) => (
                <div key={item.id} className="border-b border-blue-800/30 pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-medium text-white">{item.title}</h3>
                    <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${getSentimentColor(item.sentiment)}`}>
                      {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-blue-300 line-clamp-2">{item.summary}</p>
                  <div className="mt-2 flex justify-between items-center text-xs text-blue-400">
                    <span>{item.source}</span>
                    <span>{item.date}</span>
                  </div>
                  {item.relatedSymbols && item.relatedSymbols.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.relatedSymbols.map((symbol) => (
                        <span key={symbol} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-900/30 text-blue-300">
                          {symbol}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-blue-300">No news available for this category</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialNews;