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
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/catalogue" element={<Catalogue />} />
      <Route path="/members" element={<Members />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/library" element={<DigitalLibrary />} />
      <Route path="/search" element={<SearchPortal />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/roles" element={<Roles />} />
      <Route path="/permissions" element={<Permissions />} />
      <Route path="/branch" element={<Branch />} />
      <Route path="/users" element={<Users />} />
      <Route path="/Categories" element={<Categories />} />
      <Route path="/Subjects" element={<Subjects />} />


      <Route path="*" element={<div className="p-8 text-center">404 - Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
