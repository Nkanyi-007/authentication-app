import { useEffect, useState } from 'react';
import { useNavigate }          from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [time, setTime] = useState(new Date());
  const navigate        = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/signin'); return; }
    setUser(JSON.parse(stored));

    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/auth/logout', {
        method:  'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (_) {
      // silent — always clear client-side regardless
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/signin');
    }
  };

  if (!user) return null;

  const greet = () => {
    const h = time.getHours();
    if (h < 12) return 'Good morn';
    if (h < 18) return 'Good day';
    return 'Good eve';
  };

  return (
    <div className="dash-root">

      {/* ── top nav bar ── */}
      <nav className="dash-nav">
        <span className="dash-nav-brand">⚓ The Secret Route</span>
        <button className="dash-nav-logout" onClick={handleLogout}>
          ⟶ Abandon Ship
        </button>
      </nav>

      {/* ── main card ── */}
      <main className="dash-main">
        <div className="dash-card">
          <div className="dash-compass">🧭</div>

          <h1 className="dash-greeting">
            {greet()}, Captain <span className="dash-name">{user.username}</span>
          </h1>

          <div className="dash-divider" />

          <p className="dash-sub">
            Thy secret route holds fast. The treasure is secure.
          </p>

          {/* ── stats row ── */}
          <div className="dash-stats">
            <div className="dash-stat">
              <span className="dash-stat-icon">⚓</span>
              <span className="dash-stat-label">Status</span>
              <span className="dash-stat-value">Docked Safely</span>
            </div>
            <div className="dash-stat">
              <span className="dash-stat-icon">🗺️</span>
              <span className="dash-stat-label">Route</span>
              <span className="dash-stat-value">Sealed & Secured</span>
            </div>
            <div className="dash-stat">
              <span className="dash-stat-icon">🕰️</span>
              <span className="dash-stat-label">Ship's Clock</span>
              <span className="dash-stat-value">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* ── scroll / flavour ── */}
          <div className="dash-scroll">
            <p className="dash-scroll-text">
              "Only those who know the route may enter these waters.<br />
              Thou hast proven thyself worthy, navigator."
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}