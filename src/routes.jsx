import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Catalogue from './pages/Catalogue';
import Members from './pages/Members';
import Transactions from './pages/Transactions';
import DigitalLibrary from './pages/DigitalLibrary';
import SearchPortal from './pages/SearchPortal';
import Reports from './pages/Reports';
import Roles from './pages/Roles';
import Permissions from './pages/Permissions';
import Branch from './pages/Master/Branch';
import Users from './pages/Master/Users';
import Categories from './pages/Master/Categories';
import Subjects from './pages/Master/Subjects';
import MembershipType from './pages/Master/MembershipType';
import Language from './pages/Master/Language';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Fines from './pages/Fines';


const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const role = localStorage.getItem('role')?.toUpperCase();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />

      {/* Shared Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/catalogue" element={<ProtectedRoute><Catalogue /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/search" element={<SearchPortal />} />

      {/* Operational Routes */}
      <Route path="/members" element={<ProtectedRoute allowedRoles={['SUPERADMIN', 'SUPER_ADMIN', 'LIBRARIAN', 'LIBRARIAN_ADMIN']}><Members /></ProtectedRoute>} />
      <Route path="/transactions" element={<ProtectedRoute allowedRoles={['SUPERADMIN', 'SUPER_ADMIN', 'LIBRARIAN', 'LIBRARIAN_ADMIN']}><Transactions /></ProtectedRoute>} />
      <Route path="/fines" element={<ProtectedRoute allowedRoles={['SUPERADMIN', 'SUPER_ADMIN', 'LIBRARIAN', 'LIBRARIAN_ADMIN']}><Fines /></ProtectedRoute>} />
      <Route path="/library" element={<ProtectedRoute allowedRoles={['SUPERADMIN', 'SUPER_ADMIN', 'LIBRARIAN', 'LIBRARIAN_ADMIN']}><DigitalLibrary /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute allowedRoles={['SUPERADMIN', 'SUPER_ADMIN', 'LIBRARIAN', 'LIBRARIAN_ADMIN']}><Reports /></ProtectedRoute>} />

      {/* Master Routes */}
      <Route path="/roles" element={<ProtectedRoute allowedRoles={['SUPERADMIN', 'SUPER_ADMIN']}><Roles /></ProtectedRoute>} />
      <Route path="/permissions" element={<ProtectedRoute allowedRoles={['SUPERADMIN', 'SUPER_ADMIN']}><Permissions /></ProtectedRoute>} />
      <Route path="/branch" element={<ProtectedRoute allowedRoles={['SUPERADMIN', 'SUPER_ADMIN']}><Branch /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute allowedRoles={['SUPERADMIN', 'SUPER_ADMIN']}><Users /></ProtectedRoute>} />
      <Route path="/Categories" element={<ProtectedRoute allowedRoles={['SUPERADMIN', 'SUPER_ADMIN']}><Categories /></ProtectedRoute>} />
      <Route path="/Subjects" element={<ProtectedRoute allowedRoles={['SUPERADMIN', 'SUPER_ADMIN']}><Subjects /></ProtectedRoute>} />
      <Route path="/membership-type" element={<ProtectedRoute allowedRoles={['SUPERADMIN', 'SUPER_ADMIN']}><MembershipType /></ProtectedRoute>} />
      <Route path="/Language" element={<ProtectedRoute allowedRoles={['SUPERADMIN', 'SUPER_ADMIN']}><Language /></ProtectedRoute>} />

      <Route path="*" element={<div className="p-8 text-center">404 - Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
