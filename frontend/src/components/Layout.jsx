import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-[#0b0e11] text-[#eaecef]">
            {/* Header */}
            <header className="bg-[#181a20] border-b border-[#2b3139]">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <Link to="/dashboard">
                                <h1 className="text-2xl font-bold text-[#f0b90b] tracking-tight hover:opacity-80 transition-opacity">TRADEVAULT</h1>
                            </Link>
                            <div className="h-6 w-[1px] bg-[#2b3139]"></div>
                            <p className="text-xs text-[#848e9c]">Welcome, <span className="text-[#eaecef]">{user?.username}</span></p>
                        </div>
                        <div className="flex items-center space-x-4 sm:space-x-8">
                            <div className="flex space-x-4 sm:space-x-8 text-xs sm:text-sm font-bold uppercase tracking-wide">
                                <Link
                                    to="/markets"
                                    className={`transition-colors py-2 px-1 ${isActive('/markets') ? 'text-[#f0b90b] border-b-2 border-[#f0b90b]' : 'text-[#848e9c] hover:text-[#f0b90b]'}`}
                                >
                                    Markets
                                </Link>
                                <Link
                                    to="/dashboard"
                                    className={`transition-colors py-2 px-1 ${isActive('/dashboard') ? 'text-[#f0b90b] border-b-2 border-[#f0b90b]' : 'text-[#848e9c] hover:text-[#f0b90b]'}`}
                                >
                                    Trade
                                </Link>
                                <Link
                                    to="/history"
                                    className={`transition-colors py-2 px-1 ${isActive('/history') ? 'text-[#f0b90b] border-b-2 border-[#f0b90b]' : 'text-[#848e9c] hover:text-[#f0b90b]'}`}
                                >
                                    History
                                </Link>
                            </div>
                            <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-[#2b3139] rounded-full border border-[#373d44]">
                                <span className="w-1.5 h-1.5 bg-[#2ebd85] rounded-full animate-pulse"></span>
                                <span className="text-[10px] font-bold text-[#2ebd85]">LIVE DATA</span>
                            </div>
                            <button
                                onClick={logout}
                                className="bg-[#2b3139] hover:bg-[#373d44] text-[#eaecef] px-4 py-1.5 rounded text-sm font-medium transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {children}
            </main>
        </div>
    );
};

export default Layout;
