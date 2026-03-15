import React, { useEffect, useRef, memo } from 'react';

function MarketChart({ symbol = 'BTCUSDT' }) {
    const container = useRef();

    useEffect(() => {
        if (!container.current) return;

        // Clear previous content
        container.current.innerHTML = '';

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;

        const widgetSymbol = symbol.toUpperCase().endsWith('USDT') ? symbol.toUpperCase() : `${symbol.toUpperCase()}USDT`;

        script.innerHTML = JSON.stringify({
            "autosize": true,
            "symbol": `BINANCE:${widgetSymbol}`,
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": "dark",
            "style": "1",
            "locale": "en",
            "enable_publishing": false,
            "allow_symbol_change": true,
            "calendar": false,
            "support_host": "https://www.tradingview.com"
        });

        // Add a small delay for DOM stability
        const timeout = setTimeout(() => {
            if (container.current) {
                container.current.appendChild(script);
            }
        }, 100);

        return () => clearTimeout(timeout);
    }, [symbol]);

    return (
        <div className="binance-card h-[450px] overflow-hidden relative mb-6">
            <div className="absolute inset-0 flex flex-col">
                <div className="px-4 py-3 border-b border-[#2b3139] flex justify-between items-center bg-[#1e2329]">
                    <h3 className="text-sm font-bold text-[#eaecef]">Market Chart</h3>
                    <span className="text-xs text-[#848e9c] font-mono">{symbol.toUpperCase()}/USDT</span>
                </div>
                <div className="flex-grow relative w-full h-full min-h-0">
                    <div ref={container} className="tradingview-widget-container h-full w-full">
                        <div className="tradingview-widget-container__widget h-full w-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(MarketChart);
