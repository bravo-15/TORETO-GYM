import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUsers, FiCreditCard, FiActivity, FiBell } from 'react-icons/fi';

export default function Home() {
  return (
    <section className="home-premium">
      <div className="home-content">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <span className="home-badge">Sistema fitness profesional</span>

          <h1>
            Gestión integral para <br />
            <strong>TORETO GYM</strong>
          </h1>

          <p>
            Controla clientes, membresías, pagos, asistencias, rutinas y notificaciones desde una plataforma moderna.
          </p>

          <div className="home-actions">
            <Link className="home-btn-primary" to="/login">
              Ingresar al sistema
            </Link>
            <a className="home-btn-secondary" href="#modulos">
              Ver módulos
            </a>
          </div>
        </motion.div>

        <motion.div
          className="home-panel"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
        >
          <div className="home-panel-header">
            <span>TG</span>
            <div>
              <strong>Dashboard</strong>
              <small>Resumen en tiempo real</small>
            </div>
          </div>

          <div className="home-mini-grid">
            <div><FiUsers /><strong>Clientes</strong><span>Activos</span></div>
            <div><FiCreditCard /><strong>Pagos</strong><span>Mensuales</span></div>
            <div><FiActivity /><strong>Asistencias</strong><span>Diarias</span></div>
            <div><FiBell /><strong>Alertas</strong><span>Vencimientos</span></div>
          </div>
        </motion.div>
      </div>

      <div id="modulos" className="home-modules">
        <div><FiUsers /><h3>Clientes</h3><p>Registro y control de usuarios del gimnasio.</p></div>
        <div><FiCreditCard /><h3>Pagos</h3><p>Gestión de membresías e ingresos mensuales.</p></div>
        <div><FiActivity /><h3>Asistencias</h3><p>Control de ingreso y salida de clientes.</p></div>
        <div><FiBell /><h3>Notificaciones</h3><p>Alertas de membresías vencidas y avisos importantes.</p></div>
      </div>
    </section>
  );
}