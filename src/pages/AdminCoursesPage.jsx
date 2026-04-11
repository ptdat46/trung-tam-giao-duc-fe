import { useState, useEffect } from 'react';
import AdminCourseTable from '../components/AdminCourseTable';
import AdminAddCourseModal from '../components/AdminAddCourseModal';
import api from '../utils/api';

const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '—';
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
};

export default function AdminCoursesPage() {
    const [courses, setCourses] = useState([]);
    const [meta, setMeta] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/courses-stats');
            setStats(res.data);
        } catch (err) {
            console.error('Lỗi khi tải thống kê khóa học', err);
        }
    };

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, per_page: 10 });
            if (search) params.set('search', search);
            if (status) params.set('status', status);
            if (minPrice) params.set('min_price', minPrice);
            if (maxPrice) params.set('max_price', maxPrice);
            const res = await api.get(`/admin/courses?${params}`);
            setCourses(res.data.data || []);
            setMeta(res.data.meta);
        } catch (err) {
            console.error('Lỗi khi tải danh sách khóa học', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [page]);

    const handleFilter = () => {
        setPage(1);
        fetchCourses();
    };

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa khóa học này?')) return;
        try {
            await api.delete(`/admin/courses/${id}`);
            fetchCourses();
            fetchStats();
        } catch (err) {
            console.error('Lỗi khi xóa khóa học', err);
        }
    };

    return (
        <div className="px-8 pt-8 pb-12">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <nav className="flex text-[10px] uppercase tracking-[0.1em] text-[#737784] mb-2 font-medium">
                        <span>Admin</span>
                        <span className="mx-2">/</span>
                        <span className="text-[#003686] font-bold">Khóa học</span>
                    </nav>
                    <h2 className="text-4xl font-serif font-bold text-[#003686]">Quản lý Khóa học & Đào tạo</h2>
                    <p className="text-[#434653] mt-2 text-sm max-w-xl">
                        Hệ thống quản lý học thuật và lộ trình giảng dạy chuyên sâu.
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-[#003686] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#094cb2] transition-all shadow-lg shadow-[#003686]/20 flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-lg">add</span>
                    Tạo khóa học mới
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-[#ffffff] p-6 rounded-xl shadow-[0_4px_20px_rgba(0,54,134,0.03)] flex justify-between items-center hover:-translate-y-0.5 transition-all border-b-2 border-transparent hover:border-[#003686]">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#434653] mb-2">Tổng khóa học</p>
                        <h3 className="text-4xl font-serif font-bold text-[#003686]">{stats?.total_courses ?? '—'}</h3>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-[#003686]/5 flex items-center justify-center text-[#003686]">
                        <span className="material-symbols-outlined text-3xl">menu_book</span>
                    </div>
                </div>

                <div className="bg-[#ffffff] p-6 rounded-xl shadow-[0_4px_20px_rgba(0,54,134,0.03)] flex justify-between items-center hover:-translate-y-0.5 transition-all border-b-2 border-transparent hover:border-[#00639a]">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#434653] mb-2">Lớp đang hoạt động</p>
                        <h3 className="text-4xl font-serif font-bold text-[#003686]">{stats?.active_classes_count ?? '—'}</h3>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-[#00639a]/10 flex items-center justify-center text-[#00639a]">
                        <span className="material-symbols-outlined text-3xl">groups</span>
                    </div>
                </div>

                <div className="bg-[#ffffff] p-6 rounded-xl shadow-[0_4px_20px_rgba(0,54,134,0.03)] flex justify-between items-center hover:-translate-y-0.5 transition-all border-b-2 border-transparent hover:border-green-500">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#434653] mb-2">Tỷ lệ lấp đầy</p>
                        <h3 className="text-4xl font-serif font-bold text-[#003686]">{stats?.enrollment_rate ?? 0}%</h3>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                        <span className="material-symbols-outlined text-3xl">trending_up</span>
                    </div>
                </div>

                <div className="bg-[#ffffff] p-6 rounded-xl shadow-[0_4px_20px_rgba(0,54,134,0.03)] flex justify-between items-center hover:-translate-y-0.5 transition-all border-b-2 border-transparent hover:border-orange-500">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#434653] mb-2">Sắp khai giảng</p>
                        <h3 className="text-4xl font-serif font-bold text-[#003686]">{stats?.upcoming_courses_count ?? '—'}</h3>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-orange-700">
                        <span className="material-symbols-outlined text-3xl">event_available</span>
                    </div>
                </div>
            </div>

            <div className="bg-[#ffffff] rounded-xl shadow-[0_4px_20px_rgba(0,54,134,0.03)] overflow-hidden mb-6">
                <div className="p-5 bg-[#f4f3f4]/50 flex flex-wrap items-end gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <label className="text-[10px] font-bold text-[#737784] uppercase block mb-1 ml-1">Tìm kiếm</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737784] text-lg">search</span>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                placeholder="Tìm theo tên, slug..."
                                className="w-full bg-white border-none rounded-lg text-sm font-medium py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-[#003686]/10"
                            />
                        </div>
                    </div>
                    <div className="flex-1 min-w-[160px]">
                        <label className="text-[10px] font-bold text-[#737784] uppercase block mb-1 ml-1">Trạng thái</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full bg-white border-none rounded-lg text-sm font-medium py-2.5 px-3 focus:ring-2 focus:ring-[#003686]/10"
                        >
                            <option value="">Tất cả</option>
                            <option value="0">Chờ khai giảng</option>
                            <option value="1">Đang giảng dạy</option>
                            <option value="2">Đã hủy</option>
                        </select>
                    </div>
                    <div className="flex-1 min-w-[140px]">
                        <label className="text-[10px] font-bold text-[#737784] uppercase block mb-1 ml-1">Giá từ</label>
                        <input
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            placeholder="0"
                            className="w-full bg-white border-none rounded-lg text-sm font-medium py-2.5 px-3 focus:ring-2 focus:ring-[#003686]/10"
                        />
                    </div>
                    <div className="flex-1 min-w-[140px]">
                        <label className="text-[10px] font-bold text-[#737784] uppercase block mb-1 ml-1">Giá đến</label>
                        <input
                            type="number"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            placeholder="∞"
                            className="w-full bg-white border-none rounded-lg text-sm font-medium py-2.5 px-3 focus:ring-2 focus:ring-[#003686]/10"
                        />
                    </div>
                    <button
                        onClick={handleFilter}
                        className="bg-[#003686] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#094cb2] transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">filter_list</span>
                        Áp dụng
                    </button>
                </div>

                <AdminCourseTable
                    courses={courses}
                    meta={meta}
                    loading={loading}
                    page={page}
                    onPageChange={setPage}
                    onDelete={handleDelete}
                />
            </div>

            {showAddModal && (
                <AdminAddCourseModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => { fetchCourses(); fetchStats(); }}
                />
            )}
        </div>
    );
}
