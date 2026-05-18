import CrudPage from '../components/CrudPage';
export default function Usuarios() {
  return <CrudPage title="Usuarios" endpoint="/usuarios" fields={[
    { name:'id_rol', label:'ID Rol', type:'number', required:true },
    { name:'nombre', label:'Nombre', required:true },
    { name:'apellido', label:'Apellido', required:true },
    { name:'dni', label:'DNI', required:true },
    { name:'telefono', label:'Teléfono' },
    { name:'correo', label:'Correo', type:'email', required:true },
    { name:'password', label:'Contraseña', type:'password', required:true },
    { name:'estado', label:'Estado', type:'select', options:['ACTIVO','INACTIVO'], defaultValue:'ACTIVO' }
  ]} />;
}
