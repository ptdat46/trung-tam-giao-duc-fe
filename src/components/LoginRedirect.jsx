import { Outlet, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ROLE_DASHBOARD_MAP = {
    admin: '/admin/dashboard',
    teacher: '/teacher/dashboard',
    student: '/student/dashboard',
};

export default function LoginRedirect() {
    const token = Cookies.get('authToken');
    const role = Cookies.get('authRole');

    if (token && role && ROLE_DASHBOARD_MAP[role]) {
        return <Navigate to={ROLE_DASHBOARD_MAP[role]} replace />;
    }

    return <Outlet />;
}
