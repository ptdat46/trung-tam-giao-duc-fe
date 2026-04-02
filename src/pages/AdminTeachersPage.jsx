import { useState, useEffect } from 'react';
import AdminTeacherTable from '../components/AdminTeacherTable';
import AdminAddTeacherModal from '../components/AdminAddTeacherModal';
import api from '../utils/api';

export default function AdminTeachersPage() {
    const [teachers, setTeachers] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);

    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, per_page: 10 });
            const res = await api.get(`/admin/teachers?${params}`);
            setTeachers(res.data.data || []);
            setMeta(res.data.meta);
        } catch (err) {
            console.error('Lỗi khi tải danh sách giáo viên', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, [page]);

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa giáo viên này?')) return;
        try {
            await api.delete(`/admin/teachers/${id}`);
            fetchTeachers();
        } catch (err) {
            console.error('Lỗi khi xóa giáo viên', err);
        }
    };

    return (
        <div className="px-8 pt-8 pb-12">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <nav className="flex text-[10px] uppercase tracking-[0.1em] text-[#737784] mb-2 font-medium">
                        <span>Admin</span>
                        <span className="mx-2">/</span>
                        <span className="text-[#003686] font-bold">Giáo viên</span>
                    </nav>
                    <h2 className="text-4xl font-serif font-bold text-[#003686]">Quản lý giáo viên</h2>
                    <p className="text-[#434653] mt-2 text-sm max-w-xl">
                        Theo dõi giáo viên, quản lý thông tin và giám sát phân công lớp học qua bảng điều khiển trung tâm.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-[#ffffff] text-[#003686] border border-[#c3c6d5]/30 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#f4f3f4] transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">file_download</span>
                        Xuất CSV
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-[#003686] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#094cb2] transition-all shadow-lg shadow-[#003686]/20 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">person_add</span>
                        Thêm giáo viên
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <span className="material-symbols-outlined text-4xl text-[#003686] animate-spin">progress_activity</span>
                </div>
            ) : (
                <AdminTeacherTable
                    teachers={teachers}
                    meta={meta}
                    page={page}
                    onPageChange={setPage}
                    onDelete={handleDelete}
                />
            )}

            {showAddModal && (
                <AdminAddTeacherModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={fetchTeachers}
                />
            )}
        </div>
    );
}