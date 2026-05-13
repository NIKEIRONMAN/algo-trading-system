import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, BarChart3, History, RefreshCw, ShoppingCart, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { formatPrice } from '../utils/currency';
import StockChart from '../components/StockChart';

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selling, setSelling] = useState(null);
  const [sellQuantity, setSellQuantity] = useState({});
  const [sellResult, setSellResult] = useState(null);
  const [sellError, setSellError] = useState(null);
  const [selectedChart, setSelectedChart] = useState(null);

  const fetchPortfolio = useCallback(async () => {
    try {
      const res = await api.get('/portfolio');
      setPortfolio(res.data);
    } catch (err) {
      console.error('Portfolio fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPortfolio(); }, [fetchPortfolio]);
  useEffect(() => {
    const interval = setInterval(fetchPortfolio, 10000);
    return () => clearInterval(interval);
  }, [fetchPortfolio]);

  const handleSell = async (symbol, maxQty) => {
    const qty = parseInt(sellQuantity[symbol]) || maxQty;
    if (qty < 1 || qty > maxQty) return;
    setSelling(symbol);
    setSellError(null);
    setSellResult(null);
    try {
      const res = await api.post('/trades/sell', { symbol, quantity: qty });
      setSellResult(res.data);
      setTimeout(() => { fetchPortfolio(); setSellResult(null); setSelling(null); }, 2500);
    } catch (err) {
      setSellError(err.response?.data?.message || 'Sell failed');
      setTimeout(() => { setSellError(null); setSelling(null); }, 3000);
    }
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const itemVariants = { hidden: { y: 16, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120 } } };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <RefreshCw className="animate-spin" size={32} color="var(--color-text-light)" />
      </div>
    );
  }

  const isProfit = (portfolio?.totalProfitLoss || 0) >= 0;

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <div className="page-header">
        <div>
          <h1>Virtual Portfolio</h1>
          <p>Starting Balance: ₹1,00,000 · Paper Trading</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stat-grid">
        <motion.div variants={itemVariants} className="glass-card">
          <div className="stat-card-inner">
            <div className="stat-icon" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}><Wallet size={22} /></div>
            <div>
              <div className="stat-label">Balance</div>
              <div className="stat-value" style={{ fontSize: '1.35rem' }}>{formatPrice(portfolio?.virtualBalance, 'INR.NS')}</div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card">
          <div className="stat-card-inner">
            <div className="stat-icon" style={{ background: 'var(--color-hold-bg)', color: 'var(--color-hold)' }}><ShoppingCart size={22} /></div>
            <div>
              <div className="stat-label">Invested</div>
              <div className="stat-value" style={{ fontSize: '1.35rem' }}>{formatPrice(portfolio?.totalInvested, 'INR.NS')}</div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card">
          <div className="stat-card-inner">
            <div className="stat-icon" style={{ background: 'var(--color-buy-bg)', color: 'var(--color-buy)' }}><BarChart3 size={22} /></div>
            <div>
              <div className="stat-label">Current Value</div>
              <div className="stat-value" style={{ fontSize: '1.35rem' }}>{formatPrice(portfolio?.totalCurrentValue, 'INR.NS')}</div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card" style={{
          borderColor: isProfit ? 'rgba(0,230,118,0.3)' : 'rgba(255,82,82,0.3)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.07,
            background: isProfit ? 'linear-gradient(135deg, #00E676, transparent)' : 'linear-gradient(135deg, #FF5252, transparent)',
          }} />
          <div className="stat-card-inner" style={{ position: 'relative' }}>
            <div className="stat-icon" style={{ background: isProfit ? 'var(--color-buy-bg)' : 'var(--color-sell-bg)', color: isProfit ? 'var(--color-buy)' : 'var(--color-sell)' }}>
              {isProfit ? <TrendingUp size={22} /> : <TrendingDown size={22} />}
            </div>
            <div>
              <div className="stat-label">Total P&L</div>
              <div className="stat-value" style={{ fontSize: '1.35rem', color: isProfit ? 'var(--color-buy)' : 'var(--color-sell)' }}>
                {isProfit ? '+' : ''}{formatPrice(portfolio?.totalProfitLoss, 'INR.NS')}
                <span style={{ fontSize: '0.75rem', marginLeft: '0.35rem', opacity: 0.85 }}>
                  ({isProfit ? '+' : ''}{portfolio?.totalProfitLossPercent?.toFixed(2) || '0.00'}%)
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Alert banners */}
      <AnimatePresence>
        {sellResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{
              background: 'var(--color-buy-bg)', border: '1px solid rgba(0,230,118,0.3)',
              borderRadius: 'var(--radius-lg)', padding: '1rem 1.5rem',
              marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-buy)',
            }}
          >
            <CheckCircle size={18} />
            <div>
              <strong>{sellResult.message}</strong>
              <span style={{ marginLeft: '1rem', color: sellResult.profitLoss >= 0 ? 'var(--color-buy)' : 'var(--color-sell)' }}>
                P&L: {sellResult.profitLoss >= 0 ? '+' : ''}₹{sellResult.profitLoss?.toFixed(2)} ({sellResult.profitLossPercent?.toFixed(2)}%)
              </span>
            </div>
          </motion.div>
        )}
        {sellError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{
              background: 'var(--color-sell-bg)', border: '1px solid rgba(255,82,82,0.3)',
              borderRadius: 'var(--radius-lg)', padding: '1rem 1.5rem',
              marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-sell)',
            }}
          >
            <AlertCircle size={18} /> <strong>{sellError}</strong>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Open Positions */}
      <motion.div variants={itemVariants} className="glass-card" style={{ marginBottom: '1.5rem' }}>
        <div className="section-header">
          <div className="section-title">
            <BarChart3 size={18} color="var(--color-primary)" /> Open Positions
          </div>
          <span className="section-count">{portfolio?.openTrades?.length || 0} holdings</span>
        </div>

        {(!portfolio?.openTrades || portfolio.openTrades.length === 0) ? (
          <div className="empty-state">
            <ShoppingCart size={44} />
            <p>No open positions. Go to Trade to buy stocks!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {portfolio.openTrades.map((trade) => {
              const pl = trade.profitLoss || 0;
              const plPercent = trade.profitLossPercent || 0;
              const isUp = pl >= 0;

              return (
                <motion.div key={trade._id} layout whileHover={{ scale: 1.005 }} className="position-row">
                  {/* Stock Info */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: '1rem' }}>{trade.symbol}</span>
                      <span style={{ color: 'var(--color-text-light)', fontSize: '0.8rem' }}>{trade.quantity} shares</span>
                    </div>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{trade.companyName}</span>
                  </div>

                  {/* Buy Price */}
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>Buy Price</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{formatPrice(trade.price, trade.symbol)}</div>
                  </div>

                  {/* Current Price */}
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>Current</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: isUp ? 'var(--color-buy)' : 'var(--color-sell)' }}>
                      {formatPrice(trade.currentPrice, trade.symbol)}
                    </div>
                  </div>

                  {/* P&L */}
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>P&L</div>
                    <div style={{ fontWeight: 700, color: isUp ? 'var(--color-buy)' : 'var(--color-sell)', display: 'flex', alignItems: 'center', gap: '0.2rem', flexWrap: 'wrap' }}>
                      {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                      {isUp ? '+' : ''}{formatPrice(pl, trade.symbol)}
                      <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>({isUp ? '+' : ''}{plPercent.toFixed(2)}%)</span>
                    </div>
                  </div>

                  {/* Sell Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="number" min="1" max={trade.quantity}
                      placeholder={trade.quantity}
                      value={sellQuantity[trade.symbol] || ''}
                      onChange={(e) => setSellQuantity(prev => ({ ...prev, [trade.symbol]: e.target.value }))}
                      style={{ width: '56px', padding: '0.375rem', fontSize: '0.8rem', textAlign: 'center', borderRadius: 'var(--radius-md)' }}
                    />
                    <button
                      onClick={() => handleSell(trade.symbol, trade.quantity)}
                      disabled={selling === trade.symbol}
                      style={{
                        background: 'var(--color-sell)', color: '#fff', padding: '0.5rem 0.875rem',
                        borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '0.825rem',
                        cursor: 'pointer', border: 'none',
                        opacity: selling === trade.symbol ? 0.5 : 1,
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 10px rgba(255,82,82,0.25)',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseOver={(e) => { if (selling !== trade.symbol) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                      onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; }}
                    >
                      {selling === trade.symbol ? '...' : 'SELL'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Chart for selected stock */}
      <AnimatePresence>
        {selectedChart && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card" style={{ marginBottom: '1.5rem' }}
          >
            <StockChart symbol={selectedChart} height={280} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trade History */}
      <motion.div variants={itemVariants} className="glass-card">
        <div className="section-header">
          <div className="section-title">
            <History size={18} color="var(--color-primary)" /> Trade History
          </div>
        </div>

        {(!portfolio?.closedTrades || portfolio.closedTrades.length === 0) ? (
          <div className="empty-state">
            <History size={40} />
            <p>No closed trades yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {portfolio.closedTrades.map((trade) => {
              const isBuy = trade.type === 'BUY';
              const pl = trade.profitLoss || 0;
              const isUp = pl >= 0;
              return (
                <div key={trade._id} className="history-row">
                  <span className={`badge ${isBuy ? 'buy' : 'sell'}`}>{trade.type}</span>
                  <div>
                    <span style={{ fontWeight: 600 }}>{trade.symbol}</span>
                    <span style={{ color: 'var(--color-text-muted)', marginLeft: '0.4rem', fontSize: '0.85rem' }}>×{trade.quantity}</span>
                  </div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>@ {formatPrice(trade.price, trade.symbol)}</div>
                  <div style={{ fontWeight: 600 }}>{formatPrice(trade.totalAmount, trade.symbol)}</div>
                  {trade.type === 'SELL' ? (
                    <div style={{ fontWeight: 700, color: isUp ? 'var(--color-buy)' : 'var(--color-sell)', textAlign: 'right' }}>
                      {isUp ? '+' : ''}{formatPrice(pl, trade.symbol)}
                    </div>
                  ) : (
                    <div style={{ color: 'var(--color-text-light)', textAlign: 'right', fontSize: '0.75rem' }}>
                      {new Date(trade.closedAt || trade.createdAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Portfolio;
