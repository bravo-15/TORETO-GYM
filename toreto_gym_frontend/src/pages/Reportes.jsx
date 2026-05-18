import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
  FiBarChart2,
  FiDownload,
  FiDollarSign,
  FiUsers,
  FiCheckCircle
} from 'react-icons/fi';

const API_URL = 'http://localhost:3001/api';

export default function Reportes() {
  const [pagos, setPagos] = useState([]);
  const [estado, setEstado] = useState('');

  useEffect(() => {
    cargarPagos();
  }, []);

  const cargarPagos = async () => {
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${API_URL}/pagos`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setPagos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const pagosFiltrados = estado
    ? pagos.filter((p) => p.estado === estado)
    : pagos;

  const totalIngresos = pagosFiltrados
    .filter((p) => p.estado === 'PAGADO')
    .reduce((acc, p) => acc + Number(p.monto), 0);

  const exportarPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Reporte TORETO GYM', 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [['Cliente', 'Monto', 'Método', 'Estado', 'Fecha']],
      body: pagosFiltrados.map((p) => [
        p.cliente || 'Cliente',
        `S/ ${p.monto}`,
        p.metodo_pago,
        p.estado,
        new Date(p.fecha_pago).toLocaleDateString()
      ])
    });

    doc.save('reporte_toreto_gym.pdf');
  };

  const exportarExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      pagosFiltrados.map((p) => ({
        Cliente: p.cliente || 'Cliente',
        Monto: p.monto,
        Metodo: p.metodo_pago,
        Estado: p.estado,
        Fecha: new Date(p.fecha_pago).toLocaleDateString()
      }))
    );

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Reporte'
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const data = new Blob([excelBuffer], {
      type: 'application/octet-stream'
    });

    saveAs(data, 'reporte_toreto_gym.xlsx');
  };

  return (
    <div className="dashboard-content">
      <div className="report-header">
        <div>
          <h1>Reportes</h1>
          <p>Visualiza ingresos y exporta información.</p>
        </div>

        <div className="report-actions">
          <button className="report-export-btn" onClick={exportarPDF}>
            <FiDownload />
            Exportar PDF
          </button>

          <button className="report-export-btn excel" onClick={exportarExcel}>
            <FiDownload />
            Exportar Excel
          </button>
        </div>
      </div>

      <div className="report-stats">
        <div className="premium-card">
          <div className="premium-icon">
            <FiDollarSign />
          </div>

          <div>
            <h3>Ingresos</h3>
            <h2>S/ {totalIngresos.toFixed(2)}</h2>
          </div>
        </div>

        <div className="premium-card">
          <div className="premium-icon">
            <FiUsers />
          </div>

          <div>
            <h3>Pagos</h3>
            <h2>{pagosFiltrados.length}</h2>
          </div>
        </div>

        <div className="premium-card">
          <div className="premium-icon">
            <FiCheckCircle />
          </div>

          <div>
            <h3>Pagados</h3>
            <h2>
              {
                pagosFiltrados.filter((p) => p.estado === 'PAGADO').length
              }
            </h2>
          </div>
        </div>
      </div>

      <div className="report-filter-card">
        <div className="report-filters">
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="PAGADO">Pagado</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="ANULADO">Anulado</option>
          </select>
        </div>
      </div>

      <div className="report-table-card">
        <div className="report-table-wrapper">
          <table className="report-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Monto</th>
                <th>Método</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>

            <tbody>
              {pagosFiltrados.map((p) => (
                <tr key={p.id_pago}>
                  <td>{p.cliente || 'Cliente'}</td>
                  <td>S/ {p.monto}</td>
                  <td>{p.metodo_pago}</td>
                  <td>{p.estado}</td>
                  <td>
                    {new Date(p.fecha_pago).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}