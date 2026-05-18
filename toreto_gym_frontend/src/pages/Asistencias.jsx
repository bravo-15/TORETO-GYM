import CrudPage from '../components/CrudPage';

export default function Asistencias() {
  return (
    <CrudPage
      title="Asistencias"
      endpoint="/asistencias"
      fields={[
        {
          name: 'id_cliente',
          label: 'Cliente',
          type: 'select-api',
          endpoint: '/clientes',
          valueKey: 'id_cliente',
          labelKey: ['nombre', 'apellido'],
          required: true
        },
        { name: 'fecha', label: 'Fecha', type: 'date' },
        { name: 'hora_ingreso', label: 'Hora ingreso', type: 'time' },
        { name: 'hora_salida', label: 'Hora salida', type: 'time' }
      ]}
    />
  );
}