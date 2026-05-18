import CrudPage from '../components/CrudPage';
export default function Ejercicios() {
  return <CrudPage title="Ejercicios" endpoint="/ejercicios" fields={[
    { name:'nombre', label:'Nombre', required:true },
    { name:'descripcion', label:'Descripción' },
    { name:'grupo_muscular', label:'Grupo muscular', required:true }
  ]} />;
}
