import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Trash2, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import api from '../services/api';
import { formatPrice } from '../utils/currency';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    setLoading(true);
    try {
      const response = await api.get('/stocks/watchlist/prices');
      // Backend returns array of price objects; if empty, fetch just watchlist entries
      if (response.data && response.data.length > 0) {
        setWatchlist(response.data);
      } else {
        // No prices yet, try raw watchlist
        setWatchlist([]);
      }
    } catch (err) {
      console.error('Error fetching watchlist:', err);
      setWatchlist([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setAdding(true);
    try {
      const response = await api.post('/stocks/watchlist', {
        symbol: searchQuery.toUpperCase(),
        companyName: searchQuery.toUpperCase(),
      });
      if (response.data) {
        // Re-fetch to get updated prices
        await fetchWatchlist();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add stock';
      alert(msg);
    } finally {
      setSearchQuery('');
      setAdding(false);
    }
  };

  const handleRemoveStock = async (symbol) => {
    try {
      await api.delete(`/stocks/watchlist/${symbol}`);
      setWatchlist(watchlist.filter(stock => stock.symbol !== symbol));
    } catch (err) {
      console.error('Error removing stock:', err);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="page-header" style={{ alignItems: 'flex-start' }}>
        <div>
          <h1>Watchlist</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Track your favorite NSE and NASDAQ stocks.</p>
        </div>
        
        <form onSubmit={handleAddStock} style={{ display: 'flex', gap: '0.5rem', width: '100%', maxWidth: '400px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
            <input 
              type="text" 
              placeholder="Search symbol (e.g. AAPL, INF)" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', paddingLeft: '2.5rem' }}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: 'auto' }} disabled={adding || !searchQuery.trim()}>
            {adding ? <RefreshCw size={18} className="animate-spin" /> : <Plus size={18} />}
            <span>Add</span>
          </button>
        </form>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '4rem 0' }}>
          <RefreshCw className="animate-spin" size={32} color="var(--color-text-light)" />
        </div>
      ) : watchlist.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--color-border)' }}
        >
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Your watchlist is empty</h3>
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', maxWidth: '400px' }}>
            Start building your portfolio by searching for NSE or NASDAQ stock symbols above.
          </p>
        </motion.div>
      ) : (
        <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          <AnimatePresence>
            {watchlist.map(stock => (
              <motion.div
                key={stock.symbol || stock._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className="glass-card"
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{stock.symbol}</h3>
                    </div>
                    <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{stock.companyName || stock.symbol}</span>
                  </div>
                  <button 
                    onClick={() => handleRemoveStock(stock.symbol)}
                    style={{ color: 'var(--color-text-light)', padding: '0.4rem', borderRadius: 'var(--radius-md)' }}
                    onMouseOver={(e) => { e.currentTarget.style.color = 'var(--color-sell)'; e.currentTarget.style.background = 'var(--color-sell-bg)' }}
                    onMouseOut={(e) => { e.currentTarget.style.color = 'var(--color-text-light)'; e.currentTarget.style.background = 'none' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1.5rem' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>
                    {stock.price != null ? formatPrice(stock.price, stock.symbol) : '—'}
                  </div>
                  {stock.change != null && (
                    <div style={{ 
                      display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600,
                      color: stock.change >= 0 ? 'var(--color-buy)' : 'var(--color-sell)',
                      background: stock.change >= 0 ? 'var(--color-buy-bg)' : 'var(--color-sell-bg)',
                      padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-md)'
                    }}>
                      {stock.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      {stock.change > 0 ? '+' : ''}{stock.change}%
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default Watchlist;
