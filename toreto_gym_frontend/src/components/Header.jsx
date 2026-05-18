import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiLogOut, FiUser, FiCheckCircle } from 'react-icons/fi';

const API_URL = 'http://localhost:3001/api';

export default function Header() {
  const { user, logout } = useAuth();

  const [notificaciones, setNotificaciones] = useState([]);
  const [mostrar, setMostrar] = useState(false);

  const getHeaders = () => {
    const token = localStorage.getItem('token');

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };
  };

  useEffect(() => {
    if (user) {
      cargarNotificaciones();

      const intervalo = setInterval(() => {
        cargarNotificaciones();
      }, 3000);

      return () => clearInterval(intervalo);
    }
  }, [user]);

  const cargarNotificaciones = async () => {
    try {
      const res = await fetch(`${API_URL}/notificaciones`, {
        headers: getHeaders()
      });

      if (!res.ok) {
        setNotificaciones([]);
        return;
      }

      const data = await res.json();
      setNotificaciones(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando notificaciones');
      setNotificaciones([]);
    }
  };

  const marcarLeida = async (id) => {
    try {
      await fetch(`${API_URL}/notificaciones/marcar-leida/${id}`, {
        method: 'PUT',
        headers: getHeaders()
      });

      cargarNotificaciones();
    } catch (error) {
      console.error('Error marcando notificación');
    }
  };

  const salir = () => {
    setNotificaciones([]);
    logout();
  };

  const pendientes = notificaciones.filter((n) => n.estado === 'PENDIENTE');

  return (
    <header className="premium-header">
      <Link to="/admin/dashboard" className="premium-header-brand">
        <span className="brand-dot">TG</span>
        <div>
          <strong>TORETO GYM</strong>
          <small>Sistema de gestión fitness</small>
        </div>
      </Link>

      <div className="premium-header-actions">
        {user && (
          <div className="notification-wrapper">
            <motion.button
              className="notification-btn"
              onClick={() => setMostrar(!mostrar)}
              animate={pendientes.length > 0 ? { rotate: [0, -12, 12, -8, 8, 0] } : {}}
              transition={{ repeat: pendientes.length > 0 ? Infinity : 0, duration: 1.2 }}
            >
              <FiBell />
              {pendientes.length > 0 && (
                <span className="notification-badge">{pendientes.length}</span>
              )}
            </motion.button>

            <AnimatePresence>
              {mostrar && (
                <motion.div
                  className="notification-dropdown"
                  initial={{ opacity: 0, y: -10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="notification-header">
                    <h4>Notificaciones</h4>
                    <span>{pendientes.length} pendientes</span>
                  </div>

                  {pendientes.length === 0 && (
                    <div className="notification-empty">
                      <FiCheckCircle />
                      <p>No hay notificaciones pendientes</p>
                    </div>
                  )}

                  {pendientes.map((n) => (
                    <div key={n.id_notificacion} className="notification-item">
                      <strong>{n.titulo}</strong>
                      <p>{n.mensaje}</p>

                      <button onClick={() => marcarLeida(n.id_notificacion)}>
                        Marcar leída
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {user ? (
          <>
            <div className="user-chip">
              <div className="user-avatar">
                <FiUser />
              </div>
              <div>
                <strong>{user.nombre}</strong>
                <span>{user.rol}</span>
              </div>
            </div>

            <button className="logout-premium" onClick={salir}>
              <FiLogOut />
              Salir
            </button>
          </>
        ) : (
          <Link to="/login" className="login-premium">
            Iniciar sesión
          </Link>
        )}
      </div>
    </header>
  );
}