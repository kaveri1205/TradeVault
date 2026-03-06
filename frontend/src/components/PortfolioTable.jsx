import React, { useState, useEffect } from 'react';
import { tradingAPI, stockAPI } from '../services/api';

const PortfolioTable = ({ portfolio, onTradeSuccess, onSelectAsset }) => {
  const [portfolioWithPrices, setPortfolioWithPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentPrices = async (isSilent = false) => {
      if (!portfolio || portfolio.length === 0) {
        setPortfolioWithPrices([]);
        setLoading(false);
        return;
      }

      if (!isSilent) setLoading(true);
      try {
        const portfolioWithCurrentPrices = await Promise.all(
          portfolio.map(async (item) => {
            try {
              const response = await stockAPI.getStockPrice(item.stockSymbol);
              const currentPrice = response.data.price;
              const totalValue = currentPrice * item.quantity;
              const totalCost = item.averageBuyPrice * item.quantity;
              const profitLoss = totalValue - totalCost;
              const profitLossPercentage = (totalCost > 0) ? (profitLoss / totalCost) * 100 : 0;

              return {
                ...item,
                currentPrice,
                totalValue,
                totalCost,
                profitLoss,
                profitLossPercentage,
              };
            } catch (error) {
              return {
                ...item,
                currentPrice: item.averageBuyPrice,
                totalValue: item.averageBuyPrice * item.quantity,
                totalCost: item.averageBuyPrice * item.quantity,
                profitLoss: 0,
                profitLossPercentage: 0,
              };
            }
          })
        );

        setPortfolioWithPrices(portfolioWithCurrentPrices);
      } catch (error) {
        console.error('Error fetching current prices:', error);
      } finally {
        if (!isSilent) setLoading(false);
      }
    };

    fetchCurrentPrices();

    // Poll every 5s for real-time PNL updates as requested
    const interval = setInterval(() => fetchCurrentPrices(true), 5000);
    return () => clearInterval(interval);
  }, [portfolio]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (percentage) => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="binance-card p-6">
        <h2 className="text-lg font-bold text-[#eaecef] mb-4">Assets</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex justify-between">
              <div className="h-4 bg-[#2b3139] rounded w-1/4"></div>
              <div className="h-4 bg-[#2b3139] rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (portfolioWithPrices.length === 0) {
    return (
      <div className="binance-card p-8 text-center">
        <h2 className="text-lg font-bold text-[#eaecef] mb-6 text-left">Assets</h2>
        <div className="py-10">
          <div className="text-4xl mb-4">🏦</div>
          <p className="text-[#848e9c] text-sm italic">No assets found in your portfolio.</p>
          <button className="mt-4 text-[#f0b90b] text-sm font-bold hover:underline">
            Deposit or start trading now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="binance-card overflow-hidden">
      <div className="px-6 py-4 border-b border-[#2b3139] flex justify-between items-center">
        <h2 className="text-lg font-bold text-[#eaecef]">Assets</h2>
        <div className="text-xs text-[#848e9c]">
          Real-time updates via Binance API
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-[#848e9c] text-xs uppercase tracking-wider border-b border-[#2b3139]">
              <th className="px-6 py-4 text-left font-medium">Asset</th>
              <th className="px-6 py-4 text-right font-medium">Quantity</th>
              <th className="px-6 py-4 text-right font-medium">Avg Price</th>
              <th className="px-6 py-4 text-right font-medium">Price</th>
              <th className="px-6 py-4 text-right font-medium">Value (USDT)</th>
              <th className="px-6 py-4 text-right font-medium">PNL</th>
              <th className="px-6 py-4 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2b3139]">
            {portfolioWithPrices.map((item) => (
              <tr key={item.id} className="hover:bg-[#2b3139] transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm font-bold text-[#eaecef] group-hover:text-[#f0b90b] transition-colors">
                      {item.stockSymbol}
                    </span>
                    <span className="ml-2 text-[10px] text-[#848e9c]">/USDT</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-[#eaecef] font-mono">
                  {item.quantity.toFixed(4)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-[#848e9c] font-mono">
                  {formatCurrency(item.averageBuyPrice).replace('$', '')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-[#eaecef] font-mono">
                  {formatCurrency(item.currentPrice).replace('$', '')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-[#eaecef] font-bold font-mono">
                  {formatCurrency(item.totalValue).replace('$', '')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className={`text-sm font-bold font-mono ${item.profitLoss >= 0 ? 'text-[#2ebd85]' : 'text-[#f6465d]'
                    }`}>
                    {formatCurrency(item.profitLoss).replace('$', '')}
                  </div>
                  <div className={`text-[10px] font-bold ${item.profitLossPercentage >= 0 ? 'text-[#2ebd85]' : 'text-[#f6465d]'
                    }`}>
                    {formatPercentage(item.profitLossPercentage)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => onSelectAsset(item.stockSymbol, 'BUY')}
                      className="text-[10px] font-bold text-[#2ebd85] hover:bg-[#2ebd85]/10 px-2 py-1 rounded transition-colors"
                    >
                      BUY
                    </button>
                    <button
                      onClick={() => onSelectAsset(item.stockSymbol, 'SELL')}
                      className="text-[10px] font-bold text-[#f6465d] hover:bg-[#f6465d]/10 px-2 py-1 rounded transition-colors"
                    >
                      SELL
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Portfolio Summary Footnote */}
      <div className="px-6 py-4 bg-[#181a20] border-t border-[#2b3139]">
        <div className="flex justify-between items-center">
          <span className="text-sm text-[#848e9c]">Total Portfolio Value</span>
          <div className="text-right">
            <span className="text-xl font-bold text-[#f0b90b] font-mono">
              {formatCurrency(
                portfolioWithPrices.reduce((sum, item) => sum + item.totalValue, 0)
              ).replace('$', '')}
            </span>
            <span className="ml-1 text-xs text-[#848e9c]">USDT</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioTable;
