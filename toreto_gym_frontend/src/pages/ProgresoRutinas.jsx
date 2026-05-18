import CrudPage from '../components/CrudPage';
export default function ProgresoRutinas() {
  return <CrudPage title="Progreso de Rutinas" endpoint="/progreso-rutinas" fields={[
    { name:'id_rutina_ejercicio', label:'ID Rutina Ejercicio', type:'number', required:true },
    { name:'id_cliente', label:'ID Cliente', type:'number', required:true },
    { name:'fecha', label:'Fecha', type:'date' },
    { name:'completado', label:'Completado', type:'select', options:['0','1'], defaultValue:'0' }
  ]} />;
}
