import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [correo, setCorreo] = useState('admin@toreto.com');
  const [password, setPassword] = useState('123');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(correo, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="login-premium-page">
      <div className="login-overlay"></div>

      <motion.div
        className="login-premium-card"
        initial={{ opacity: 0, y: 25, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45 }}
      >
        <div className="login-logo">TG</div>

        <h1>TORETO GYM</h1>
        <p>Ingresa al sistema de gestión fitness</p>

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label>Correo</label>
            <div className="login-input-box">
              <FiMail />
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="admin@toreto.com"
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label>Contraseña</label>
            <div className="login-input-box">
              <FiLock />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-submit">
            <FiLogIn />
            Ingresar al sistema
          </button>
        </form>

        <span className="login-footer">Panel administrativo seguro</span>
      </motion.div>
    </section>
  );
}