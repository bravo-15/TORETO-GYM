import CrudPage from '../components/CrudPage';
export default function Roles() {
  return <CrudPage title="Roles" endpoint="/roles" fields={[
    { name:'nombre', label:'Nombre', required:true },
    { name:'descripcion', label:'Descripción' },
    { name:'estado', label:'Estado', type:'select', options:['ACTIVO','INACTIVO'], defaultValue:'ACTIVO' }
  ]} />;
}
