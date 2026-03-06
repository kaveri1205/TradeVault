import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tradingAPI } from '../services/api';
import TradingPanel from './TradingPanel';
import LiveOrderBook from './LiveOrderBook';
import RecentTrades from './RecentTrades';
import PortfolioTable from './PortfolioTable';
import SummaryCards from './SummaryCards';
import MarketChart from './MarketChart';
import BottomTabs from './BottomTabs';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [summary, setSummary] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    fetchDashboardData();

    // Check if we navigated here with a specific asset
    if (location.state?.symbol) {
      handleSelectAsset(location.state.symbol, location.state.type || 'BUY');
      // Clear state to prevent re-selection on refresh
      window.history.replaceState({}, document.title);
    }

    // Set up polling for live summary updates (5s for real-time feel)
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, [location]);

  const fetchDashboardData = async () => {
    try {
      const [summaryResponse, portfolioResponse] = await Promise.all([
        tradingAPI.getSummary(),
        tradingAPI.getPortfolio(),
      ]);

      setSummary(summaryResponse.data);
      setPortfolio(portfolioResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTradeSuccess = () => {
    fetchDashboardData();
    setSelectedAsset(null);
  };

  const handleSelectAsset = (symbol, type = 'BUY') => {
    setSelectedAsset({ symbol, type });
    // Scroll to top or trading panel if on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-xl text-[#f0b90b] animate-pulse">Loading TradeVault...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SummaryCards summary={summary} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Trading Panel - Right on large, top on small */}
        <div className="xl:col-span-4 order-1 xl:order-2 space-y-6">
          <TradingPanel
            onTradeSuccess={handleTradeSuccess}
            selectedAsset={selectedAsset}
          />
          <LiveOrderBook symbol={selectedAsset?.symbol || 'BTC'} />
          <RecentTrades symbol={selectedAsset?.symbol || 'BTC'} />
        </div>

        {/* Portfolio Table - Left on large, bottom on small */}
        <div className="xl:col-span-8 order-2 xl:order-1 space-y-6">
          <MarketChart symbol={selectedAsset?.symbol || 'BTCUSDT'} />
          <PortfolioTable
            portfolio={portfolio}
            onTradeSuccess={handleTradeSuccess}
            onSelectAsset={handleSelectAsset}
          />
        </div>
      </div>

      <BottomTabs
        portfolio={portfolio}
        orders={[]}
      />
    </div>
  );
};

export default Dashboard;
