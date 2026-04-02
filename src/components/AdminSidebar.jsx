import { NavLink } from 'react-router-dom';

const navItems = [
    { name: 'Tổng quan', path: '/admin/dashboard', icon: 'dashboard' },
    { name: 'Khóa học', path: '/admin/courses', icon: 'school' },
    { name: 'Giáo viên', path: '/admin/teachers', icon: 'person_4' },
    { name: 'Học viên', path: '/admin/students', icon: 'group' },
    { name: 'Tài chính', path: '/admin/finance', icon: 'payments' },
];

export default function AdminSidebar({ activeItem = 'Tổng quan' }) {
    return (
        <aside className="h-screen w-64 fixed left-0 top-0 border-r border-[#E9E8E9] bg-[#F4F3F4] flex flex-col py-6 z-50">
            <div className="px-8 mb-10">
                <h1 className="font-serif text-xl font-bold text-[#003686]">Trung tâm Giáo dục Nam Thái</h1>
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500 mt-1">Bảng điều khiển</p>
            </div>
            <nav className="flex-1 flex flex-col gap-1">
                {navItems.map((item) => {
                    const isActive = activeItem === item.name;
                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={`relative flex items-center gap-3 px-8 py-3 text-sm font-medium transition-colors ${
                                isActive
                                    ? 'text-[#003686] font-semibold bg-white rounded-l-full ml-4 shadow-sm translate-x-1'
                                    : 'text-slate-600 hover:bg-white/50'
                            }`}
                        >
                            {isActive && (
                                <span className="absolute left-0 top-0 h-full w-1 bg-[#003686] rounded-r" />
                            )}
                            <span className="material-symbols-outlined text-xl">{item.icon}</span>
                            <span className="text-xs font-medium uppercase tracking-wider">{item.name}</span>
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
}