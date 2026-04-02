import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

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
            navigate('/student/login', { replace: true });
            return;
        }

        const dashboardPath = ROLE_DASHBOARD_MAP[role];
        if (dashboardPath) {
            navigate(dashboardPath, { replace: true });
        } else {
            Cookies.remove('authToken');
            Cookies.remove('authRole');
            navigate('/student/login', { replace: true });
        }
    }, [navigate]);

    return null;
}