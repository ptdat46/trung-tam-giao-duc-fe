import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginRedirect from './components/LoginRedirect';
import LoginGuard from './components/LoginGuard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import AdminTeachersPage from './pages/AdminTeachersPage';
import AdminCoursesPage from './pages/AdminCoursesPage';
import AdminTeacherDetailPage from './pages/AdminTeacherDetailPage';
import AdminCourseDetailPage from './pages/AdminCourseDetailPage';
import AdminLayout from './components/AdminLayout';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import AdminLoginPage from './pages/AdminLoginPage';
import TeacherLoginPage from './pages/TeacherLoginPage';
import StudentLoginPage from './pages/StudentLoginPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginRedirect />} />

          <Route path="/student/login" element={<LoginGuard><StudentLoginPage /></LoginGuard>} />
          <Route path="/admin/login" element={<LoginGuard><AdminLoginPage /></LoginGuard>} />
          <Route path="/teacher/login" element={<LoginGuard><TeacherLoginPage /></LoginGuard>} />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout activeItem="Tổng quan">
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout activeItem="Khóa học">
                  <AdminCoursesPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses/:id"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout activeItem="Khóa học">
                  <AdminCourseDetailPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/teachers"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout activeItem="Giáo viên">
                  <AdminTeachersPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/teachers/:id"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout activeItem="Giáo viên">
                  <AdminTeacherDetailPage />
                </AdminLayout>
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