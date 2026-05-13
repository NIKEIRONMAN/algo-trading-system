import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, TrendingUp, Wallet, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../services/api';
import { formatPrice, getCurrencySymbol } from '../utils/currency';
import StockChart from '../components/StockChart';

const Trade = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [symbol, setSymbol] = useState(searchParams.get('symbol') || '');
  const [quantity, setQuantity] = useState(1);
  const [priceData, setPriceData] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingPrice, setFetchingPrice] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/portfolio').then(res => setPortfolio(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!symbol || symbol.length < 2) { setPriceData(null); return; }
    const timer = setTimeout(async () => {
      setFetchingPrice(true);
      setError(null);
      try {
        const res = await api.get(`/stocks/price/${symbol.toUpperCase()}`);
        setPriceData(res.data);
      } catch {
        setPriceData(null);
        setError(`Could not fetch price for "${symbol}"`);
      } finally {
        setFetchingPrice(false);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [symbol]);

  useEffect(() => {
    if (!symbol || !priceData) return;
    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/stocks/price/${symbol.toUpperCase()}`);
        setPriceData(res.data);
      } catch {}
    }, 10000);
    return () => clearInterval(interval);
  }, [symbol, priceData]);

  const currentPrice = priceData?.price || 0;
  const totalCost = Math.round(currentPrice * quantity * 100) / 100;
  const canBuy = portfolio && totalCost > 0 && portfolio.virtualBalance >= totalCost;

  const handleBuy = async () => {
    if (!canBuy) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await api.post('/trades/buy', {
        symbol: symbol.toUpperCase(),
        quantity: parseInt(quantity),
        companyName: priceData?.companyName || symbol.toUpperCase(),
      });
      setSuccess(res.data);
      setPortfolio(prev => prev ? { ...prev, virtualBalance: res.data.newBalance } : prev);
      setTimeout(() => navigate('/portfolio'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Trade failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="page-header">
        <div>
          <h1>Buy Stock</h1>
          <p>Paper trade with your virtual balance</p>
        </div>
        {portfolio && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'var(--color-surface-2)', padding: '0.625rem 1rem',
            borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)',
            fontSize: '0.875rem',
          }}>
            <Wallet size={16} color="var(--color-primary)" />
            <span style={{ color: 'var(--color-text-muted)' }}>Balance:</span>
            <span style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>{formatPrice(portfolio.virtualBalance, 'INR.NS')}</span>
          </div>
        )}
      </div>

      <div className="trade-grid">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card"
        >
          {symbol && symbol.length >= 2 ? (
            <StockChart symbol={symbol.toUpperCase()} height={340} />
          ) : (
            <div style={{ height: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
              <TrendingUp size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p>Enter a stock symbol to see the chart</p>
            </div>
          )}
        </motion.div>

        {/* Order Form */}
        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
            <div style={{ background: 'var(--color-buy-bg)', padding: '0.75rem', borderRadius: 'var(--radius-lg)', color: 'var(--color-buy)' }}>
              <ShoppingCart size={22} />
            </div>
            <h2 style={{ fontSize: '1.25rem' }}>Place Order</h2>
          </div>

          {/* Symbol */}
          <div className="form-group">
            <label>Stock Symbol</label>
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)', pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder="e.g. TCS.NS, AAPL, RELIANCE.NS"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                style={{ paddingLeft: '2.5rem', textTransform: 'uppercase' }}
              />
              {fetchingPrice && (
                <RefreshCw size={13} className="animate-spin" style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)' }} />
              )}
            </div>
          </div>

          {/* Quantity */}
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number" min="1" step="1" value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>

          {/* Price breakdown */}
          <AnimatePresence>
            {priceData && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{
                  background: 'var(--color-surface-2)', borderRadius: 'var(--radius-lg)',
                  padding: '1.125rem', marginBottom: '1.25rem', border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Current Price</span>
                  <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--color-buy)' }}>{formatPrice(currentPrice, symbol)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Total Cost</span>
                  <span style={{ fontWeight: 700, fontSize: '1rem' }}>{formatPrice(totalCost, symbol)}</span>
                </div>
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.625rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Wallet size={13} /> Available Balance
                  </span>
                  <span style={{ fontWeight: 600, color: canBuy ? 'var(--color-text-main)' : 'var(--color-sell)' }}>
                    {portfolio ? formatPrice(portfolio.virtualBalance, symbol) : '—'}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                style={{
                  background: 'var(--color-sell-bg)', border: '1px solid rgba(255,82,82,0.3)',
                  borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem',
                  color: 'var(--color-sell)', fontSize: '0.875rem', marginBottom: '1rem',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                }}
              >
                <AlertCircle size={15} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                style={{
                  background: 'var(--color-buy-bg)', border: '1px solid rgba(0,230,118,0.3)',
                  borderRadius: 'var(--radius-md)', padding: '1rem',
                  color: 'var(--color-buy)', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center',
                }}
              >
                <CheckCircle size={30} style={{ margin: '0 auto 0.5rem' }} />
                <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>Trade Successful! 🎉</div>
                <div style={{ color: 'var(--color-text-muted)' }}>{success.message}</div>
                <div style={{ marginTop: '0.5rem', fontWeight: 600 }}>New Balance: {formatPrice(success.newBalance, symbol)}</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Buy Button */}
          <button
            onClick={handleBuy}
            disabled={!canBuy || loading || !!success}
            style={{
              width: '100%', padding: '1rem', borderRadius: 'var(--radius-lg)',
              fontWeight: 700, fontSize: '1.05rem',
              cursor: canBuy && !loading ? 'pointer' : 'not-allowed',
              background: canBuy && !loading
                ? 'linear-gradient(135deg, #00E676, #00C853)'
                : 'var(--color-surface-2)',
              color: canBuy && !loading ? '#0A1628' : 'var(--color-text-light)',
              border: 'none', transition: 'all 0.2s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              boxShadow: canBuy ? '0 4px 20px rgba(0,230,118,0.25)' : 'none',
            }}
            onMouseOver={(e) => { if (canBuy && !loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,230,118,0.35)'; } }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = canBuy ? '0 4px 20px rgba(0,230,118,0.25)' : 'none'; }}
          >
            {loading
              ? <><RefreshCw size={19} className="animate-spin" /> Processing...</>
              : <><ShoppingCart size={19} /> BUY NOW</>
            }
          </button>

          {!canBuy && priceData && !success && (
            <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--color-text-light)', marginTop: '0.75rem' }}>
              {portfolio && portfolio.virtualBalance < totalCost
                ? `Insufficient balance. Need ${formatPrice(totalCost - portfolio.virtualBalance, symbol)} more.`
                : 'Enter a valid symbol and quantity to enable buying.'}
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Trade;
