import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import TreasureMap from '../components/TreasureMap.jsx';
import './SignIn.css';

const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep]   = useState('email');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleEmailNext = (e) => {
    e.preventDefault();
    if (!email) return setError('Please enter your email');
    setError('');
    setStep('map');
  };

  const handleMapComplete = async (routePassword) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password: routePassword,
      });
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid route');
      setStep('email');
    }
  };

  if (step === 'map') return <TreasureMap mode="login" onComplete={handleMapComplete} />;

  return (
    <div className="signin-container">
      <div className="signin-left">
        <div className="brand">
          <div className="brand-icon">⬡</div>
          <h1>AuthApp</h1>
        </div>
        <p className="brand-tagline">Welcome<br />back.</p>
        <div className="decorative-circles">
          <div className="circle c1"></div>
          <div className="circle c2"></div>
          <div className="circle c3"></div>
        </div>
      </div>
      <div className="signin-right">
        <div className="form-wrapper">
          <h2>Sign In</h2>
          <p className="form-subtitle">Enter your email to continue</p>
          {error && <div className="error-msg">{error}</div>}
          <form onSubmit={handleEmailNext}>
            <div className="input-group">
              <label>Email</label>
              <input type="email" placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button type="submit" className="btn-primary">Set Sail →</button>
          </form>
          <p className="switch-auth">No account? <Link to="/signup">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;