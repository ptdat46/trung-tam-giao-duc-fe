import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const getInitials = (name) => {
    if (!name) return 'GV';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const AVATAR_COLORS = [
    'bg-[#094cb2] text-white',
    'bg-[#c1d1ff] text-[#003686]',
    'bg-[#003686]/10 text-[#003686]',
    'bg-[#6c2400]/10 text-[#6c2400]',
    'bg-[#4e5d86]/10 text-[#4e5d86]',
];

export default function AdminTeacherTable({ teachers, meta, loading, page, onPageChange, onDelete }) {
    const [deleteLoading, setDeleteLoading] = useState(null);
    const navigate = useNavigate();

    const handleDelete = async (id) => {
        setDeleteLoading(id);
        await onDelete(id);
        setDeleteLoading(null);
    };

    const handleView = (id) => {
        navigate(`/admin/teachers/${id}`);
    };

    const handleEdit = (id) => {
        navigate(`/admin/teachers/${id}`);
    };

    const total = meta?.total ?? teachers.length;
    const totalPages = meta?.last_page ?? 1;
    const from = meta ? (meta.current_page - 1) * meta.per_page + 1 : 1;
    const to = meta ? Math.min(meta.current_page * meta.per_page, meta.total) : teachers.length;

    const pages = [];
    if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        pages.push(1);
        if (page > 3) pages.push('...');
        for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
        if (page < totalPages - 2) pages.push('...');
        pages.push(totalPages);
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <span className="material-symbols-outlined text-4xl text-[#003686] animate-spin">progress_activity</span>
            </div>
        );
    }

    return (
        <div className="bg-[#ffffff] rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(0,54,134,0.03)] border border-transparent">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#f4f3f4]/50">
                            <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#737784] font-bold">Giáo viên</th>
                            <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#737784] font-bold">Liên hệ</th>
                            <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#737784] font-bold text-center">Trạng thái</th>
                            <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#737784] font-bold text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f4f3f4]">
                        {teachers.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-[#434653] text-sm">
                                    Không có giáo viên nào
                                </td>
                            </tr>
                        ) : teachers.map((teacher, idx) => {
                            const colorIdx = idx % AVATAR_COLORS.length;
                            const isActive = teacher.status === 1;

                            return (
                                <tr key={teacher.id} className="group hover:bg-[#f4f3f4]/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold ${AVATAR_COLORS[colorIdx]}`}>
                                                {getInitials(teacher.name)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#1a1c1d]">{teacher.name}</p>
                                                <p className="text-xs text-[#003686] font-medium">ID: #{teacher.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-[#1a1c1d]">{teacher.email}</p>
                                        <p className="text-xs text-[#737784]">{teacher.phone || '—'}</p>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold gap-1.5 ${
                                            isActive ? 'bg-green-100 text-green-700' : 'bg-[#e3e2e3] text-[#434653]'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-[#737784]'}`}></span>
                                            {isActive ? 'HOẠT ĐỘNG' : 'KHÔNG HOẠT ĐỘNG'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-3">
                                            <button
                                                className="text-[#737784] hover:text-[#003686] transition-colors"
                                                title="Xem chi tiết"
                                                onClick={() => handleView(teacher.id)}
                                            >
                                                <span className="material-symbols-outlined text-lg">visibility</span>
                                            </button>
                                            <button
                                                className="text-[#737784] hover:text-[#003686] transition-colors"
                                                title="Chỉnh sửa"
                                                onClick={() => handleEdit(teacher.id)}
                                            >
                                                <span className="material-symbols-outlined text-lg">edit</span>
                                            </button>
                                            <button
                                                className="text-[#737784] hover:text-[#ba1a1a] transition-colors disabled:opacity-50"
                                                title="Xóa"
                                                onClick={() => handleDelete(teacher.id)}
                                                disabled={deleteLoading === teacher.id}
                                            >
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="px-8 py-6 bg-[#f4f3f4]/30 border-t border-[#e9e8e9] flex justify-between items-center">
                <p className="text-sm text-[#434653]">
                    Hiển thị {from}–{to} trong tổng số {total} giáo viên
                </p>
                <div className="flex items-center gap-2">
                    <button
                        className="flex items-center gap-2 text-sm font-bold text-[#737784] hover:text-[#003686] transition-colors disabled:opacity-50"
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 1}
                    >
                        <span className="material-symbols-outlined text-lg">chevron_left</span>
                        TRƯỚC
                    </button>
                    <div className="flex gap-2">
                        {pages.map((p, i) => (
                            p === '...' ? (
                                <span key={`ellipsis-${i}`} className="flex items-center px-2 text-[#737784]">...</span>
                            ) : (
                                <button
                                    key={p}
                                    onClick={() => onPageChange(p)}
                                    className={`w-10 h-10 rounded-lg text-sm font-bold transition-colors ${
                                        p === page
                                            ? 'bg-[#003686] text-white shadow-md shadow-[#003686]/20'
                                            : 'text-[#434653] hover:bg-[#e9e8e9]'
                                    }`}
                                >
                                    {p}
                                </button>
                            )
                        ))}
                    </div>
                    <button
                        className="flex items-center gap-2 text-sm font-bold text-[#003686] hover:text-[#094cb2] transition-colors disabled:opacity-50"
                        onClick={() => onPageChange(page + 1)}
                        disabled={page === totalPages}
                    >
                        SAU
                        <span className="material-symbols-outlined text-lg">chevron_right</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
