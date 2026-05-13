import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Eye, Settings, Bell, LogOut, Activity, Briefcase, ShoppingCart, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const navLinks = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/watchlist',  icon: Eye,              label: 'Watchlist'  },
  { to: '/portfolio',  icon: Briefcase,        label: 'Portfolio'  },
  { to: '/trade',      icon: ShoppingCart,     label: 'Trade'      },
  { to: '/conditions', icon: Settings,         label: 'Conditions' },
  { to: '/alerts',     icon: Bell,             label: 'Alerts'     },
];

// Bottom nav shows only 5 most important items
const bottomNavLinks = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Home'   },
  { to: '/watchlist',  icon: Eye,             label: 'Watch'  },
  { to: '/trade',      icon: ShoppingCart,    label: 'Trade'  },
  { to: '/portfolio',  icon: Briefcase,       label: 'Port.'  },
  { to: '/alerts',     icon: Bell,            label: 'Alerts' },
];

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState('Investor');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem('userName');
    if (name) setUserName(name);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <div className="layout-container">
      {/* Hamburger button (mobile) */}
      <button
        className="hamburger-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle navigation"
      >
        {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Sidebar overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-icon">
            <Activity color="white" size={20} />
          </div>
          <span>AITrade</span>
        </div>

        <nav className="nav-links" role="navigation">
          <div className="nav-section-label">Navigation</div>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <link.icon size={19} strokeWidth={isActive => isActive ? 2.5 : 2} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="user-profile">
          <div className="avatar">{userName.charAt(0).toUpperCase()}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="user-name">{userName}</div>
            <div className="user-role">Paper Trader</div>
          </div>
          <button onClick={handleLogout} title="Logout" className="logout-btn">
            <LogOut size={17} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Bottom navigation (mobile only) */}
      <nav className="bottom-nav" role="navigation" aria-label="Mobile navigation">
        <div className="bottom-nav-inner">
          {bottomNavLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={`bottom-nav-item ${isActive ? 'active' : ''}`}
              >
                <link.icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
