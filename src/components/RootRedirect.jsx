import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

const ROLE_DASHBOARD_MAP = {
    admin: '/admin/dashboard',
    teacher: '/teacher/dashboard',
    student: '/student/dashboard',
};

export default function RootRedirect() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('authToken');
        const role = Cookies.get('authRole');

        if (!token || !role) {
            navigate('/login', { replace: true });
            return;
        }

        const dashboardPath = ROLE_DASHBOARD_MAP[role];
        if (dashboardPath) {
            navigate(dashboardPath, { replace: true });
        } else {
            // Fallback: xóa cookie không hợp lệ và về login
            Cookies.remove('authToken');
            Cookies.remove('authRole');
            navigate('/login', { replace: true });
        }
    }, [navigate]);

    return null;
}
