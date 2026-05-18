import CrudPage from '../components/CrudPage';

export default function Clientes() {
  return (
    <CrudPage
      title="Clientes"
      endpoint="/clientes"
      fields={[
        { name: 'nombre', label: 'Nombre', required: true, minLength: 2 },
        { name: 'apellido', label: 'Apellido', required: true, minLength: 2 },
        {
          name: 'dni',
          label: 'DNI',
          required: true,
          pattern: '[0-9]{8}',
          maxLength: 8,
          minLength: 8,
          title: 'El DNI debe tener exactamente 8 números'
        },
        {
          name: 'telefono',
          label: 'Teléfono',
          pattern: '[0-9]{9}',
          maxLength: 9,
          minLength: 9,
          title: 'El teléfono debe tener exactamente 9 números'
        },
        { name: 'correo', label: 'Correo', type: 'email' },
        { name: 'direccion', label: 'Dirección' },
        {
          name: 'estado',
          label: 'Estado',
          type: 'select',
          options: ['ACTIVO', 'INACTIVO'],
          defaultValue: 'ACTIVO'
        }
      ]}
    />
  );
}