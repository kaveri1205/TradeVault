import React from 'react';

const SummaryCards = ({ summary }) => {
  if (!summary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[#1e2329] p-6 rounded-lg border border-[#2b3139] animate-pulse">
            <div className="h-4 bg-[#2b3139] rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-[#2b3139] rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const profitColor = summary.totalProfit >= 0 ? 'text-[#2ebd85]' : 'text-[#f6465d]';
  const profitSymbol = summary.totalProfit >= 0 ? '+' : '';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Virtual Balance */}
      <div className="binance-card p-6 border-l-4 border-l-[#f0b90b]">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-[#f0b90b]/10 rounded flex items-center justify-center">
              <span className="text-[#f0b90b] text-lg">💰</span>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-xs font-medium text-[#848e9c] uppercase tracking-wider">Spot Balance</p>
            <p className="text-2xl font-bold text-[#eaecef] font-mono">
              {formatCurrency(summary.virtualBalance).replace('$', '')}
              <span className="text-xs ml-1 text-[#848e9c]">USDT</span>
            </p>
          </div>
        </div>
      </div>

      {/* Portfolio Value */}
      <div className="binance-card p-6 border-l-4 border-l-[#2ebd85]">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-[#2ebd85]/10 rounded flex items-center justify-center">
              <span className="text-[#2ebd85] text-lg">📈</span>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-xs font-medium text-[#848e9c] uppercase tracking-wider">Invested Value</p>
            <p className="text-2xl font-bold text-[#eaecef] font-mono">
              {formatCurrency(summary.portfolioValue).replace('$', '')}
              <span className="text-xs ml-1 text-[#848e9c]">USDT</span>
            </p>
          </div>
        </div>
      </div>

      {/* Total Assets */}
      <div className="binance-card p-6 border-l-4 border-l-purple-500">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-purple-500/10 rounded flex items-center justify-center">
              <span className="text-purple-500 text-lg">💎</span>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-xs font-medium text-[#848e9c] uppercase tracking-wider">Net Worth (PNL)</p>
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl font-bold text-[#eaecef] font-mono">
                {formatCurrency(summary.totalAssets).replace('$', '')}
                <span className="text-xs ml-1 text-[#848e9c]">USDT</span>
              </p>
              <p className={`text-xs font-bold ${profitColor} font-mono`}>
                ({profitSymbol}{formatCurrency(summary.totalProfit).replace('$', '')})
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
