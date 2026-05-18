import CrudPage from '../components/CrudPage';
export default function Rutinas() {
  return <CrudPage title="Rutinas" endpoint="/rutinas" fields={[
    { name:'id_cliente', label:'ID Cliente', type:'number', required:true },
    { name:'id_entrenador', label:'ID Entrenador', type:'number' },
    { name:'nombre_rutina', label:'Nombre rutina', required:true },
    { name:'fecha_inicio', label:'Fecha inicio', type:'date' },
    { name:'estado', label:'Estado', type:'select', options:['ACTIVA','FINALIZADA'], defaultValue:'ACTIVA' }
  ]} />;
}
