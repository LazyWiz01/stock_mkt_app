'use client';

import { useState, useEffect } from 'react';

interface NewsItem {
  id: number;
  title: string;
  source: string;
  date: string;
  url?: string;
  category?: string;
}

interface FinancialNewsProps {
  initialNewsItems?: NewsItem[];
  maxItems?: number;
}

const FinancialNews: React.FC<FinancialNewsProps> = ({ 
  initialNewsItems = [], 
  maxItems = 8 
}) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>(initialNewsItems);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'markets', name: 'Markets' },
    { id: 'stocks', name: 'Stocks' },
    { id: 'economy', name: 'Economy' },
  ];

  // Mock function to fetch news data
  // In a real implementation, this would call an API
  const fetchNewsData = async (category: string = 'all', page: number = 1) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock news data
    const mockNews: NewsItem[] = [
      { id: 1, title: 'Fed signals potential rate cuts in upcoming meeting', source: 'Financial Times', date: '2h ago', category: 'economy', url: '#' },
      { id: 2, title: 'Tech stocks rally as inflation concerns ease', source: 'Wall Street Journal', date: '4h ago', category: 'stocks', url: '#' },
      { id: 3, title: 'Retail sales exceed expectations in Q3', source: 'Bloomberg', date: '6h ago', category: 'economy', url: '#' },
      { id: 4, title: 'NVIDIA shares surge on AI chip demand', source: 'CNBC', date: '8h ago', category: 'stocks', url: '#' },
      { id: 5, title: 'Global markets respond to central bank policies', source: 'Reuters', date: '10h ago', category: 'markets', url: '#' },
      { id: 6, title: 'Oil prices stabilize after OPEC meeting', source: 'Bloomberg', date: '12h ago', category: 'markets', url: '#' },
      { id: 7, title: 'Amazon announces new logistics investments', source: 'Business Insider', date: '1d ago', category: 'stocks', url: '#' },
      { id: 8, title: 'Housing market shows signs of cooling', source: 'Financial Times', date: '1d ago', category: 'economy', url: '#' },
      { id: 9, title: 'European markets close higher on positive economic data', source: 'Reuters', date: '1d ago', category: 'markets', url: '#' },
      { id: 10, title: 'Tesla production numbers beat analyst expectations', source: 'CNBC', date: '1d ago', category: 'stocks', url: '#' },
      { id: 11, title: 'Gold prices reach six-month high amid uncertainty', source: 'Bloomberg', date: '2d ago', category: 'markets', url: '#' },
      { id: 12, title: 'Consumer confidence index rises for third straight month', source: 'Financial Times', date: '2d ago', category: 'economy', url: '#' },
    ];
    
    // Filter by category if needed
    const filteredNews = category === 'all' 
      ? mockNews 
      : mockNews.filter(item => item.category === category);
    
    // Paginate results
    const startIndex = (page - 1) * maxItems;
    const paginatedNews = filteredNews.slice(startIndex, startIndex + maxItems);
    
    setNewsItems(paginatedNews);
    setIsLoading(false);
  };

  // Fetch news when category or page changes
  useEffect(() => {
    fetchNewsData(activeCategory, currentPage);
  }, [activeCategory, currentPage, maxItems]);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1); // Reset to first page when changing category
  };

  // Handle pagination
  const handleNextPage = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  return (
    <div className="bg-black border border-blue-800/50 rounded-lg shadow-lg overflow-hidden">
      <div className="p-1 border-b border-blue-800/50 bg-gradient-to-r from-blue-900/30 to-black flex justify-between items-center">
        <h2 className="text-sm font-bold text-white ml-2">Financial News</h2>
        <div className="flex space-x-1">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-1.5 py-0.5 text-xs rounded-md transition-colors ${activeCategory === category.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-blue-900/30 text-blue-200 hover:bg-blue-800/40'}`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="divide-y divide-blue-800/30 max-h-[320px] overflow-y-auto">
        {isLoading ? (
          <div className="p-2 text-center">
            <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-blue-500 border-r-transparent">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : newsItems.length > 0 ? (
          newsItems.map(item => (
            <div key={item.id} className="py-1 px-2 hover:bg-blue-900/10 transition-colors">
              <a href={item.url || '#'} className="block">
                <h3 className="text-xs text-blue-300 font-medium hover:text-blue-200 transition-colors">
                  {item.title}
                </h3>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-gray-400">{item.source}</span>
                  <span className="text-gray-500">{item.date}</span>
                </div>
              </a>
            </div>
          ))
        ) : (
          <div className="p-2 text-center text-gray-500 text-xs">
            No news available for this category.
          </div>
        )}
      </div>
      
      {newsItems.length > 0 && (
        <div className="p-1 border-t border-blue-800/30 bg-blue-900/10 flex justify-between items-center">
          <button 
            onClick={handlePrevPage}
            disabled={currentPage === 1 || isLoading}
            className={`px-1.5 py-0.5 text-[10px] rounded-md ${currentPage === 1 || isLoading 
              ? 'bg-blue-900/20 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-900/30 text-blue-200 hover:bg-blue-800/40'}`}
          >
            Prev
          </button>
          <span className="text-[10px] text-gray-400">Page {currentPage}</span>
          <button 
            onClick={handleNextPage}
            disabled={newsItems.length < maxItems || isLoading}
            className={`px-1.5 py-0.5 text-[10px] rounded-md ${newsItems.length < maxItems || isLoading 
              ? 'bg-blue-900/20 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-900/30 text-blue-200 hover:bg-blue-800/40'}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default FinancialNews;