import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { stockAPI } from '../services/api';
import MarketChart from './MarketChart';

const MarketList = () => {
    const [markets, setMarkets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPreview, setSelectedPreview] = useState(null);
    const navigate = useNavigate();

    const handleTradeClick = (symbol) => {
        // Navigate to dashboard and pass the symbol via state
        navigate('/dashboard', { state: { symbol, type: 'BUY' } });
    };

    const topCoins = ['BTC', 'ETH', 'BNB', 'SOL', 'ADA', 'XRP', 'DOT', 'DOGE', 'MATIC', 'LINK'];

    useEffect(() => {
        const fetchMarkets = async () => {
            try {
                const coinData = await Promise.all(
                    topCoins.map(async (coin) => {
                        try {
                            const response = await stockAPI.getStockPrice(coin);
                            return response.data;
                        } catch (err) {
                            console.error(`Error fetching ${coin}:`, err);
                            return null;
                        }
                    })
                );
                setMarkets(coinData.filter(coin => coin !== null));
            } catch (error) {
                console.error('Error fetching market data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMarkets();
        const interval = setInterval(fetchMarkets, 50000); // Update every 5 seconds for real-time consistency
        return () => clearInterval(interval);
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-[#f0b90b] text-xl animate-pulse font-bold tracking-widest">
                    FETCHING REAL-TIME MARKET DATA...
                </div>
            </div>
        );
    }

    return (
        <div className="binance-card overflow-hidden">
            <div className="px-6 py-4 border-b border-[#2b3139] flex justify-between items-center bg-[#1e2329]">
                <div>
                    <h2 className="text-xl font-bold text-[#eaecef]">Crypto Markets</h2>
                    <p className="text-xs text-[#848e9c] mt-1">Real-time prices from Binance Exchange.</p>
                </div>
                <div className="text-right">
                    <div className="inline-flex items-center px-2 py-1 rounded bg-[#2ebd85]/10 text-[#2ebd85] text-[10px] font-bold">
                        <span className="w-2 h-2 bg-[#2ebd85] rounded-full animate-pulse mr-2"></span>
                        LIVE
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="text-[#848e9c] text-xs uppercase tracking-wider border-b border-[#2b3139] bg-[#181a20]">
                            <th className="px-6 py-4 text-left font-medium">Asset</th>
                            <th className="px-6 py-4 text-left font-medium">Name</th>
                            <th className="px-6 py-4 text-right font-medium">Price (USDT)</th>
                            <th className="px-6 py-4 text-right font-medium">Network</th>
                            <th className="px-6 py-4 text-right font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2b3139]">
                        {markets.map((coin) => (
                            <tr key={coin.symbol} className="hover:bg-[#1e2329] transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <span className="text-sm font-bold text-[#eaecef] group-hover:text-[#f0b90b] transition-colors">{coin.symbol}</span>
                                        <span className="ml-1 text-[10px] text-[#848e9c]">/USDT</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#848e9c]">
                                    {coin.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-[#2ebd85] font-mono group-hover:scale-105 transition-transform origin-right">
                                    {formatCurrency(coin.price).replace('$', '')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-xs text-[#848e9c]">
                                    Mainnet
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <button
                                        onClick={() => handleTradeClick(coin.symbol)}
                                        className="text-xs font-bold text-[#f0b90b] hover:text-[#fcd535] transition-colors bg-[#f0b90b]/10 px-3 py-1 rounded"
                                    >
                                        Trade
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MarketList;
