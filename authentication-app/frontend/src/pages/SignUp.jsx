import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import TreasureMap from '../components/TreasureMap';
import './SignUp.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep]       = useState('info');
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleInfoNext = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email) return setError('Fill in all fields');
    setError('');
    setStep('map');
  };

  const handleMapComplete = async (routePassword) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        ...formData,
        password: routePassword,
      });
      navigate('/signin');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setStep('info');
    } finally {
      setLoading(false);
    }
  };

 if (step === 'map') return <TreasureMap mode="setup" onComplete={handleMapComplete} />;

  return (
    <div className="signup-container">
      <div className="signup-left">
        <div className="brand">
          <div className="brand-icon">⬡</div>
          <h1>AuthApp</h1>
        </div>
        <p className="brand-tagline">Your identity.<br />Secured.</p>
        <div className="decorative-circles">
          <div className="circle c1"></div>
          <div className="circle c2"></div>
          <div className="circle c3"></div>
        </div>
      </div>
      <div className="signup-right">
        <div className="form-wrapper">
          <h2>Create Account</h2>
          <p className="form-subtitle">Step 1 — Hi please sign up to get started</p>
          {error && <div className="error-msg">{error}</div>}
          <form onSubmit={handleInfoNext}>
            <div className="input-group">
              <label>Username</label>
              <input type="text" name="username" placeholder="e.g. captain_jack"
                value={formData.username} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input type="email" name="email" placeholder="you@example.com"
                value={formData.email} onChange={handleChange} />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              Chart the Map →
            </button>
          </form>
          <p className="switch-auth">
            Already sailing? <Link to="/signin">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;