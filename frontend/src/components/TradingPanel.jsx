import React, { useState, useEffect } from 'react';
import { tradingAPI, stockAPI } from '../services/api';

const TradingPanel = ({ onTradeSuccess, selectedAsset }) => {
  const [formData, setFormData] = useState({
    symbol: '',
    quantity: '',
  });
  const [cryptoPrice, setCryptoPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [tradeType, setTradeType] = useState('BUY'); // BUY or SELL

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle asset selection from parent
  useEffect(() => {
    if (selectedAsset) {
      setFormData(prev => ({ ...prev, symbol: selectedAsset.symbol }));
      setTradeType(selectedAsset.type);
      fetchPrice(selectedAsset.symbol);
    }
  }, [selectedAsset]);

  // Polling for live updates
  useEffect(() => {
    let interval;
    if (cryptoPrice && !loading) {
      interval = setInterval(() => {
        fetchPrice(cryptoPrice.symbol, true);
      }, 5000); // 5s poll
    }
    return () => clearInterval(interval);
  }, [cryptoPrice, loading]);

  const fetchPrice = async (symbol, isSilent = false) => {
    if (!isSilent) setSearchLoading(true);
    try {
      const response = await stockAPI.getStockPrice(symbol.toUpperCase());
      setCryptoPrice(response.data);
      setError('');
    } catch (err) {
      if (!isSilent) {
        setError('Asset not found');
        setCryptoPrice(null);
      }
    } finally {
      if (!isSilent) setSearchLoading(false);
    }
  };

  const handleSearch = () => fetchPrice(formData.symbol);

  const handleTrade = async () => {
    if (!cryptoPrice || !formData.quantity) {
      setError('Search for an asset and enter amount');
      return;
    }

    setLoading(true);
    try {
      if (tradeType === 'BUY') {
        await tradingAPI.buyStock({
          symbol: formData.symbol.toUpperCase(),
          quantity: parseInt(formData.quantity),
        });
      } else {
        await tradingAPI.sellStock({
          symbol: formData.symbol.toUpperCase(),
          quantity: parseInt(formData.quantity),
        });
      }

      setError('');
      setFormData({ symbol: '', quantity: '' });
      setCryptoPrice(null);
      onTradeSuccess();
      // Optional: use a more subtle notification
    } catch (err) {
      setError(err.response?.data || 'Execution failed');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const calculateTotal = () => {
    if (!cryptoPrice || !formData.quantity) return 0;
    return cryptoPrice.price * parseInt(formData.quantity);
  };

  return (
    <div className="binance-card overflow-hidden">
      <div className="flex border-b border-[#2b3139]">
        <button
          onClick={() => setTradeType('BUY')}
          className={`flex-1 py-3 text-sm font-bold transition-colors ${tradeType === 'BUY'
            ? 'text-[#2ebd85] border-b-2 border-[#2ebd85] bg-[#1e2329]'
            : 'text-[#848e9c] hover:text-[#eaecef]'
            }`}
        >
          Buy
        </button>
        <button
          onClick={() => setTradeType('SELL')}
          className={`flex-1 py-3 text-sm font-bold transition-colors ${tradeType === 'SELL'
            ? 'text-[#f6465d] border-b-2 border-[#f6465d] bg-[#1e2329]'
            : 'text-[#848e9c] hover:text-[#eaecef]'
            }`}
        >
          Sell
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Symbol Search */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-[#848e9c]">Asset</span>
            <span className="text-xs text-[#848e9c]">BTC, ETH, BNB...</span>
          </div>
          <div className="relative">
            <input
              type="text"
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search coin"
              className="w-full bg-[#2b3139] border border-transparent focus:border-[#f0b90b] rounded px-3 py-2 text-sm outline-none transition-all placeholder-[#474d57]"
            />
            <button
              onClick={handleSearch}
              disabled={searchLoading}
              className="absolute right-2 top-1.5 text-xs text-[#f0b90b] hover:text-[#fcd535] font-bold"
            >
              {searchLoading ? '...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Price Display */}
        {cryptoPrice && (
          <div className="bg-[#2b3139] rounded p-3 fade-in">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-bold text-[#eaecef]">{cryptoPrice.symbol}/USDT</span>
              <span className="text-xs text-[#848e9c]">{cryptoPrice.name}</span>
            </div>
            <div className="text-xl font-bold text-[#2ebd85] font-mono">
              {formatCurrency(cryptoPrice.price).replace('$', '')}
              <span className="text-xs ml-1 text-[#848e9c]">USDT</span>
            </div>
          </div>
        )}

        {/* Amount Input */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-[#848e9c]">Amount</span>
            <span className="text-xs text-[#848e9c]">Limit Order</span>
          </div>
          <div className="relative">
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="0.00"
              min="1"
              className="w-full bg-[#2b3139] border border-transparent focus:border-[#f0b90b] rounded px-3 py-2 text-sm outline-none transition-all placeholder-[#474d57]"
            />
            <span className="absolute right-3 top-2 text-xs text-[#848e9c] font-bold">
              {cryptoPrice ? cryptoPrice.symbol : ''}
            </span>
          </div>
        </div>

        {/* Total Calculation */}
        <div className="pt-2">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-[#848e9c]">Estimated Total</span>
            <span className="text-[#eaecef] font-mono">
              {formatCurrency(calculateTotal())}
            </span>
          </div>

          {error && (
            <div className="text-[11px] text-[#f6465d] bg-[#2b3139] p-2 rounded mb-3">
              {error}
            </div>
          )}

          <button
            onClick={handleTrade}
            disabled={loading || !cryptoPrice || !formData.quantity}
            className={`w-full py-3 rounded font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${tradeType === 'BUY'
              ? 'bg-[#2ebd85] hover:bg-[#34d399] text-white'
              : 'bg-[#f6465d] hover:bg-[#ff5a71] text-white'
              }`}
          >
            {loading ? 'Processing...' : `${tradeType === 'BUY' ? 'Buy' : 'Sell'} ${cryptoPrice?.symbol || ''}`}
          </button>
        </div>
      </div>

      {/* Wallet Balance Info (Mock) */}
      <div className="p-4 bg-[#181a20] border-t border-[#2b3139]">
        <div className="flex justify-between items-center text-xs">
          <span className="text-[#848e9c]">Available Balance</span>
          <span className="text-[#f0b90b] font-bold">10,000.00 USDT</span>
        </div>
      </div>
    </div>
  );
};

export default TradingPanel;
