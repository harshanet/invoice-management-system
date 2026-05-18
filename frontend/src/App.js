import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SidebarLayout from './components/SidebarLayout';
import AdminLayout from './components/AdminLayout';
import AdminRoute from './components/AdminRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';
import Resources from './pages/Resources';
import ResourceDetail from './pages/ResourceDetail';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminResources from './pages/admin/AdminResources';
import CreateResource from './pages/admin/CreateResource';
import EditResource from './pages/admin/EditResource';
import AdminCategories from './pages/admin/AdminCategories';
import CreateCategory from './pages/admin/CreateCategory';
import EditCategory from './pages/admin/EditCategory';
import AdminUsers from './pages/admin/AdminUsers';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin routes — protected */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/resources" element={<AdminResources />} />
          <Route path="/admin/resources/new" element={<CreateResource />} />
          <Route path="/admin/resources/:id/edit" element={<EditResource />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/categories/new" element={<CreateCategory />} />
          <Route path="/admin/categories/:id/edit" element={<EditCategory />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          </Route>
        </Route>

        {/* User routes */}
        <Route element={<SidebarLayout />}>
          <Route path="/" element={<Navigate to="/resources" replace />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/:id" element={<ResourceDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tasks" element={<Tasks />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
