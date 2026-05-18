import CrudPage from '../components/CrudPage';

export default function ClienteMembresias() {
  return (
    <CrudPage
      title="Membresías de Clientes"
      endpoint="/cliente-membresias"
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
        {
          name: 'id_membresia',
          label: 'Plan de Membresía',
          type: 'select-api',
          endpoint: '/membresias',
          valueKey: 'id_membresia',
          labelKey: 'nombre',
          required: true
        },
        {
          name: 'fecha_inicio',
          label: 'Fecha de inicio',
          type: 'date',
          required: true
        },
        {
          name: 'fecha_fin',
          label: 'Fecha de vencimiento',
          type: 'date',
          required: true
        },
        {
          name: 'estado',
          label: 'Estado',
          type: 'select',
          options: ['ACTIVO', 'VENCIDO', 'SUSPENDIDO', 'CANCELADO'],
          defaultValue: 'ACTIVO'
        }
      ]}
    />
  );
}