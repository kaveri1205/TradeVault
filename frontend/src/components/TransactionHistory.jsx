import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tradingAPI } from '../services/api';

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleTradeClick = (symbol) => {
        navigate('/dashboard', { state: { symbol, type: 'BUY' } });
    };

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await tradingAPI.getTransactions();
                // Sort transactions by timestamp descending (newest first)
                const sortedTransactions = response.data.sort((a, b) =>
                    new Date(b.timestamp) - new Date(a.timestamp)
                );
                setTransactions(sortedTransactions);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-[#f0b90b] text-xl animate-pulse">Loading transaction history...</div>
            </div>
        );
    }

    return (
        <div className="binance-card overflow-hidden">
            <div className="px-6 py-4 border-b border-[#2b3139]">
                <h2 className="text-xl font-bold text-[#eaecef]">Transaction History</h2>
                <p className="text-xs text-[#848e9c] mt-1">A record of all your buy and sell orders.</p>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="text-[#848e9c] text-xs uppercase tracking-wider border-b border-[#2b3139]">
                            <th className="px-6 py-4 text-left font-medium">Date & Time</th>
                            <th className="px-6 py-4 text-left font-medium">Symbol</th>
                            <th className="px-6 py-4 text-left font-medium">Type</th>
                            <th className="px-6 py-4 text-right font-medium">Quantity</th>
                            <th className="px-6 py-4 text-right font-medium">Price</th>
                            <th className="px-6 py-4 text-right font-medium">Total</th>
                            <th className="px-6 py-4 text-center font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2b3139]">
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-10 text-center text-[#848e9c] italic">
                                    No transactions found. Start trading to see your history!
                                </td>
                            </tr>
                        ) : (
                            transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-[#1e2329] transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#eaecef]">
                                        {formatDate(tx.timestamp)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-bold text-[#eaecef]">{tx.symbol}</span>
                                        <span className="text-[10px] text-[#848e9c] ml-1">/USDT</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${tx.type === 'BUY' ? 'bg-[#2ebd85]/10 text-[#2ebd85]' : 'bg-[#f6465d]/10 text-[#f6465d]'
                                            }`}>
                                            {tx.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-[#eaecef] font-mono">
                                        {tx.quantity}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-[#eaecef] font-mono">
                                        {formatCurrency(tx.price).replace('$', '')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-[#eaecef] font-mono">
                                        {formatCurrency(tx.price * tx.quantity).replace('$', '')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <button
                                            onClick={() => handleTradeClick(tx.symbol)}
                                            className="text-[10px] font-bold text-[#f0b90b] hover:text-[#fcd535] transition-colors bg-[#f0b90b]/10 px-2 py-1 rounded"
                                        >
                                            Trade
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionHistory;
