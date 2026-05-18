import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import { FiEdit, FiTrash2, FiSave, FiSearch, FiFileText } from 'react-icons/fi';

const API_URL = 'http://localhost:3001/api';

export default function Pagos() {
  const [pagos, setPagos] = useState([]);
  const [clienteMembresias, setClienteMembresias] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    id_cliente_membresia: '',
    monto: '',
    metodo_pago: '',
    estado: 'PAGADO'
  });

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };
  };

  useEffect(() => {
    cargarPagos();
    cargarClienteMembresias();
  }, []);

  const cargarPagos = async () => {
    const res = await fetch(`${API_URL}/pagos`, { headers: getHeaders() });
    const data = await res.json();
    setPagos(Array.isArray(data) ? data : []);
  };

  const cargarClienteMembresias = async () => {
    const res = await fetch(`${API_URL}/cliente-membresias`, { headers: getHeaders() });
    const data = await res.json();
    setClienteMembresias(Array.isArray(data) ? data : []);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardar = async (e) => {
    e.preventDefault();

    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${API_URL}/pagos/${editId}` : `${API_URL}/pagos`;

    const res = await fetch(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (!res.ok) {
      Swal.fire('Error', data.mensaje || 'Error al guardar pago', 'error');
      return;
    }

    Swal.fire('Correcto', editId ? 'Pago actualizado' : 'Pago registrado', 'success');

    setEditId(null);
    setForm({
      id_cliente_membresia: '',
      monto: '',
      metodo_pago: '',
      estado: 'PAGADO'
    });

    cargarPagos();
  };

  const editar = (pago) => {
    setEditId(pago.id_pago);

    setForm({
      id_cliente_membresia: pago.id_cliente_membresia || '',
      monto: pago.monto || '',
      metodo_pago: pago.metodo_pago || '',
      estado: pago.estado || 'PAGADO'
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const eliminar = async (id) => {
    const confirmar = await Swal.fire({
      title: '¿Eliminar pago?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444'
    });

    if (!confirmar.isConfirmed) return;

    const res = await fetch(`${API_URL}/pagos/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });

    if (!res.ok) {
      Swal.fire('Error', 'No se pudo eliminar el pago', 'error');
      return;
    }

    Swal.fire('Eliminado', 'Pago eliminado correctamente', 'success');
    cargarPagos();
  };

  const generarBoleta = (pago) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('TORETO GYM', 80, 20);

    doc.setFontSize(12);
    doc.text('BOLETA DE PAGO', 82, 30);

    doc.line(20, 36, 190, 36);

    doc.text(`Cliente: ${pago.cliente}`, 20, 50);
    doc.text(`Membresía: ${pago.membresia}`, 20, 60);
    doc.text(`Monto: S/ ${Number(pago.monto || 0).toFixed(2)}`, 20, 70);
    doc.text(`Método de pago: ${pago.metodo_pago}`, 20, 80);
    doc.text(`Estado: ${pago.estado}`, 20, 90);
    doc.text(`Fecha: ${formatearFecha(pago.fecha_pago)}`, 20, 100);

    doc.line(20, 110, 190, 110);

    doc.text('Gracias por su preferencia.', 20, 125);
    doc.text('TORETO GYM - Sistema de Gestión Fitness', 20, 135);

    doc.save(`boleta-${pago.cliente}.pdf`);
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    return String(fecha).includes('T') ? String(fecha).split('T')[0] : fecha;
  };

  const pagosFiltrados = pagos.filter((p) =>
    Object.values(p).some((value) =>
      String(value ?? '').toLowerCase().includes(busqueda.toLowerCase())
    )
  );

  return (
    <div className="crud-page">
      <div className="crud-header">
        <h1>Pagos</h1>
        <p>Gestiona pagos y genera boletas para TORETO GYM</p>
      </div>

      <form onSubmit={guardar} className="crud-form">
        <div className="crud-field">
          <label>Cliente / Membresía</label>
          <select
            name="id_cliente_membresia"
            value={form.id_cliente_membresia}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione</option>
            {clienteMembresias.map((cm) => (
              <option key={cm.id_cliente_membresia} value={cm.id_cliente_membresia}>
                {cm.cliente} - {cm.membresia}
              </option>
            ))}
          </select>
        </div>

        <div className="crud-field">
          <label>Monto</label>
          <input
            type="number"
            name="monto"
            value={form.monto}
            onChange={handleChange}
            required
          />
        </div>

        <div className="crud-field">
          <label>Método de pago</label>
          <select
            name="metodo_pago"
            value={form.metodo_pago}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione</option>
            <option value="EFECTIVO">EFECTIVO</option>
            <option value="YAPE">YAPE</option>
            <option value="PLIN">PLIN</option>
            <option value="TRANSFERENCIA">TRANSFERENCIA</option>
            <option value="TARJETA">TARJETA</option>
          </select>
        </div>

        <div className="crud-field">
          <label>Estado</label>
          <select name="estado" value={form.estado} onChange={handleChange}>
            <option value="PAGADO">PAGADO</option>
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="ANULADO">ANULADO</option>
          </select>
        </div>

        <div className="crud-actions-form">
          <button type="submit" className="crud-save">
            <FiSave />
            {editId ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </form>

      <div className="crud-table-card">
        <div className="crud-table-top">
          <h3>Lista de pagos</h3>

          <div className="crud-search">
            <FiSearch />
            <input
              type="text"
              placeholder="Buscar pago..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        <div className="crud-table-wrapper">
          <table className="crud-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Membresía</th>
                <th>Monto</th>
                <th>Fecha</th>
                <th>Método</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {pagosFiltrados.map((pago) => (
                <tr key={pago.id_pago}>
                  <td>{pago.cliente}</td>
                  <td>{pago.membresia}</td>
                  <td>S/ {Number(pago.monto || 0).toFixed(2)}</td>
                  <td>{formatearFecha(pago.fecha_pago)}</td>
                  <td>{pago.metodo_pago}</td>
                  <td>
                    <span className={`crud-badge ${String(pago.estado).toLowerCase()}`}>
                      {pago.estado}
                    </span>
                  </td>
                  <td>
                    <div className="crud-btn-group">
                      <button className="crud-edit" onClick={() => editar(pago)}>
                        <FiEdit />
                        Editar
                      </button>

                      <button className="crud-delete" onClick={() => eliminar(pago.id_pago)}>
                        <FiTrash2 />
                        Eliminar
                      </button>

                      <button className="boleta-btn" onClick={() => generarBoleta(pago)}>
                        <FiFileText />
                        Boleta
                      </button>
                    </div>
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