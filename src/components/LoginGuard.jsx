import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_DASHBOARD_MAP = {
    admin: '/admin/dashboard',
    teacher: '/teacher/dashboard',
    student: '/student/dashboard',
};

export default function LoginGuard({ children }) {
    const { isAuthenticated, role, loading } = useAuth();

    if (loading) return null;

    if (isAuthenticated && role && ROLE_DASHBOARD_MAP[role]) {
        return <Navigate to={ROLE_DASHBOARD_MAP[role]} replace />;
    }

    return children;
}