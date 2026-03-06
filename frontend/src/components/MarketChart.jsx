import React, { useEffect, useRef, memo } from 'react';

function MarketChart({ symbol = 'BTCUSDT' }) {
    const container = useRef();

    useEffect(() => {
        // Clear previous widget
        if (container.current) {
            container.current.innerHTML = '';
        }

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            "autosize": true,
            "symbol": `BINANCE:${symbol.endsWith('USDT') ? symbol : symbol + 'USDT'}`,
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": "dark",
            "style": "1",
            "locale": "en",
            "enable_publishing": false,
            "allow_symbol_change": true,
            "calendar": false,
            "hide_volume": true,
            "support_host": "https://www.tradingview.com"
        });

        container.current.appendChild(script);
    }, [symbol]);

    return (
        <div className="binance-card h-[450px] overflow-hidden relative">
            <div className="absolute inset-0 flex flex-col">
                <div className="px-4 py-3 border-b border-[#2b3139] flex justify-between items-center">
                    <h3 className="text-sm font-bold text-[#eaecef]">Market Chart</h3>
                    <span className="text-xs text-[#848e9c] font-mono">{symbol}/USDT</span>
                </div>
                <div className="flex-grow tradingview-widget-container" ref={container}>
                    <div className="tradingview-widget-container__widget"></div>
                </div>
            </div>
        </div>
    );
}

export default memo(MarketChart);
