import CrudPage from '../components/CrudPage';
export default function Entrenadores() {
  return <CrudPage title="Entrenadores" endpoint="/entrenadores" fields={[
    { name:'id_usuario', label:'ID Usuario', type:'number' },
    { name:'nombre', label:'Nombre', required:true },
    { name:'apellido', label:'Apellido', required:true },
    { name:'dni', label:'DNI', required:true },
    { name:'especialidad', label:'Especialidad' },
    { name:'telefono', label:'Teléfono' },
    { name:'correo', label:'Correo', type:'email' },
    { name:'estado', label:'Estado', type:'select', options:['ACTIVO','INACTIVO'], defaultValue:'ACTIVO' }
  ]} />;
}
