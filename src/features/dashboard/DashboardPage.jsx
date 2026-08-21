import { useState } from "react";
import { useStrategizer } from "./useStrategizer.js";
import { TradeModal } from "../trades/TradeModal.jsx";
import { AnalysisDrawer } from "./AnalysisDrawer.jsx";
import { AddSymbolModal } from "./AddSymbolModal.jsx";
import { PageHeader } from "../../shared/ui/PageHeader.jsx";
import { StatCard } from "../../shared/ui/StatCard.jsx";
import { Badge } from "../../shared/ui/Badge.jsx";
import { ProbabilityMeter } from "../../shared/ui/ProbabilityMeter.jsx";
import { Sparkline } from "../../shared/ui/Sparkline.jsx";
import { ErrorMessage } from "../../shared/ui/ErrorMessage.jsx";
import { Spinner } from "../../shared/ui/Spinner.jsx";
import { motion } from "motion/react";
import {
  RefreshCw,
  PlusCircle,
  Zap,
  Sparkles,
  Info,
  Trash2,
  LayoutGrid,
  List,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Target,
} from "lucide-react";

export default function DashboardPage() {
  const { data, loading, refreshing, error, refetch, addSymbol, removeSymbol } = useStrategizer();
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table"); // "table" | "grid"
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [selectedAnalysisSymbol, setSelectedAnalysisSymbol] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const markets = data?.markets || [];
  const stats = data?.stats;

  // Filtered opportunities
  const filteredMarkets = markets.filter((m) => {
    if (filter === "buys") return m.recommendation === "STRONG BUY" || m.recommendation === "BUY";
    if (filter === "watchlist") return m.recommendation === "WATCHLIST";
    if (filter === "held") return m.is_held;
    if (filter === "exits") return m.recommendation === "EXIT" || m.recommendation === "AVOID";
    return true;
  });

  const getRecommendationBadgeVariant = (rec) => {
    switch (rec) {
      case "STRONG BUY": return "strong-buy";
      case "BUY": return "buy";
      case "WATCHLIST": return "watchlist";
      case "EXIT": return "exit";
      case "AVOID": return "avoid";
      default: return "neutral";
    }
  };

  return (
    <div className="flex flex-col gap-0 min-h-full pb-16">
      {/* Top Banner Header */}
      <PageHeader
        title="Market Strategizer"
        description="Automated Donchian 100/50 + SMA200 Trend Scanner & Paper Execution Engine"
        action={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-[--color-border] bg-[--color-surface-2]/90 backdrop-blur-sm px-4 py-2 text-xs font-semibold hover:border-[--color-accent] hover:text-[--color-accent] transition-all shadow-sm"
            >
              <PlusCircle className="size-3.5" />
              Add Market
            </button>
            <button
              onClick={() => refetch()}
              disabled={loading || refreshing}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4.5 py-2 text-xs font-bold text-white hover:from-sky-400 hover:to-blue-500 transition-all shadow-md shadow-sky-500/25 disabled:opacity-50"
            >
              <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
              <span>{refreshing ? "Scanning..." : "Scan Markets"}</span>
            </button>
          </div>
        }
      />

      <div className="px-6 lg:px-8 py-6 flex flex-col gap-6 w-full">
        {/* Quick Intelligence Summary Ticker */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 gap-4 lg:grid-cols-4"
          >
            <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-emerald-900/10 to-transparent backdrop-blur-md p-5 flex flex-col justify-between relative overflow-hidden shadow-lg shadow-emerald-950/20">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                  Top Opportunity
                </span>
                <Sparkles className="size-4 text-emerald-400" />
              </div>
              <div className="mt-2.5">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl font-black font-mono text-[--color-text]">
                    {stats.best_opportunity_symbol || "—"}
                  </span>
                  <span className="text-sm font-mono font-bold text-emerald-400">
                    {stats.best_opportunity_score}% PROB
                  </span>
                </div>
                <p className="text-[11px] text-emerald-300/80 mt-0.5">Highest ranked Donchian breakout</p>
              </div>
            </div>

            <StatCard
              label="Actionable Breakouts"
              value={stats.strong_buys + stats.buys}
              sub={`${stats.strong_buys} Strong Buys / ${stats.buys} Buys`}
              trend="up"
            />
            <StatCard
              label="Watchlist Setups"
              value={stats.watchlists}
              sub="Approaching 100d breakout"
            />
            <StatCard
              label="Tracked Universe"
              value={stats.total_scanned}
              sub={`${data?.account?.open_positions || 0}/4 Slots Active`}
            />
          </motion.div>
        )}

        {/* Filter Controls & View Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[--color-surface-2]/80 backdrop-blur-md p-3.5 rounded-2xl border border-[--color-border]/90 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "All Markets", count: markets.length },
              { id: "buys", label: "🔥 Buy Signals", count: stats ? stats.strong_buys + stats.buys : 0 },
              { id: "watchlist", label: "👀 Watchlist", count: stats?.watchlists || 0 },
              { id: "held", label: "💼 Open Trades", count: data?.account?.open_positions || 0 },
              { id: "exits", label: "⚠️ Exits / Avoid", count: stats?.exits || 0 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filter === tab.id
                    ? "bg-[--color-surface-3] text-[--color-text] border border-[--color-border] shadow-sm"
                    : "text-[--color-muted] hover:text-[--color-text] hover:bg-[--color-surface-3]/50"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-1.5 px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                    filter === tab.id ? "bg-[--color-accent]/20 text-[--color-accent]" : "bg-[--color-surface-3] text-[--color-muted]"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 self-end sm:self-auto bg-[--color-surface-3] p-1 rounded-xl border border-[--color-border]">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "table" ? "bg-[--color-surface-2] text-[--color-text] shadow-sm" : "text-[--color-muted] hover:text-[--color-text]"
              }`}
              title="Table View"
            >
              <List className="size-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-[--color-surface-2] text-[--color-text] shadow-sm" : "text-[--color-muted] hover:text-[--color-text]"
              }`}
              title="Grid Cards View"
            >
              <LayoutGrid className="size-4" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-28 gap-3">
            <Spinner />
            <p className="text-xs text-[--color-muted] font-mono">Running Donchian Strategy scan across all markets...</p>
          </div>
        )}

        {/* Error State */}
        {error && <ErrorMessage message={error} onRetry={refetch} />}

        {/* Strategy Opportunity Matrix (Table View) */}
        {!loading && !error && viewMode === "table" && (
          <div className="rounded-2xl border border-[--color-border] bg-[--color-surface-2]/90 backdrop-blur-md overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm" aria-label="Market strategizer opportunities">
                <thead>
                  <tr className="border-b border-[--color-border] bg-[--color-surface-3]/50 text-[--color-muted] text-[11px] font-mono uppercase tracking-wider">
                    <th className="py-3.5 pl-6 font-semibold">Instrument & Trend</th>
                    <th className="py-3.5 px-3 font-semibold text-center">Rating</th>
                    <th className="py-3.5 px-3 font-semibold min-w-[120px]">Win Prob</th>
                    <th className="py-3.5 px-3 font-semibold text-right">Price (24h)</th>
                    <th className="py-3.5 px-3 font-semibold text-right">100d Breakout</th>
                    <th className="py-3.5 px-3 font-semibold text-right bg-rose-950/15 text-rose-300/90 border-x border-rose-900/20">
                      <span className="flex items-center justify-end gap-1">
                        <ShieldCheck className="size-3 text-rose-400" />
                        Stop Loss (SL)
                      </span>
                    </th>
                    <th className="py-3.5 px-3 font-semibold text-right bg-emerald-950/15 text-emerald-300/90 border-r border-emerald-900/20">
                      <span className="flex items-center justify-end gap-1">
                        <Target className="size-3 text-emerald-400" />
                        Target (2.5R)
                      </span>
                    </th>
                    <th className="py-3.5 px-3 font-semibold text-right">Suggested Size</th>
                    <th className="py-3.5 pr-6 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[--color-border]/50">
                  {filteredMarkets.map((opp) => {
                    const isPositiveChange = opp.change_24h_pct >= 0;
                    return (
                      <tr
                        key={opp.symbol}
                        className={`hover:bg-[--color-surface-3]/70 transition-colors group ${
                          opp.recommendation === "STRONG BUY" ? "bg-emerald-500/5" :
                          opp.recommendation === "BUY" ? "bg-green-500/5" :
                          opp.recommendation === "EXIT" ? "bg-rose-500/5" : ""
                        }`}
                      >
                        {/* Instrument & Sparkline */}
                        <td className="py-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setSelectedAnalysisSymbol(opp.symbol)}
                                  className="font-black font-mono text-base text-[--color-text] hover:text-[--color-accent] transition-colors"
                                >
                                  {opp.symbol}
                                </button>
                                {opp.is_held && (
                                  <Badge variant="accent" size="sm">HELD</Badge>
                                )}
                              </div>
                              <span className="text-[11px] text-[--color-muted-dim] font-mono block mt-0.5">
                                SMA200: ${opp.sma200?.toFixed(2)} ({opp.sma200_clearance_pct > 0 ? "+" : ""}{opp.sma200_clearance_pct}%)
                              </span>
                            </div>
                            {opp.sparkline && opp.sparkline.length > 1 && (
                              <div className="hidden xl:block pl-2">
                                <Sparkline data={opp.sparkline} isPositive={isPositiveChange} />
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Recommendation */}
                        <td className="py-4 px-3 text-center">
                          <Badge variant={getRecommendationBadgeVariant(opp.recommendation)} size="md">
                            {opp.recommendation}
                          </Badge>
                        </td>

                        {/* Probability Score */}
                        <td className="py-4 px-3">
                          <div className="w-28">
                            <ProbabilityMeter score={opp.probability_score} size="md" />
                          </div>
                        </td>

                        {/* Price & 24h Change */}
                        <td className="py-4 px-3 text-right font-mono">
                          <span className="font-bold text-base text-[--color-text] block">
                            ${opp.close?.toFixed(2)}
                          </span>
                          <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${
                            isPositiveChange ? "text-emerald-400" : "text-rose-400"
                          }`}>
                            {isPositiveChange ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                            {isPositiveChange ? "+" : ""}{opp.change_24h_pct}%
                          </span>
                        </td>

                        {/* 100d Breakout */}
                        <td className="py-4 px-3 text-right font-mono">
                          <span className="text-[--color-text] font-semibold">${opp.entry_high?.toFixed(2)}</span>
                          <span className={`text-[11px] block ${
                            opp.distance_to_breakout_pct >= 0 ? "text-emerald-400 font-bold" : "text-[--color-muted-dim]"
                          }`}>
                            {opp.distance_to_breakout_pct >= 0 ? "+" : ""}{opp.distance_to_breakout_pct}%
                          </span>
                        </td>

                        {/* Stop Loss (Grouped) */}
                        <td className="py-4 px-3 text-right font-mono text-rose-400 bg-rose-950/10 border-x border-rose-900/20">
                          <span className="font-bold text-sm">${opp.stop_loss?.toFixed(2)}</span>
                          <span className="text-[10px] text-rose-400/80 block mt-0.5">{opp.stop_loss_pct}%</span>
                        </td>

                        {/* Target (Grouped) */}
                        <td className="py-4 px-3 text-right font-mono text-emerald-400 bg-emerald-950/10 border-r border-emerald-900/20">
                          <span className="font-bold text-sm">${opp.take_profit_2?.toFixed(2)}</span>
                          <span className="text-[10px] text-emerald-400/80 block mt-0.5">R:R {opp.risk_reward_ratio}:1</span>
                        </td>

                        {/* Suggested Sizing */}
                        <td className="py-4 px-3 text-right font-mono">
                          <span className="font-bold text-[--color-text] text-sm">{opp.suggested_shares} shs</span>
                          <span className="text-[11px] text-[--color-muted-dim] block mt-0.5">
                            ~${opp.suggested_cost?.toLocaleString()}
                          </span>
                        </td>

                        {/* Action buttons */}
                        <td className="py-4 pr-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedAnalysisSymbol(opp.symbol)}
                              className="p-2 rounded-xl border border-[--color-border] text-[--color-muted] hover:text-[--color-text] hover:bg-[--color-surface-3] transition-colors"
                              title="Deep Dive Strategy Analysis"
                            >
                              <Info className="size-4" />
                            </button>
                            <button
                              onClick={() => setSelectedTrade(opp)}
                              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-md ${
                                opp.recommendation === "EXIT"
                                  ? "bg-rose-600 hover:bg-rose-500 shadow-rose-950/40"
                                  : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/40"
                              }`}
                            >
                              <Zap className="size-3.5" />
                              <span>{opp.recommendation === "EXIT" ? "Sell" : "Trade"}</span>
                            </button>
                            <button
                              onClick={() => removeSymbol(opp.symbol)}
                              className="p-1.5 rounded-lg text-[--color-muted-dim] hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                              title="Remove from tracking"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Strategy Opportunity Matrix (Grid Cards View) */}
        {!loading && !error && viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4.5">
            {filteredMarkets.map((opp) => {
              const isPositiveChange = opp.change_24h_pct >= 0;
              return (
                <div
                  key={opp.symbol}
                  className="rounded-2xl border border-[--color-border] bg-[--color-surface-2]/90 backdrop-blur-md p-5 flex flex-col justify-between gap-4 hover:border-[--color-accent]/60 transition-all shadow-md"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedAnalysisSymbol(opp.symbol)}
                            className="text-xl font-black font-mono text-[--color-text] hover:text-[--color-accent] transition-colors"
                          >
                            {opp.symbol}
                          </button>
                          {opp.is_held && <Badge variant="accent" size="sm">HELD</Badge>}
                        </div>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-base font-mono font-black text-[--color-text]">
                            ${opp.close?.toFixed(2)}
                          </span>
                          <span className={`text-xs font-mono font-bold ${
                            isPositiveChange ? "text-emerald-400" : "text-rose-400"
                          }`}>
                            {isPositiveChange ? "+" : ""}{opp.change_24h_pct}%
                          </span>
                        </div>
                      </div>
                      <Badge variant={getRecommendationBadgeVariant(opp.recommendation)}>
                        {opp.recommendation}
                      </Badge>
                    </div>

                    <div className="mt-4">
                      <ProbabilityMeter score={opp.probability_score} size="md" />
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-mono bg-[--color-surface-3]/70 p-3 rounded-xl border border-[--color-border]/60">
                      <div>
                        <span className="text-[10px] text-[--color-muted-dim] block">100d High</span>
                        <span className="font-semibold text-[--color-text]">${opp.entry_high?.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[--color-muted-dim] block">Stop Loss (SL)</span>
                        <span className="font-semibold text-rose-400">${opp.stop_loss?.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[--color-muted-dim] block">Target (2.5R)</span>
                        <span className="font-semibold text-emerald-400">${opp.take_profit_2?.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[--color-muted-dim] block">Suggested Size</span>
                        <span className="font-semibold text-[--color-text]">{opp.suggested_shares} shs</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-[--color-border]/60">
                    <button
                      onClick={() => setSelectedAnalysisSymbol(opp.symbol)}
                      className="flex-1 py-2 rounded-xl border border-[--color-border] text-xs font-medium text-[--color-muted] hover:text-[--color-text] hover:bg-[--color-surface-3] transition-colors"
                    >
                      Deep Dive
                    </button>
                    <button
                      onClick={() => setSelectedTrade(opp)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md"
                    >
                      <Zap className="size-3.5" />
                      <span>Execute</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Trade Execution Modal */}
      <TradeModal
        isOpen={!!selectedTrade}
        onClose={() => setSelectedTrade(null)}
        opportunity={selectedTrade}
        onSuccess={() => refetch()}
      />

      {/* Deep-Dive Analysis Drawer */}
      <AnalysisDrawer
        isOpen={!!selectedAnalysisSymbol}
        onClose={() => setSelectedAnalysisSymbol(null)}
        symbol={selectedAnalysisSymbol}
        onOpenTrade={(opp) => setSelectedTrade(opp)}
      />

      {/* Add Symbol Modal */}
      <AddSymbolModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addSymbol}
      />
    </div>
  );
}