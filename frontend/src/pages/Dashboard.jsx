import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertCircle, Activity, Brain, Target, Wallet, Briefcase, Trash2 } from 'lucide-react';
import ConditionModal from '../components/ConditionModal';
import api from '../services/api';
import { formatPrice } from '../utils/currency';

const Dashboard = () => {
  const [stats, setStats] = useState({ activeStocks: 0, totalAlerts: 0, profitPercentage: '0%', activeConditions: 0 });
  const [decisions, setDecisions] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCondition, setSelectedCondition] = useState(null);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, alertsRes, conditionsRes, portfolioRes] = await Promise.all([
        api.get('/dashboard/stats').catch(() => null),
        api.get('/dashboard/recent-alerts').catch(() => null),
        api.get('/conditions').catch(() => null),
        api.get('/portfolio').catch(() => null),
      ]);
      if (statsRes?.data) setStats(statsRes.data);
      if (alertsRes?.data) setDecisions(alertsRes.data);
      if (conditionsRes?.data) setConditions(conditionsRes.data.slice(0, 10));
      if (portfolioRes?.data) setPortfolioData(portfolioRes.data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCondition = async (id, symbol) => {
    if (window.confirm(`Delete ${symbol} condition?`)) {
      try {
        await api.delete(`/conditions/${id}`);
        setConditions(conditions.filter(c => c._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete condition');
      }
    }
  };

  const getActionBadge = (action) => {
    switch (action?.toUpperCase()) {
      case 'BUY':     return 'badge buy';
      case 'SELL':    return 'badge sell';
      case 'DROP':    return 'badge sell';
      case 'EXPIRED': return 'badge hold';
      default:        return 'badge hold';
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':   return { className: 'badge hold', label: 'Pending' };
      case 'ACTIVE':    return { className: 'badge buy',  label: 'Active' };
      case 'COMPLETED': return { className: 'badge buy',  label: 'Completed' };
      case 'EXPIRED':   return { className: 'badge sell', label: 'Expired' };
      case 'CANCELLED': return { className: 'badge hold', label: 'Cancelled' };
      default:          return { className: 'badge hold', label: status };
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { y: 16, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120 } },
  };

  const isProfit = (portfolioData?.totalProfitLoss || 0) >= 0;

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back. Here's your trading overview.</p>
        </div>
      </div>

      {/* Top Stats */}
      <div className="stat-grid">
        <motion.div variants={itemVariants} className="glass-card">
          <div className="stat-card-inner">
            <div className="stat-icon" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
              <Activity size={24} />
            </div>
            <div>
              <div className="stat-label">Watchlist Stocks</div>
              <div className="stat-value">{stats.activeStocks}</div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card">
          <div className="stat-card-inner">
            <div className="stat-icon" style={{ background: 'var(--color-buy-bg)', color: 'var(--color-buy)' }}>
              <Target size={24} />
            </div>
            <div>
              <div className="stat-label">Active Conditions</div>
              <div className="stat-value">{stats.activeConditions || 0}</div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card">
          <div className="stat-card-inner">
            <div className="stat-icon" style={{ background: 'var(--color-sell-bg)', color: 'var(--color-sell)' }}>
              <AlertCircle size={24} />
            </div>
            <div>
              <div className="stat-label">Total Alerts</div>
              <div className="stat-value">{stats.totalAlerts}</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Portfolio Summary */}
      {portfolioData && (
        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <motion.div variants={itemVariants} className="glass-card">
            <div className="stat-card-inner">
              <div className="stat-icon" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                <Wallet size={22} />
              </div>
              <div>
                <div className="stat-label">Virtual Balance</div>
                <div className="stat-value" style={{ fontSize: '1.35rem' }}>{formatPrice(portfolioData.virtualBalance, 'INR.NS')}</div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card" style={{
            borderColor: isProfit ? 'rgba(0,230,118,0.25)' : 'rgba(255,82,82,0.25)',
          }}>
            <div className="stat-card-inner">
              <div className="stat-icon" style={{
                background: isProfit ? 'var(--color-buy-bg)' : 'var(--color-sell-bg)',
                color: isProfit ? 'var(--color-buy)' : 'var(--color-sell)',
              }}>
                <TrendingUp size={22} />
              </div>
              <div>
                <div className="stat-label">Total P&L</div>
                <div className="stat-value" style={{ fontSize: '1.35rem', color: isProfit ? 'var(--color-buy)' : 'var(--color-sell)' }}>
                  {isProfit ? '+' : ''}{formatPrice(portfolioData.totalProfitLoss, 'INR.NS')}
                  <span style={{ fontSize: '0.75rem', marginLeft: '0.3rem', opacity: 0.8 }}>
                    ({isProfit ? '+' : ''}{portfolioData.totalProfitLossPercent?.toFixed(2) || '0.00'}%)
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card">
            <div className="stat-card-inner">
              <div className="stat-icon" style={{ background: 'var(--color-hold-bg)', color: 'var(--color-hold)' }}>
                <Briefcase size={22} />
              </div>
              <div>
                <div className="stat-label">Open Positions</div>
                <div className="stat-value">{portfolioData.openTrades?.length || 0}</div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Conditions + AI Insights */}
      <div className="dashboard-grid">
        {/* Conditions Table */}
        <motion.div variants={itemVariants} className="glass-card" style={{ padding: '1.5rem' }}>
          <div className="section-header">
            <div className="section-title">
              <Target size={18} color="var(--color-primary)" />
              Recent Conditions
            </div>
            <span className="section-count">{conditions.length} total</span>
          </div>

          {conditions.length === 0 ? (
            <div className="empty-state">
              <Target size={44} />
              <p>No conditions yet. Go to Conditions page to create one.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {conditions.map((cond) => {
                const statusInfo = getStatusBadge(cond.status);
                return (
                  <div
                    key={cond._id}
                    className="condition-row"
                    onClick={() => setSelectedCondition(cond)}
                  >
                    <div className="condition-row-left">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: '1rem' }}>{cond.symbol}</span>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
                          Buy ≤ {formatPrice(cond.buyPrice, cond.symbol)} · Target +{cond.targetProfitPercent}%
                        </span>
                      </div>
                    </div>
                    <div className="condition-row-right">
                      <span className={statusInfo.className}>{statusInfo.label}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteCondition(cond._id, cond.symbol); }}
                        style={{
                          background: 'none', border: 'none', color: 'var(--color-text-light)',
                          cursor: 'pointer', padding: '0.3rem', borderRadius: 'var(--radius-md)',
                          transition: 'all 0.15s', display: 'flex',
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.color = 'var(--color-sell)'; e.currentTarget.style.background = 'var(--color-sell-bg)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.color = 'var(--color-text-light)'; e.currentTarget.style.background = 'none'; }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* AI Insights */}
        <motion.div variants={itemVariants} className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
          <div className="section-header">
            <div className="section-title">
              <Brain size={18} color="var(--color-primary)" />
              AI Insights
            </div>
          </div>

          {decisions.length === 0 ? (
            <div className="empty-state" style={{ flex: 1 }}>
              <Brain size={44} />
              <p>No AI alerts yet. Set conditions and the AI will start monitoring.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', flex: 1, overflowY: 'auto' }}>
              {decisions.map((decision) => (
                <motion.div
                  key={decision.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                  style={{
                    background: 'var(--color-surface-2)',
                    padding: '1rem', borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '1rem' }}>{decision.stock}</span>
                    <span className={getActionBadge(decision.action)}>{decision.action}</span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '0.625rem', lineHeight: 1.5 }}>
                    {decision.reason}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
                    <span>Confidence: <strong style={{ color: 'var(--color-text-main)' }}>{Math.round(decision.confidence)}%</strong></span>
                    <span>{decision.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <ConditionModal
        condition={selectedCondition}
        onClose={() => setSelectedCondition(null)}
        onDelete={(id) => setConditions(conditions.filter(c => c._id !== id))}
      />
    </motion.div>
  );
};

export default Dashboard;
