import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiCreditCard,
  FiActivity,
  FiAlertTriangle,
  FiCheckCircle,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const API_URL = "http://localhost:3001/api";

export default function Dashboard() {
  const [data, setData] = useState({
    clientes: 0,
    membresiasActivas: 0,
    clientesVencidos: 0,
    pagosMes: 0,
    asistenciasHoy: 0,
  });

  const [vencidos, setVencidos] = useState([]);
  const [ingresos, setIngresos] = useState([]);
  const [asistencias, setAsistencias] = useState([]);

  const getHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchSeguro = async (url, valorDefecto) => {
    try {
      const res = await fetch(url, {
        headers: getHeaders(),
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return valorDefecto;
      }

      if (!res.ok) {
        return valorDefecto;
      }

      const json = await res.json();
      return json;
    } catch (error) {
      console.error("Error en dashboard:", error);
      return valorDefecto;
    }
  };

  useEffect(() => {
    cargarDashboard();
    cargarClientesVencidos();
    cargarIngresos();
    cargarAsistencias();
  }, []);

  const cargarDashboard = async () => {
    const json = await fetchSeguro(`${API_URL}/dashboard/resumen`, data);

    setData({
      clientes: Number(json.clientes || 0),
      membresiasActivas: Number(json.membresiasActivas || 0),
      clientesVencidos: Number(json.clientesVencidos || 0),
      pagosMes: Number(json.pagosMes || 0),
      asistenciasHoy: Number(json.asistenciasHoy || 0),
    });
  };

  const cargarClientesVencidos = async () => {
    const json = await fetchSeguro(`${API_URL}/dashboard/clientes-vencidos`, []);
    setVencidos(Array.isArray(json) ? json : []);
  };

  const cargarIngresos = async () => {
    const json = await fetchSeguro(`${API_URL}/dashboard/ingresos`, []);
    setIngresos(Array.isArray(json) ? json : []);
  };

  const cargarAsistencias = async () => {
    const json = await fetchSeguro(`${API_URL}/dashboard/asistencias`, []);
    setAsistencias(Array.isArray(json) ? json : []);
  };

  const renovarMembresia = async (id) => {
    const confirmar = await Swal.fire({
      title: "¿Renovar membresía?",
      text: "Se renovará la membresía del cliente seleccionado.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, renovar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#facc15",
      cancelButtonColor: "#ef4444",
    });

    if (!confirmar.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/dashboard/renovar-membresia/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({
          metodo_pago: "EFECTIVO",
        }),
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      if (!res.ok) {
        Swal.fire("Error", "No se pudo renovar la membresía", "error");
        return;
      }

      Swal.fire("Correcto", "Membresía renovada correctamente", "success");

      cargarDashboard();
      cargarClientesVencidos();
      cargarIngresos();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error en la conexión con el servidor", "error");
    }
  };

  const cards = [
    {
      title: "Clientes",
      value: data.clientes,
      icon: <FiUsers />,
      className: "blue",
      text: "Total registrados",
    },
    {
      title: "Membresías Activas",
      value: data.membresiasActivas,
      icon: <FiCheckCircle />,
      className: "green",
      text: "Clientes activos",
    },
    {
      title: "Clientes Vencidos",
      value: data.clientesVencidos,
      icon: <FiAlertTriangle />,
      className: "red",
      text: "Requieren renovación",
    },
    {
      title: "Pagos del Mes",
      value: `S/ ${Number(data.pagosMes || 0).toFixed(2)}`,
      icon: <FiCreditCard />,
      className: "gold",
      text: "Ingresos actuales",
    },
    {
      title: "Asistencias Hoy",
      value: data.asistenciasHoy,
      icon: <FiActivity />,
      className: "purple",
      text: "Ingresos al gym",
    },
  ];

  return (
    <div className="dashboard-premium">
      <div className="dashboard-title">
        <div>
          <h1>Dashboard</h1>
          <p>Resumen general de TORETO GYM</p>
        </div>
      </div>

      <div className="premium-card-grid">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            className={`premium-card ${card.className}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <div className="premium-icon">{card.icon}</div>
            <div>
              <span>{card.title}</span>
              <h2>{card.value}</h2>
              <p>{card.text}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="premium-charts-grid">
        <div className="premium-chart-card">
          <h3>Ingresos por mes</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={Array.isArray(ingresos) ? ingresos : []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="mes" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip />
              <Bar dataKey="total" fill="#facc15" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="premium-chart-card">
          <h3>Asistencias por día</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={Array.isArray(asistencias) ? asistencias : []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="fecha" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#38bdf8"
                strokeWidth={4}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {Array.isArray(vencidos) && vencidos.length > 0 && (
        <div className="premium-alert">
          <h3>⚠️ Clientes con membresía vencida</h3>
          <p>Hay {vencidos.length} cliente(s) que necesitan renovación.</p>

          <div className="premium-table-wrapper">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>DNI</th>
                  <th>Teléfono</th>
                  <th>Membresía</th>
                  <th>Precio</th>
                  <th>Fecha fin</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>

              <tbody>
                {vencidos.map((cliente) => (
                  <tr key={cliente.id_cliente_membresia}>
                    <td>{cliente.nombre} {cliente.apellido}</td>
                    <td>{cliente.dni}</td>
                    <td>{cliente.telefono}</td>
                    <td>{cliente.membresia}</td>
                    <td>S/ {Number(cliente.precio || 0).toFixed(2)}</td>
                    <td>{cliente.fecha_fin ? String(cliente.fecha_fin).slice(0, 10) : ""}</td>
                    <td>
                      <span className="badge-vencido">{cliente.estado}</span>
                    </td>
                    <td>
                      <button
                        className="btn-renovar"
                        onClick={() => renovarMembresia(cliente.id_cliente_membresia)}
                      >
                        Renovar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}