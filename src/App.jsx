import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AdminLoginPage from './pages/AdminLoginPage';
import TeacherLoginPage from './pages/TeacherLoginPage';
import StudentLoginPage from './pages/StudentLoginPage';
import RootRedirect from './components/RootRedirect';
import LoginRedirect from './components/LoginRedirect';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />

          <Route path="/login" element={<LoginRedirect />}>
            <Route index element={<StudentLoginPage />} />
            <Route path="admin" element={<AdminLoginPage />} />
            <Route path="teacher" element={<TeacherLoginPage />} />
            <Route path="student" element={<StudentLoginPage />} />
          </Route>

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
