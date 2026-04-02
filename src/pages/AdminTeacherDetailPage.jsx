import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const getInitials = (name) => {
    if (!name) return 'GV';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export default function AdminTeacherDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [teacher, setTeacher] = useState(null);
    const [form, setForm] = useState(null);
    const [original, setOriginal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchTeacher = async () => {
            try {
                const res = await api.get(`/admin/teachers/${id}`);
                const data = res.data.teacher;
                setTeacher(data);
                setForm({ name: data.name, email: data.email, phone: data.phone || '', status: data.status });
                setOriginal({ name: data.name, email: data.email, phone: data.phone || '', status: data.status });
            } catch (err) {
                console.error('Lỗi khi tải thông tin giáo viên', err);
                navigate('/admin/teachers');
            } finally {
                setLoading(false);
            }
        };
        fetchTeacher();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
        setSuccess('');
    };

    const isDirty = form && original && (
        form.name !== original.name ||
        form.email !== original.email ||
        form.phone !== original.phone ||
        String(form.status) !== String(original.status)
    );

    const handleSave = async (e) => {
        e.preventDefault();
        setErrors({});
        setSaving(true);
        setSuccess('');
        try {
            const payload = {};
            if (form.name !== original.name) payload.name = form.name;
            if (form.email !== original.email) payload.email = form.email;
            if (form.phone !== original.phone) payload.phone = form.phone;
            if (String(form.status) !== String(original.status)) payload.status = Number(form.status);

            const res = await api.put(`/admin/teachers/${id}`, payload);
            const updated = res.data.teacher;
            setTeacher(updated);
            setForm({ name: updated.name, email: updated.email, phone: updated.phone || '', status: updated.status });
            setOriginal({ name: updated.name, email: updated.email, phone: updated.phone || '', status: updated.status });
            setSuccess('Cập nhật thông tin thành công!');
        } catch (err) {
            const errData = err.response?.data;
            if (errData?.errors) setErrors(errData.errors);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="material-symbols-outlined text-4xl text-[#003686] animate-spin">progress_activity</span>
            </div>
        );
    }

    if (!teacher) return null;

    const isActive = form?.status === 1;

    return (
        <div className="px-8 pt-8 pb-12 max-w-4xl">
            <button
                onClick={() => navigate('/admin/teachers')}
                className="flex items-center gap-2 text-sm text-[#737784] hover:text-[#003686] mb-6 transition-colors"
            >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Quay lại danh sách giáo viên
            </button>

            <div className="flex justify-between items-end mb-8">
                <div>
                    <nav className="flex text-[10px] uppercase tracking-[0.1em] text-[#737784] mb-2 font-medium">
                        <span>Admin</span>
                        <span className="mx-2">/</span>
                        <span>Giáo viên</span>
                        <span className="mx-2">/</span>
                        <span className="text-[#003686] font-bold">#{id}</span>
                    </nav>
                    <h2 className="text-4xl font-serif font-bold text-[#003686]">Chi tiết giáo viên</h2>
                </div>
                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold gap-1.5 ${
                    isActive ? 'bg-green-100 text-green-700' : 'bg-[#e3e2e3] text-[#434653]'
                }`}>
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-[#737784]'}`}></span>
                    {isActive ? 'HOẠT ĐỘNG' : 'KHÔNG HOẠT ĐỘNG'}
                </span>
            </div>

            <form onSubmit={handleSave}>
                <div className="bg-[#ffffff] rounded-xl shadow-[0_4px_20px_rgba(0,54,134,0.03)] overflow-hidden mb-6">
                    <div className="p-8">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-20 h-20 rounded-2xl bg-[#094cb2] text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-[#003686]/20">
                                {getInitials(teacher.name)}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-[#1a1c1d]">{teacher.name}</h3>
                                <p className="text-sm text-[#737784]">ID: #{teacher.id} · Tham gia {new Date(teacher.created_at).toLocaleDateString('vi-VN')}</p>
                            </div>
                        </div>

                        {success && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                                {success}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#737784] mb-1.5">Họ và tên</label>
                                <input
                                    name="name"
                                    value={form?.name || ''}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition-all ${
                                        errors.name ? 'border-[#ba1a1a] focus:ring-1 focus:ring-[#ba1a1a]' : 'border-[#c3c6d5] focus:border-[#003686] focus:ring-1 focus:ring-[#003686]'
                                    }`}
                                />
                                {errors.name && <p className="mt-1 text-xs text-[#ba1a1a]">{errors.name[0]}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#737784] mb-1.5">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={form?.email || ''}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition-all ${
                                        errors.email ? 'border-[#ba1a1a] focus:ring-1 focus:ring-[#ba1a1a]' : 'border-[#c3c6d5] focus:border-[#003686] focus:ring-1 focus:ring-[#003686]'
                                    }`}
                                />
                                {errors.email && <p className="mt-1 text-xs text-[#ba1a1a]">{errors.email[0]}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#737784] mb-1.5">Số điện thoại</label>
                                <input
                                    name="phone"
                                    value={form?.phone || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-[#c3c6d5] rounded-lg text-sm outline-none focus:border-[#003686] focus:ring-1 focus:ring-[#003686] transition-all"
                                    placeholder="0901234567"
                                />
                                {errors.phone && <p className="mt-1 text-xs text-[#ba1a1a]">{errors.phone[0]}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#737784] mb-1.5">Trạng thái</label>
                                <select
                                    name="status"
                                    value={form?.status ?? 1}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-[#c3c6d5] rounded-lg text-sm outline-none focus:border-[#003686] focus:ring-1 focus:ring-[#003686] transition-all bg-white"
                                >
                                    <option value={1}>Hoạt động</option>
                                    <option value={0}>Không hoạt động</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 py-5 bg-[#f4f3f4]/50 border-t border-[#e9e8e9] flex justify-end">
                        <button
                            type="submit"
                            disabled={!isDirty || saving}
                            className={`px-8 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                                isDirty && !saving
                                    ? 'bg-[#003686] text-white hover:bg-[#094cb2] shadow-lg shadow-[#003686]/20'
                                    : 'bg-[#e3e2e3] text-[#737784] cursor-not-allowed'
                            }`}
                        >
                            {saving ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}