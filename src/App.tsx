import { useState, useEffect } from "react";
import Navbar from "./components/layouts/navbar";
import type { TabName } from "./types";
import MarketRates from "./components/rates/marketRate";
import SwapInterface from "./components/swap/swapInterface";
import TransactionHistory from './components/transactions/transactionHistory'
import Profile from './components/profile/profile'

// ============================================================
// Placeholder components — replace each one as we build them
// ============================================================
const Portfolio = () => (
  <div className="flex items-center justify-center h-full">
    <p style={{ color: "#9CA3AF" }}>Portfolio coming soon...</p>
  </div>
);

const renderPage = (tab: TabName) => {
  switch (tab) {
    case "portfolio":
      return <Portfolio />;
    case "rates":
      return <MarketRates />;
    case "swap":
      return <SwapInterface />;
    case "history":
      return <TransactionHistory />;
    case "profile":
      return <Profile />;
    default:
      return <Portfolio />;
  }
};

// ============================================================
// App Component
// ============================================================
const App = () => {
  const [activeTab, setActiveTab] = useState<TabName>("portfolio");

  useEffect(() => {
    // Initialize Telegram Web App SDK
    const initTelegram = () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tg = (window as any).Telegram?.WebApp;
        if (tg) {
          tg.ready(); // Tell Telegram the app has loaded
          tg.expand(); // Expand to full screen
        }
      } catch (err) {
        // Running in browser outside Telegram — safe to ignore
        console.info("Running outside Telegram:", err);
      }
    };

    initTelegram();
  }, []);

  return (
    <div
      className="flex flex-col min-h-screen w-full"
      style={{ backgroundColor: "#0A0A0F" }}
    >
      {/* Active page content */}
      <main
        className="flex-1 overflow-y-auto"
        // Padding bottom ensures content is not hidden behind navbar
        style={{ paddingBottom: "90px" }}
      >
        {renderPage(activeTab)}
      </main>

      {/* Bottom navigation — always visible */}
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;
