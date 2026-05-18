import { NavLink, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiHome,
  FiUsers,
  FiCreditCard,
  FiCalendar,
  FiUserCheck,
  FiActivity,
  FiClipboard,
  FiTrendingUp,
  FiBell,
  FiSettings,
  FiShield,
  FiUser,
  FiList,
  FiBarChart2
} from 'react-icons/fi';

import Header from './Header';
import { useAuth } from '../context/AuthContext';

export default function LayoutDashboard() {
  const { user } = useAuth();

  const links = [
    { to: 'dashboard', label: 'Dashboard', icon: <FiHome />, roles: ['ADMINISTRADOR', 'RECEPCIONISTA'] },
    { to: 'cliente-membresias', label: 'Cliente Membresías', icon: <FiUserCheck />, roles: ['ADMINISTRADOR', 'RECEPCIONISTA'] },
    { to: 'clientes', label: 'Clientes', icon: <FiUsers />, roles: ['ADMINISTRADOR', 'RECEPCIONISTA'] },
    { to: 'membresias', label: 'Membresías', icon: <FiCalendar />, roles: ['ADMINISTRADOR', 'RECEPCIONISTA'] },
    { to: 'pagos', label: 'Pagos', icon: <FiCreditCard />, roles: ['ADMINISTRADOR', 'RECEPCIONISTA'] },

    { to: 'reportes', label: 'Reportes', icon: <FiBarChart2 />, roles: ['ADMINISTRADOR'] },

    { to: 'asistencias', label: 'Asistencias', icon: <FiActivity />, roles: ['ADMINISTRADOR', 'RECEPCIONISTA'] },
    { to: 'entrenadores', label: 'Entrenadores', icon: <FiUser />, roles: ['ADMINISTRADOR'] },
    { to: 'ejercicios', label: 'Ejercicios', icon: <FiClipboard />, roles: ['ADMINISTRADOR', 'ENTRENADOR'] },
    { to: 'rutinas', label: 'Rutinas', icon: <FiSettings />, roles: ['ADMINISTRADOR', 'ENTRENADOR'] },
    { to: 'rutina-ejercicios', label: 'Rutina Ejercicios', icon: <FiList />, roles: ['ADMINISTRADOR', 'ENTRENADOR'] },
    { to: 'progreso-rutinas', label: 'Progreso', icon: <FiTrendingUp />, roles: ['ADMINISTRADOR', 'ENTRENADOR'] },
    { to: 'notificaciones', label: 'Notificaciones', icon: <FiBell />, roles: ['ADMINISTRADOR', 'RECEPCIONISTA', 'CLIENTE'] },
    { to: 'usuarios', label: 'Usuarios', icon: <FiUsers />, roles: ['ADMINISTRADOR'] },
    { to: 'roles', label: 'Roles', icon: <FiShield />, roles: ['ADMINISTRADOR'] }
  ];

  const linksFiltrados = links.filter((link) =>
    user && link.roles.includes(user.rol)
  );

  return (
    <div className="admin-shell">
      <aside className="modern-sidebar">
        <div className="brand-box">
          <div className="brand-logo">TG</div>
          <div>
            <h2>TORETO GYM</h2>
            <span>Panel administrativo</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          {linksFiltrados.map((link, index) => (
            <motion.div
              key={link.to}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <NavLink
                to={`/admin/${link.to}`}
                className={({ isActive }) =>
                  isActive ? 'sidebar-link active' : 'sidebar-link'
                }
              >
                <span className="sidebar-icon">{link.icon}</span>
                <span>{link.label}</span>
              </NavLink>
            </motion.div>
          ))}
        </nav>
      </aside>

      <section className="admin-main">
        <Header />

        <motion.main
          className="dashboard-content"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Outlet />
        </motion.main>
      </section>
    </div>
  );
}