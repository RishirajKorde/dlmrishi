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
import Login from './pages/Login';
import Profile from './pages/Profile';
import Fines from './pages/Fines';


const AppRoutes = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
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
      <Route path="/membership-type" element={<MembershipType />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/fines" element={<Fines />} />



      <Route path="*" element={<div className="p-8 text-center">404 - Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
