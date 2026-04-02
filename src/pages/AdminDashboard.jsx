import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../utils/api';
import AdminTeacherTable from '../components/AdminTeacherTable';

const formatCurrency = (amount) => {
    if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)} tỷ`;
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)} triệu`;
    if (amount >= 1_000) return `${(amount / 1_000).toFixed(1)}k`;
    return amount;
};

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [charts, setCharts] = useState([]);
    const [studentStatus, setStudentStatus] = useState(null);
    const [pendingActions, setPendingActions] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [teachersMeta, setTeachersMeta] = useState(null);
    const [teachersPage, setTeachersPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const [statsRes, chartsRes, statusRes, pendingRes, teachersRes] = await Promise.all([
                    api.get('/admin/dashboard/stats'),
                    api.get('/admin/dashboard/charts'),
                    api.get('/admin/dashboard/student-status'),
                    api.get('/admin/dashboard/pending-actions'),
                    api.get('/admin/teachers?per_page=5'),
                ]);
                setStats(statsRes.data);
                setCharts(chartsRes.data || []);
                setStudentStatus(statusRes.data);
                setPendingActions(pendingRes.data || []);
                setTeachers(teachersRes.data.data || []);
                setTeachersMeta(teachersRes.data.meta);
            } catch (err) {
                console.error('Lỗi khi tải dữ liệu dashboard', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    const fetchTeachers = async (page = 1) => {
        try {
            const res = await api.get(`/admin/teachers?page=${page}&per_page=5`);
            setTeachers(res.data.data || []);
            setTeachersMeta(res.data.meta);
            setTeachersPage(page);
        } catch (err) {
            console.error('Lỗi khi tải danh sách giáo viên', err);
        }
    };

    useEffect(() => {
        fetchTeachers(teachersPage);
    }, [teachersPage]);

    const handleDeleteTeacher = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa giáo viên này?')) return;
        try {
            await api.delete(`/admin/teachers/${id}`);
            const res = await api.get('/admin/teachers?per_page=5');
            setTeachers(res.data.data || []);
            setTeachersMeta(res.data.meta);
        } catch (err) {
            console.error('Lỗi khi xóa giáo viên', err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
            </div>
        );
    }

    return (
        <div className="px-8 pt-8 pb-12">
            <div className="mb-10">
                <h2 className="text-4xl font-serif text-[#1a1c1d] mb-2">Tổng quan học vụ</h2>
                <p className="text-[#434653] font-medium">Chào mừng trở lại, Bảng điều khiển. Dưới đây là dữ liệu hiệu suất mới nhất của Trung tâm Giáo dục Nam Thái.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Row 1: Stats Cards */}
                <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-[#ffffff] p-8 rounded-xl shadow-[0_4px_20px_rgba(0,54,134,0.03)] flex justify-between items-center hover:-translate-y-0.5 transition-all">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#434653] mb-2">Tổng người dùng</p>
                            <h3 className="text-4xl font-serif font-bold text-[#003686]">{stats?.total_users?.toLocaleString() ?? '—'}</h3>
                            <div className="flex items-center gap-1 mt-3 text-emerald-700 text-xs font-semibold">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                <span>Tăng {stats?.user_growth_percent ?? 0}%</span>
                            </div>
                        </div>
                        <div className="w-14 h-14 rounded-full bg-[#003686]/5 flex items-center justify-center text-[#003686]">
                            <span className="material-symbols-outlined text-3xl">groups</span>
                        </div>
                    </div>

                    <div className="bg-[#ffffff] p-8 rounded-xl shadow-[0_4px_20px_rgba(0,54,134,0.03)] flex justify-between items-center hover:-translate-y-0.5 transition-all">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#434653] mb-2">Tổng lớp học</p>
                            <h3 className="text-4xl font-serif font-bold text-[#003686]">{stats?.total_classes ?? '—'}</h3>
                            <div className="flex items-center gap-1 mt-3 text-emerald-700 text-xs font-semibold">
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                <span>{stats?.active_classes_count ?? 0} đang hoạt động</span>
                            </div>
                        </div>
                        <div className="w-14 h-14 rounded-full bg-[#003686]/5 flex items-center justify-center text-[#003686]">
                            <span className="material-symbols-outlined text-3xl">class</span>
                        </div>
                    </div>

                    <div className="bg-[#ffffff] p-8 rounded-xl shadow-[0_4px_20px_rgba(0,54,134,0.03)] flex justify-between items-center hover:-translate-y-0.5 transition-all">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#434653] mb-2">Tổng số khóa học</p>
                            <h3 className="text-4xl font-serif font-bold text-[#003686]">{stats?.total_courses ?? '—'}</h3>
                        </div>
                        <div className="w-14 h-14 rounded-full bg-[#003686]/5 flex items-center justify-center text-[#003686]">
                            <span className="material-symbols-outlined text-3xl">class</span>
                        </div>
                    </div>

                    <div className="bg-[#ffffff] p-8 rounded-xl shadow-[0_4px_20px_rgba(0,54,134,0.03)] flex justify-between items-center hover:-translate-y-0.5 transition-all">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#434653] mb-2">Doanh thu tháng</p>
                            <h3 className="text-4xl font-serif font-bold text-[#003686]">{formatCurrency(stats?.monthly_revenue ?? 0)}</h3>
                            <div className="flex items-center gap-1 mt-3 text-[#094cb2] text-xs font-semibold">
                                <span className="material-symbols-outlined text-sm">payments</span>
                                <span>{stats?.revenue_target_percent ?? 0}% đạt mục tiêu</span>
                            </div>
                        </div>
                        <div className="w-14 h-14 rounded-full bg-[#003686]/5 flex items-center justify-center text-[#003686]">
                            <span className="material-symbols-outlined text-3xl">receipt_long</span>
                        </div>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-8 bg-[#ffffff] p-8 rounded-xl shadow-[0_4px_20px_rgba(0,54,134,0.03)]">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-xl font-serif font-bold text-[#1a1c1d]">Phân tích tăng trưởng</h3>
                            <p className="text-sm text-[#434653]">Số lượng học viên & giáo viên mới theo tháng</p>
                        </div>
                        <div className="flex gap-4">
                            <span className="flex items-center gap-2 text-xs font-semibold text-[#434653]">
                                <span className="w-3 h-3 rounded-full bg-[#003686]"></span> Học viên
                            </span>
                            <span className="flex items-center gap-2 text-xs font-semibold text-[#434653]">
                                <span className="w-3 h-3 rounded-full bg-[#c1d1ff]"></span> Giáo viên
                            </span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={charts} barGap={4}>
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 700, fontFamily: 'Inter' }} />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontFamily: 'Inter', fontSize: 12 }}
                                cursor={{ fill: 'rgba(0,54,134,0.05)' }}
                            />
                            <Bar dataKey="students" fill="#003686" radius={[4, 4, 0, 0]} name="Học viên" />
                            <Bar dataKey="teachers" fill="#c1d1ff" radius={[4, 4, 0, 0]} name="Giáo viên" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="col-span-12 lg:col-span-4 bg-[#ffffff] p-8 rounded-xl shadow-[0_4px_20px_rgba(0,54,134,0.03)]">
                    <h3 className="text-xl font-serif font-bold text-[#1a1c1d] mb-6">Tình trạng học viên</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-[#dae2ff]">
                            <div>
                                <p className="text-xs text-[#434653] font-medium">Đang chờ</p>
                                <p className="text-2xl font-bold text-[#003686]">{studentStatus?.pending ?? 0}</p>
                            </div>
                            <span className="material-symbols-outlined text-[#003686]">schedule</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-[#dae2ff]">
                            <div>
                                <p className="text-xs text-[#434653] font-medium">Đã ghi danh</p>
                                <p className="text-2xl font-bold text-[#003686]">{studentStatus?.enrolled ?? 0}</p>
                            </div>
                            <span className="material-symbols-outlined text-[#003686]">check_circle</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-[#dae2ff]">
                            <div>
                                <p className="text-xs text-[#434653] font-medium">Đã hủy</p>
                                <p className="text-2xl font-bold text-[#003686]">{studentStatus?.canceled ?? 0}</p>
                            </div>
                            <span className="material-symbols-outlined text-[#003686]">cancel</span>
                        </div>
                    </div>
                    <button className="w-full mt-8 py-3 text-xs font-bold uppercase tracking-widest text-[#003686] border border-[#003686]/10 rounded-lg hover:bg-[#003686]/5 transition-colors">
                        Xem toàn bộ điểm danh
                    </button>
                </div>

                <div className="col-span-12 lg:col-span-8">
                    <AdminTeacherTable
                        teachers={teachers}
                        meta={teachersMeta}
                        loading={false}
                        page={teachersPage}
                        onPageChange={fetchTeachers}
                        onDelete={handleDeleteTeacher}
                    />
                </div>

                <div className="col-span-12 lg:col-span-4 bg-[#ffffff] p-8 rounded-xl shadow-[0_4px_20px_rgba(0,54,134,0.03)] border border-[#003686]/5">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-serif font-bold text-[#1a1c1d]">Phê duyệt chờ xử lý</h3>
                        {pendingActions.length > 0 && (
                            <span className="bg-[#ba1a1a]/10 text-[#ba1a1a] px-2 py-1 rounded text-[10px] font-extrabold">
                                {pendingActions.length} MỚI
                            </span>
                        )}
                    </div>
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                        {pendingActions.length === 0 ? (
                            <p className="text-sm text-[#434653] text-center py-8">Không có yêu cầu chờ duyệt</p>
                        ) : (
                            pendingActions.map((item) => (
                                <div key={item.id} className="p-4 bg-[#f4f3f4] rounded-lg">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h4 className="text-sm font-bold text-[#1a1c1d]">{item.student_name}</h4>
                                            <p className="text-[10px] font-medium text-[#434653]">Khóa học: {item.course_name}</p>
                                        </div>
                                        <span className="text-[10px] text-slate-400">{item.created_at}</span>
                                    </div>
                                    {item.proof_image && (
                                        <div className="relative h-24 w-full bg-[#e3e2e3] rounded-md overflow-hidden mb-4 group cursor-pointer">
                                            <img
                                                alt="Bằng chứng thanh toán"
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                src={item.proof_image}
                                            />
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <button className="flex-1 py-2 bg-[#003686] text-white text-[10px] font-bold uppercase rounded hover:opacity-90 transition-opacity">
                                            Duyệt
                                        </button>
                                        <button className="px-3 py-2 text-[#434653] hover:text-[#ba1a1a] transition-colors">
                                            <span className="material-symbols-outlined text-lg">close</span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}