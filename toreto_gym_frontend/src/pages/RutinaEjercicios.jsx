import CrudPage from '../components/CrudPage';

export default function RutinaEjercicios() {
  return (
    <CrudPage
      title="Rutina Ejercicios"
      endpoint="/rutina-ejercicios"
      fields={[
        {
          name: 'id_rutina',
          label: 'Rutina',
          type: 'select-api',
          endpoint: '/rutinas',
          valueKey: 'id_rutina',
          labelKey: 'nombre_rutina',
          required: true
        },
        {
          name: 'id_ejercicio',
          label: 'Ejercicio',
          type: 'select-api',
          endpoint: '/ejercicios',
          valueKey: 'id_ejercicio',
          labelKey: 'nombre',
          required: true
        },
        {
          name: 'series',
          label: 'Series',
          type: 'number',
          required: true,
          min: 1
        },
        {
          name: 'repeticiones',
          label: 'Repeticiones',
          type: 'number',
          required: true,
          min: 1
        },
        {
          name: 'peso',
          label: 'Peso (kg)',
          type: 'number',
          required: false,
          min: 0,
          step: '0.01'
        },
        {
          name: 'descanso',
          label: 'Descanso (seg)',
          type: 'number',
          required: false,
          min: 0
        }
      ]}
    />
  );
}