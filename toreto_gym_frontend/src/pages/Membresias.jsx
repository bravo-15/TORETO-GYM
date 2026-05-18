import CrudPage from '../components/CrudPage';
export default function Membresias() {
  return <CrudPage title="Membresías" endpoint="/membresias" fields={[
    { name:'nombre', label:'Nombre', required:true },
    { name:'descripcion', label:'Descripción' },
    { name:'precio', label:'Precio', type:'number', required:true },
    { name:'duracion_dias', label:'Duración en días', type:'number', required:true },
    { name:'estado', label:'Estado', type:'select', options:['ACTIVO','INACTIVO'], defaultValue:'ACTIVO' }
  ]} />;
}
