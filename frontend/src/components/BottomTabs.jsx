import React, { useState } from 'react';

const BottomTabs = ({ portfolio, orders = [] }) => {
    const [activeTab, setActiveTab] = useState('orders');

    return (
        <div className="binance-card overflow-hidden">
            <div className="flex border-b border-[#2b3139] bg-[#1e2329]">
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`px-6 py-3 text-sm font-bold transition-colors ${activeTab === 'orders'
                        ? 'text-[#f0b90b] border-b-2 border-[#f0b90b]'
                        : 'text-[#848e9c] hover:text-[#eaecef]'
                        }`}
                >
                    Open Orders (0)
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`px-6 py-3 text-sm font-bold transition-colors ${activeTab === 'history'
                        ? 'text-[#f0b90b] border-b-2 border-[#f0b90b]'
                        : 'text-[#848e9c] hover:text-[#eaecef]'
                        }`}
                >
                    Order History
                </button>
                <button
                    onClick={() => setActiveTab('assets')}
                    className={`px-6 py-3 text-sm font-bold transition-colors ${activeTab === 'assets'
                        ? 'text-[#f0b90b] border-b-2 border-[#f0b90b]'
                        : 'text-[#848e9c] hover:text-[#eaecef]'
                        }`}
                >
                    User Assets
                </button>
            </div>

            <div className="p-4 min-h-[200px]">
                {activeTab === 'orders' && (
                    <div className="flex flex-col items-center justify-center h-full py-10">
                        <div className="text-[#474d57] mb-2 font-mono">
                            <svg className="w-12 h-12 mx-auto mb-2 opacity-20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h10v2H7v-2zm0 4h7v2H7v-2z" />
                            </svg>
                            No open orders
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="text-[#848e9c] border-b border-[#2b3139]">
                                    <th className="pb-2 font-medium">Time</th>
                                    <th className="pb-2 font-medium">Symbol</th>
                                    <th className="pb-2 font-medium">Type</th>
                                    <th className="pb-2 font-medium">Price</th>
                                    <th className="pb-2 font-medium text-right">Filled</th>
                                </tr>
                            </thead>
                            <tbody className="text-[#eaecef] divide-y divide-[#2b3139]">
                                <tr className="hover:bg-[#2b3139]/50 transition-colors">
                                    <td className="py-3">2026-03-01 22:05</td>
                                    <td className="py-3 font-bold">BTC/USDT</td>
                                    <td className="py-3 text-[#2ebd85]">BUY</td>
                                    <td className="py-3 font-mono">65,432.10</td>
                                    <td className="py-3 text-right font-mono">1.0000</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'assets' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {portfolio.map((asset, i) => (
                            <div key={i} className="bg-[#2b3139] rounded p-3 flex justify-between items-center group hover:border-[#f0b90b] border border-transparent transition-all">
                                <div>
                                    <div className="text-xs text-[#848e9c]">{asset.symbol}</div>
                                    <div className="text-sm font-bold text-[#eaecef]">{asset.quantity.toFixed(4)}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-[#848e9c]">Value (USDT)</div>
                                    <div className="text-sm font-mono text-[#2ebd85]">{(asset.quantity * 65432).toFixed(2)}</div>
                                </div>
                            </div>
                        ))}
                        {portfolio.length === 0 && (
                            <div className="col-span-3 text-center py-10 text-[#474d57]">No assets found</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BottomTabs;
