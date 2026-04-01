import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AdminLoginPage from './pages/AdminLoginPage';
import TeacherLoginPage from './pages/TeacherLoginPage';
import StudentLoginPage from './pages/StudentLoginPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login/admin" element={<AdminLoginPage />} />
          <Route path="/login/teacher" element={<TeacherLoginPage />} />
          <Route path="/login/student" element={<StudentLoginPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
