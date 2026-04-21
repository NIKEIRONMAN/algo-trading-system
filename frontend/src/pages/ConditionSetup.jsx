import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, Target, Clock, DollarSign, Loader } from 'lucide-react';
import api from '../services/api';

const ConditionSetup = () => {
  const [formData, setFormData] = useState({
    stockSymbol: '',
    buyPrice: '',
    targetProfit: '',
    maxDays: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (success) setSuccess(false);
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Map frontend field names to backend expected fields
      await api.post('/conditions', {
        symbol: formData.stockSymbol,
        buyPrice: parseFloat(formData.buyPrice),
        targetProfitPercent: parseFloat(formData.targetProfit),
        maxDays: parseInt(formData.maxDays),
      });
      setSuccess(true);
      setFormData({ stockSymbol: '', buyPrice: '', targetProfit: '', maxDays: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save condition. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="page-header">
        <div>
          <h1>Condition Setup</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Define rules for AI automated monitoring.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 600px) 1fr', gap: '2rem' }}>
        <div className="glass-card">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {success && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ background: 'var(--color-buy-bg)', color: 'var(--color-buy)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={20} />
                <span style={{ fontWeight: 500 }}>Condition saved successfully! AI is now monitoring.</span>
              </motion.div>
            )}

            {error && (
              <div style={{ background: 'var(--color-sell-bg)', color: 'var(--color-sell)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                {error}
              </div>
            )}

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Target Stock Symbol</label>
              <input 
                type="text" 
                name="stockSymbol"
                required
                placeholder="e.g. TSLA, AAPL" 
                value={formData.stockSymbol}
                onChange={handleChange}
                style={{ textTransform: 'uppercase' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Maximum Buy Price</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="number" 
                    name="buyPrice"
                    min="0.01" step="0.01" required
                    placeholder="0.00" 
                    value={formData.buyPrice}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.5rem 0.75rem' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Target Profit (%)</label>
                <div style={{ position: 'relative' }}>
                  <Target size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                  <input 
                    type="number" 
                    name="targetProfit"
                    min="0.1" step="0.1" required
                    placeholder="5.0" 
                    value={formData.targetProfit}
                    onChange={handleChange}
                    style={{ width: '100%', paddingLeft: '2.25rem' }}
                  />
                </div>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Action Expiry (Max Days to wait)</label>
              <div style={{ position: 'relative' }}>
                <Clock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                <input 
                  type="number" 
                  name="maxDays"
                  min="1" max="365" required
                  placeholder="e.g. 14" 
                  value={formData.maxDays}
                  onChange={handleChange}
                  style={{ width: '100%', paddingLeft: '2.25rem' }}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
              {loading ? <Loader className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
              {loading ? 'Saving Condition...' : 'Save & Start AI Monitoring'}
            </button>
          </form>
        </div>

        {/* Feature Explanation Side Panel */}
        <div style={{ padding: '1.5rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target color="var(--color-primary)" size={20} />
            How Conditions Work
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <ChevronRight size={18} color="var(--color-primary)" style={{ marginTop: '0.1rem' }} />
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--color-text-main)' }}>Set the Limit:</strong> AI will only issue a BUY signal if the stock falls below your Maximum Buy Price.
              </p>
            </li>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <ChevronRight size={18} color="var(--color-primary)" style={{ marginTop: '0.1rem' }} />
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--color-text-main)' }}>Lock in Gains:</strong> Once purchased, the system automatically marks a SELL signal when your Target Profit % is reached.
              </p>
            </li>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <ChevronRight size={18} color="var(--color-primary)" style={{ marginTop: '0.1rem' }} />
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--color-text-main)' }}>Time Constraints:</strong> If the condition isn't met within the Max Days, the condition expires to ensure your capital isn't indefinitely pending.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default ConditionSetup;
