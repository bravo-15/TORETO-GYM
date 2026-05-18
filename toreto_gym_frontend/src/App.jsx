import { Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout';
import LayoutDashboard from './components/LayoutDashboard';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Membresias from './pages/Membresias';
import ClienteMembresias from './pages/ClienteMembresias';
import Pagos from './pages/Pagos';
import Asistencias from './pages/Asistencias';
import Entrenadores from './pages/Entrenadores';
import Ejercicios from './pages/Ejercicios';
import Rutinas from './pages/Rutinas';
import RutinaEjercicios from './pages/RutinaEjercicios';
import ProgresoRutinas from './pages/ProgresoRutinas';
import Notificaciones from './pages/Notificaciones';
import Usuarios from './pages/Usuarios';
import Roles from './pages/Roles';
import Reportes from './pages/Reportes';

export default function App() {
  return (
    <Routes>
      {/* PUBLICO */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
      </Route>

      {/* PANEL ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <LayoutDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* DASHBOARD */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute roles={['ADMINISTRADOR', 'RECEPCIONISTA']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* CLIENTES */}
        <Route
          path="clientes"
          element={
            <ProtectedRoute roles={['ADMINISTRADOR', 'RECEPCIONISTA']}>
              <Clientes />
            </ProtectedRoute>
          }
        />

        {/* MEMBRESIAS */}
        <Route
          path="membresias"
          element={
            <ProtectedRoute roles={['ADMINISTRADOR', 'RECEPCIONISTA']}>
              <Membresias />
            </ProtectedRoute>
          }
        />

        {/* CLIENTE MEMBRESIAS */}
        <Route
          path="cliente-membresias"
          element={
            <ProtectedRoute roles={['ADMINISTRADOR', 'RECEPCIONISTA']}>
              <ClienteMembresias />
            </ProtectedRoute>
          }
        />

        {/* PAGOS */}
        <Route
          path="pagos"
          element={
            <ProtectedRoute roles={['ADMINISTRADOR', 'RECEPCIONISTA']}>
              <Pagos />
            </ProtectedRoute>
          }
        />

        {/* REPORTES */}
        <Route
          path="reportes"
          element={
            <ProtectedRoute roles={['ADMINISTRADOR']}>
              <Reportes />
            </ProtectedRoute>
          }
        />

        {/* ASISTENCIAS */}
        <Route
          path="asistencias"
          element={
            <ProtectedRoute roles={['ADMINISTRADOR', 'RECEPCIONISTA']}>
              <Asistencias />
            </ProtectedRoute>
          }
        />

        {/* ENTRENADORES */}
        <Route
          path="entrenadores"
          element={
            <ProtectedRoute roles={['ADMINISTRADOR']}>
              <Entrenadores />
            </ProtectedRoute>
          }
        />

        {/* EJERCICIOS */}
        <Route
          path="ejercicios"
          element={
            <ProtectedRoute roles={['ADMINISTRADOR', 'ENTRENADOR']}>
              <Ejercicios />
            </ProtectedRoute>
          }
        />

        {/* RUTINAS */}
        <Route
          path="rutinas"
          element={
            <ProtectedRoute roles={['ADMINISTRADOR', 'ENTRENADOR']}>
              <Rutinas />
            </ProtectedRoute>
          }
        />

        {/* RUTINA EJERCICIOS */}
        <Route
          path="rutina-ejercicios"
          element={
            <ProtectedRoute roles={['ADMINISTRADOR', 'ENTRENADOR']}>
              <RutinaEjercicios />
            </ProtectedRoute>
          }
        />

        {/* PROGRESO */}
        <Route
          path="progreso-rutinas"
          element={
            <ProtectedRoute roles={['ADMINISTRADOR', 'ENTRENADOR']}>
              <ProgresoRutinas />
            </ProtectedRoute>
          }
        />

        {/* NOTIFICACIONES */}
        <Route
          path="notificaciones"
          element={
            <ProtectedRoute roles={['ADMINISTRADOR', 'RECEPCIONISTA', 'CLIENTE']}>
              <Notificaciones />
            </ProtectedRoute>
          }
        />

        {/* USUARIOS */}
        <Route
          path="usuarios"
          element={
            <ProtectedRoute roles={['ADMINISTRADOR']}>
              <Usuarios />
            </ProtectedRoute>
          }
        />

        {/* ROLES */}
        <Route
          path="roles"
          element={
            <ProtectedRoute roles={['ADMINISTRADOR']}>
              <Roles />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}