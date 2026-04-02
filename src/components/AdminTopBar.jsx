import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminTopBar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login');
    };

    const getInitials = (name) => {
        if (!name) return 'A';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <header className="sticky top-0 z-40 bg-[#FAF9FA]/80 backdrop-blur-md flex justify-between items-center px-8 h-20 shadow-[0_20px_40px_rgba(0,54,134,0.06)]">
            <div className="flex items-center gap-6 flex-1">
                <div className="relative w-full max-w-md group">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                        search
                    </span>
                    <input
                        className="w-full bg-[#e3e2e3] border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-[#094cb2] transition-shadow outline-none"
                        placeholder="Tìm kiếm tài nguyên, học viên hoặc giáo viên..."
                        type="text"
                    />
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                    <button className="text-slate-500 hover:text-[#094cb2] transition-all relative">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-0 right-0 w-2 h-2 bg-[#ba1a1a] rounded-full border-2 border-white"></span>
                    </button>
                </div>
                <div className="h-8 w-px bg-[#eeedee]"></div>
                <button className="text-[#003686] font-semibold text-sm hover:underline">Hỗ trợ</button>
                <div className="flex items-center gap-3 pl-2">
                    <div className="w-10 h-10 rounded-full bg-[#094cb2] text-white flex items-center justify-center text-sm font-bold">
                        {getInitials(user?.name)}
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="text-slate-500 hover:text-[#ba1a1a] transition-colors ml-2"
                    title="Đăng xuất"
                >
                    <span className="material-symbols-outlined">logout</span>
                </button>
            </div>
        </header>
    );
}