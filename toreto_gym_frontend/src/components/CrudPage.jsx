import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { FiEdit, FiTrash2, FiSave, FiXCircle, FiSearch, FiLogOut } from 'react-icons/fi';

const API_URL = 'http://localhost:3001/api';

export default function CrudPage({ title, endpoint, fields }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});
  const [editId, setEditId] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [optionsData, setOptionsData] = useState({});

  const columnasOcultas = [
    'id',
    'id_cliente',
    'id_usuario',
    'id_pago',
    'id_membresia',
    'id_cliente_membresia',
    'id_asistencia',
    'id_entrenador',
    'id_ejercicio',
    'id_rutina',
    'id_rutina_ejercicio',
    'id_progreso',
    'id_progreso_rutina',
    'id_notificacion',
    'id_rol',
    'created_at',
    'updated_at'
  ];

  const formatearTitulo = (texto) => {
    return texto
      .replaceAll('_', ' ')
      .replace(/\b\w/g, (letra) => letra.toUpperCase());
  };

  const getHeaders = () => {
    const token = localStorage.getItem('token');

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };
  };

  useEffect(() => {
    cargarDatos();
    prepararFormulario();
    cargarSelectsApi();
  }, [endpoint]);

  const prepararFormulario = () => {
    const inicial = {};

    fields.forEach((field) => {
      inicial[field.name] = field.defaultValue || '';
    });

    setForm(inicial);
  };

  const cargarDatos = async () => {
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        headers: getHeaders()
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire('Error', data.mensaje || 'Error al cargar datos', 'error');
        setItems([]);
        return;
      }

      setItems(Array.isArray(data) ? data : data.data || []);
    } catch {
      Swal.fire('Error', 'Error al cargar datos', 'error');
    }
  };

  const cargarSelectsApi = async () => {
    const selects = fields.filter((field) => field.type === 'select-api');

    for (const field of selects) {
      try {
        const res = await fetch(`${API_URL}${field.endpoint}`, {
          headers: getHeaders()
        });

        const data = await res.json();

        if (!res.ok) continue;

        setOptionsData((prev) => ({
          ...prev,
          [field.name]: Array.isArray(data) ? data : data.data || []
        }));
      } catch {
        console.error('Error cargando select:', field.name);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });
  };

  const guardar = async (e) => {
    e.preventDefault();

    try {
      const method = editId ? 'PUT' : 'POST';
      const url = editId
        ? `${API_URL}${endpoint}/${editId}`
        : `${API_URL}${endpoint}`;

      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire('Error', data.mensaje || 'Error en la petición', 'error');
        return;
      }

      Swal.fire(
        'Correcto',
        editId ? 'Registro actualizado correctamente' : 'Registro creado correctamente',
        'success'
      );

      setEditId(null);
      prepararFormulario();
      cargarDatos();
    } catch {
      Swal.fire('Error', 'Error en la petición', 'error');
    }
  };

  const editar = (item) => {
    const nuevoForm = {};

    fields.forEach((field) => {
      nuevoForm[field.name] = item[field.name] ?? '';
    });

    const idKey = Object.keys(item).find((key) => key.startsWith('id_')) || 'id';

    setEditId(item[idKey]);
    setForm(nuevoForm);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => {
    setEditId(null);
    prepararFormulario();
  };

  const eliminar = async (item) => {
    const confirmar = await Swal.fire({
      title: '¿Eliminar registro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b'
    });

    if (!confirmar.isConfirmed) return;

    const idKey = Object.keys(item).find((key) => key.startsWith('id_')) || 'id';

    try {
      const res = await fetch(`${API_URL}${endpoint}/${item[idKey]}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire('Error', data.mensaje || 'Error al eliminar', 'error');
        return;
      }

      Swal.fire('Eliminado', 'Registro eliminado correctamente', 'success');
      cargarDatos();
    } catch {
      Swal.fire('Error', 'Error al eliminar', 'error');
    }
  };

  const registrarSalida = async (item) => {
    try {
      const idKey = Object.keys(item).find((key) => key.startsWith('id_')) || 'id';

      const res = await fetch(`${API_URL}/asistencias/registrar-salida/${item[idKey]}`, {
        method: 'PUT',
        headers: getHeaders()
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire('Error', data.mensaje || 'Error al registrar salida', 'error');
        return;
      }

      Swal.fire('Correcto', 'Salida registrada correctamente', 'success');
      cargarDatos();
    } catch {
      Swal.fire('Error', 'Error al registrar salida', 'error');
    }
  };

  const obtenerLabelSelect = (field, option) => {
    if (Array.isArray(field.labelKey)) {
      return field.labelKey.map((key) => option[key]).join(' ');
    }

    return option[field.labelKey];
  };

  const formatearFecha = (value) => {
    if (!value) return '';

    const texto = String(value);

    return texto.includes('T') ? texto.split('T')[0] : texto;
  };

  const renderCelda = (key, value) => {
    if (key.includes('fecha') || key === 'created_at' || key === 'updated_at') {
      return formatearFecha(value);
    }

    if (key === 'estado') {
      return (
        <span className={`crud-badge ${String(value).toLowerCase()}`}>
          {String(value ?? '')}
        </span>
      );
    }

    return String(value ?? '');
  };

  const itemsFiltrados = items.filter((item) =>
    Object.values(item).some((value) =>
      String(value ?? '').toLowerCase().includes(busqueda.toLowerCase())
    )
  );

  const columnasVisibles = items[0]
    ? Object.keys(items[0]).filter((key) => !columnasOcultas.includes(key))
    : [];

  return (
    <div className="crud-page">
      <div className="crud-header">
        <div>
          <h1>{title}</h1>
          <p>Gestiona la información de {title.toLowerCase()} de TORETO GYM</p>
        </div>
      </div>

      <motion.form
        onSubmit={guardar}
        className="crud-form"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {fields.map((field) => (
          <div key={field.name} className="crud-field">
            <label>{field.label}</label>

            {field.type === 'select' ? (
              <select
                name={field.name}
                value={form[field.name] || ''}
                onChange={handleChange}
                required={field.required}
                title={field.title}
              >
                <option value="">Seleccione</option>

                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === 'select-api' ? (
              <select
                name={field.name}
                value={form[field.name] || ''}
                onChange={handleChange}
                required={field.required}
                title={field.title}
              >
                <option value="">Seleccione</option>

                {(optionsData[field.name] || []).map((option) => (
                  <option key={option[field.valueKey]} value={option[field.valueKey]}>
                    {obtenerLabelSelect(field, option)}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type || 'text'}
                name={field.name}
                value={form[field.name] || ''}
                onChange={handleChange}
                required={field.required}
                minLength={field.minLength}
                maxLength={field.maxLength}
                pattern={field.pattern}
                title={field.title}
                min={field.min}
                max={field.max}
                step={field.step}
              />
            )}
          </div>
        ))}

        <div className="crud-actions-form">
          <button type="submit" className="crud-save">
            <FiSave />
            {editId ? 'Actualizar' : 'Guardar'}
          </button>

          {editId && (
            <button type="button" className="crud-cancel" onClick={cancelarEdicion}>
              <FiXCircle />
              Cancelar
            </button>
          )}
        </div>
      </motion.form>

      <div className="crud-table-card">
        <div className="crud-table-top">
          <h3>Lista de registros</h3>

          <div className="crud-search">
            <FiSearch />
            <input
              type="text"
              placeholder="Buscar registro..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        <div className="crud-table-wrapper">
          <table className="crud-table">
            <thead>
              <tr>
                {columnasVisibles.map((key) => (
                  <th key={key}>{formatearTitulo(key)}</th>
                ))}

                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {itemsFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="20" className="crud-empty">
                    No hay registros disponibles
                  </td>
                </tr>
              ) : (
                itemsFiltrados.map((item, index) => (
                  <tr key={index}>
                    {columnasVisibles.map((key) => (
                      <td key={key}>{renderCelda(key, item[key])}</td>
                    ))}

                    <td>
                      <div className="crud-btn-group">
                        <button onClick={() => editar(item)} className="crud-edit">
                          <FiEdit />
                          Editar
                        </button>

                        <button onClick={() => eliminar(item)} className="crud-delete">
                          <FiTrash2 />
                          Eliminar
                        </button>

                        {endpoint === '/asistencias' && !item.hora_salida && (
                          <button onClick={() => registrarSalida(item)} className="crud-exit">
                            <FiLogOut />
                            Salida
                          </button>
                        )}
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