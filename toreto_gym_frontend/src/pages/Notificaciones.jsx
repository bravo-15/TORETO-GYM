import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { FiBell, FiCheckCircle, FiTrash2, FiZap } from 'react-icons/fi';

const API_URL = 'http://localhost:3001/api';

export default function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);

  const getHeaders = () => {
    const token = localStorage.getItem('token');

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };
  };

  useEffect(() => {
    cargarNotificaciones();
  }, []);

  const cargarNotificaciones = async () => {
    try {
      const res = await fetch(`${API_URL}/notificaciones`, {
        headers: getHeaders()
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire('Error', data.mensaje || 'Error al cargar notificaciones', 'error');
        return;
      }

      setNotificaciones(Array.isArray(data) ? data : []);
    } catch {
      Swal.fire('Error', 'Error al cargar notificaciones', 'error');
    }
  };

  const generarAutomaticas = async () => {
    try {
      const res = await fetch(`${API_URL}/notificaciones/generar-automaticas`, {
        method: 'POST',
        headers: getHeaders()
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire('Error', data.mensaje || 'Error al generar notificaciones', 'error');
        return;
      }

      Swal.fire(
        'Correcto',
        'Notificaciones automáticas generadas correctamente',
        'success'
      );

      cargarNotificaciones();
    } catch {
      Swal.fire('Error', 'Error en la petición', 'error');
    }
  };

  const marcarLeida = async (id) => {
    try {
      const res = await fetch(`${API_URL}/notificaciones/marcar-leida/${id}`, {
        method: 'PUT',
        headers: getHeaders()
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire('Error', data.mensaje || 'Error al marcar como leída', 'error');
        return;
      }

      Swal.fire('Correcto', 'Notificación marcada como leída', 'success');

      cargarNotificaciones();
    } catch {
      Swal.fire('Error', 'Error en la petición', 'error');
    }
  };

  const eliminar = async (id) => {
    const confirmar = await Swal.fire({
      title: '¿Eliminar notificación?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b'
    });

    if (!confirmar.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/notificaciones/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!res.ok) {
        Swal.fire('Error', 'Error al eliminar', 'error');
        return;
      }

      Swal.fire(
        'Eliminado',
        'Notificación eliminada correctamente',
        'success'
      );

      cargarNotificaciones();
    } catch {
      Swal.fire('Error', 'Error al eliminar', 'error');
    }
  };

  return (
    <div className="noti-page">
      <div className="noti-header">
        <div>
          <h1>Notificaciones</h1>
          <p>Gestiona alertas de membresías, vencimientos y avisos del gimnasio.</p>
        </div>

        <button className="noti-generate-btn" onClick={generarAutomaticas}>
          <FiZap />
          Generar automáticas
        </button>
      </div>

      <div className="noti-stats">
        <motion.div className="noti-stat-card" whileHover={{ y: -4 }}>
          <FiBell />
          <div>
            <span>Total</span>
            <strong>{notificaciones.length}</strong>
          </div>
        </motion.div>

        <motion.div className="noti-stat-card warning" whileHover={{ y: -4 }}>
          <FiBell />
          <div>
            <span>Pendientes</span>
            <strong>
              {notificaciones.filter((n) => n.estado === 'PENDIENTE').length}
            </strong>
          </div>
        </motion.div>

        <motion.div className="noti-stat-card success" whileHover={{ y: -4 }}>
          <FiCheckCircle />
          <div>
            <span>Leídas</span>
            <strong>
              {notificaciones.filter((n) => n.estado === 'LEIDA').length}
            </strong>
          </div>
        </motion.div>
      </div>

      <div className="noti-table-card">
        <div className="noti-table-top">
          <h3>Lista de notificaciones</h3>
        </div>

        <div className="noti-table-wrapper">
          <table className="noti-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Título</th>
                <th>Mensaje</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {notificaciones.length === 0 ? (
                <tr>
                  <td colSpan="5" className="noti-empty">
                    No hay notificaciones registradas
                  </td>
                </tr>
              ) : (
                notificaciones.map((n) => (
                  <tr key={n.id_notificacion}>
                    <td>{n.cliente}</td>
                    <td>{n.titulo}</td>
                    <td>{n.mensaje}</td>

                    <td>
                      <span className={`noti-badge ${String(n.estado).toLowerCase()}`}>
                        {n.estado}
                      </span>
                    </td>

                    <td>
                      <div className="noti-actions">
                        {n.estado === 'PENDIENTE' && (
                          <button
                            className="noti-read-btn"
                            onClick={() => marcarLeida(n.id_notificacion)}
                          >
                            <FiCheckCircle />
                            Marcar leída
                          </button>
                        )}

                        <button
                          className="noti-delete-btn"
                          onClick={() => eliminar(n.id_notificacion)}
                        >
                          <FiTrash2 />
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}