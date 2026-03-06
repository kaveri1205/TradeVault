import React, { useState, useEffect, useMemo } from 'react';

const LiveOrderBook = ({ symbol = 'BTC' }) => {
    const [orders, setOrders] = useState({ bids: [], asks: [] });
    const [currentPrice, setCurrentPrice] = useState(65432.10);

    // Generate initial mock data
    useEffect(() => {
        const generateOrders = (basePrice) => {
            const asks = [];
            const bids = [];

            for (let i = 0; i < 10; i++) {
                asks.push({
                    price: basePrice + (i + 1) * (basePrice * 0.0001),
                    amount: Math.random() * 2,
                    total: 0
                });
                bids.push({
                    price: basePrice - (i + 1) * (basePrice * 0.0001),
                    amount: Math.random() * 2,
                    total: 0
                });
            }

            // Calculate cumulative totals
            let askTotal = 0;
            asks.forEach(a => {
                askTotal += a.amount;
                a.total = askTotal;
            });

            let bidTotal = 0;
            bids.forEach(b => {
                bidTotal += b.amount;
                b.total = bidTotal;
            });

            return { asks: asks.reverse(), bids };
        };

        setOrders(generateOrders(currentPrice));

        // Jitter data every 1s for "live" effect
        const interval = setInterval(() => {
            setOrders(prev => {
                const update = (list, isAsk) => {
                    return list.map(o => ({
                        ...o,
                        amount: Math.max(0.01, o.amount + (Math.random() - 0.5) * 0.1)
                    }));
                };
                return {
                    asks: update(prev.asks, true),
                    bids: update(prev.bids, false)
                };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [symbol]);

    const maxTotal = useMemo(() => {
        const allTotal = [...orders.asks, ...orders.bids].map(o => o.total);
        return Math.max(...allTotal, 1);
    }, [orders]);

    return (
        <div className="binance-card overflow-hidden">
            <div className="px-4 py-3 border-b border-[#2b3139] flex justify-between items-center">
                <h3 className="text-sm font-bold text-[#eaecef]">Order Book</h3>
                <div className="flex gap-2">
                    <div className="w-3 h-3 bg-[#2ebd85] rounded-sm"></div>
                    <div className="w-3 h-3 bg-[#f6465d] rounded-sm"></div>
                </div>
            </div>

            <div className="p-2">
                <div className="grid grid-cols-3 text-[10px] text-[#848e9c] mb-2 px-2">
                    <span>Price(USDT)</span>
                    <span className="text-right">Amount({symbol})</span>
                    <span className="text-right">Total</span>
                </div>

                {/* Asks (Sells) */}
                <div className="space-y-[1px] mb-2">
                    {orders.asks.map((order, i) => (
                        <div key={`ask-${i}`} className="relative group cursor-pointer">
                            <div
                                className="absolute right-0 top-0 h-full bg-[#f6465d]/10 transition-all duration-500"
                                style={{ width: `${(order.total / maxTotal) * 100}%` }}
                            ></div>
                            <div className="grid grid-cols-3 text-[11px] px-2 py-[2px] relative z-10">
                                <span className="text-[#f6465d] font-mono">{order.price.toFixed(2)}</span>
                                <span className="text-right text-[#eaecef] font-mono">{order.amount.toFixed(4)}</span>
                                <span className="text-right text-[#eaecef] font-mono">{order.total.toFixed(4)}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Spread / Current Price */}
                <div className="py-2 px-2 border-y border-[#2b3139] my-2 bg-[#1e2329]">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-[#2ebd85] font-mono">{currentPrice.toFixed(2)}</span>
                        <span className="text-xs text-[#848e9c]">$65,432.10</span>
                    </div>
                </div>

                {/* Bids (Buys) */}
                <div className="space-y-[1px]">
                    {orders.bids.map((order, i) => (
                        <div key={`bid-${i}`} className="relative group cursor-pointer">
                            <div
                                className="absolute right-0 top-0 h-full bg-[#2ebd85]/10 transition-all duration-500"
                                style={{ width: `${(order.total / maxTotal) * 100}%` }}
                            ></div>
                            <div className="grid grid-cols-3 text-[11px] px-2 py-[2px] relative z-10">
                                <span className="text-[#2ebd85] font-mono">{order.price.toFixed(2)}</span>
                                <span className="text-right text-[#eaecef] font-mono">{order.amount.toFixed(4)}</span>
                                <span className="text-right text-[#eaecef] font-mono">{order.total.toFixed(4)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LiveOrderBook;
