import React, { useState, useEffect } from 'react';

const RecentTrades = ({ symbol = 'BTC' }) => {
    const [trades, setTrades] = useState([]);

    useEffect(() => {
        // Initial mock trades
        const initialTrades = Array.from({ length: 15 }).map((_, i) => ({
            id: Math.random().toString(36).substr(2, 9),
            price: 65432.10 + (Math.random() - 0.5) * 100,
            amount: Math.random() * 0.5,
            time: new Date(Date.now() - i * 2000).toLocaleTimeString([], { hour12: false }),
            isBuyerMaker: Math.random() > 0.5
        }));
        setTrades(initialTrades);

        // Simulate new trades coming in
        const interval = setInterval(() => {
            const newTrade = {
                id: Math.random().toString(36).substr(2, 9),
                price: 65432.10 + (Math.random() - 0.5) * 100,
                amount: Math.random() * 0.2,
                time: new Date().toLocaleTimeString([], { hour12: false }),
                isBuyerMaker: Math.random() > 0.5
            };

            setTrades(prev => [newTrade, ...prev.slice(0, 14)]);
        }, 3000);

        return () => clearInterval(interval);
    }, [symbol]);

    return (
        <div className="binance-card overflow-hidden">
            <div className="px-4 py-3 border-b border-[#2b3139]">
                <h3 className="text-sm font-bold text-[#eaecef]">Market Trades</h3>
            </div>

            <div className="p-2">
                <div className="grid grid-cols-3 text-[10px] text-[#848e9c] mb-2 px-2">
                    <span>Price(USDT)</span>
                    <span className="text-right">Amount({symbol})</span>
                    <span className="text-right">Time</span>
                </div>

                <div className="space-y-[1px]">
                    {trades.map((trade) => (
                        <div key={trade.id} className="grid grid-cols-3 text-[11px] px-2 py-[2px] hover:bg-[#2b3139] transition-colors rounded">
                            <span className={`font-mono ${trade.isBuyerMaker ? 'text-[#f6465d]' : 'text-[#2ebd85]'}`}>
                                {trade.price.toFixed(2)}
                            </span>
                            <span className="text-right text-[#eaecef] font-mono">
                                {trade.amount.toFixed(4)}
                            </span>
                            <span className="text-right text-[#848e9c] font-mono">
                                {trade.time}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecentTrades;
