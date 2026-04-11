import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '—';
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
};

const STATUS_OPTIONS = [
    { value: 0, label: 'Chờ khai giảng', bg: 'bg-[#e3e2e3] text-[#434653]', dot: 'bg-[#737784]' },
    { value: 1, label: 'Đang giảng dạy', bg: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
    { value: 2, label: 'Đã hủy', bg: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
];

export default function AdminCourseDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [form, setForm] = useState(null);
    const [original, setOriginal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await api.get(`/admin/courses/${id}`);
                const data = res.data.course;
                setCourse(data);
                setForm({
                    name: data.name,
                    slug: data.slug,
                    description: data.description || '',
                    price: data.price ?? '',
                    thumbnail: data.thumbnail || '',
                    status: data.status,
                });
                setOriginal({
                    name: data.name,
                    slug: data.slug,
                    description: data.description || '',
                    price: data.price ?? '',
                    thumbnail: data.thumbnail || '',
                    status: data.status,
                });
            } catch (err) {
                console.error('Lỗi khi tải thông tin khóa học', err);
                navigate('/admin/courses');
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: name === 'price' || name === 'status' ? (value === '' ? '' : Number(value)) : value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
        setSuccess('');
    };

    const isDirty = form && original && (
        form.name !== original.name ||
        form.slug !== original.slug ||
        form.description !== original.description ||
        String(form.price) !== String(original.price) ||
        form.thumbnail !== original.thumbnail ||
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
            if (form.slug !== original.slug) payload.slug = form.slug;
            if (form.description !== original.description) payload.description = form.description;
            if (String(form.price) !== String(original.price)) payload.price = Number(form.price);
            if (form.thumbnail !== original.thumbnail) payload.thumbnail = form.thumbnail;
            if (String(form.status) !== String(original.status)) payload.status = Number(form.status);

            const res = await api.put(`/admin/courses/${id}`, payload);
            const updated = res.data.course;
            setCourse(updated);
            setForm({
                name: updated.name,
                slug: updated.slug,
                description: updated.description || '',
                price: updated.price ?? '',
                thumbnail: updated.thumbnail || '',
                status: updated.status,
            });
            setOriginal({
                name: updated.name,
                slug: updated.slug,
                description: updated.description || '',
                price: updated.price ?? '',
                thumbnail: updated.thumbnail || '',
                status: updated.status,
            });
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

    if (!course) return null;

    const currentStatus = STATUS_OPTIONS.find(s => s.value === form?.status) || STATUS_OPTIONS[0];

    return (
        <div className="px-8 pt-8 pb-12 max-w-4xl">
            <button
                onClick={() => navigate('/admin/courses')}
                className="flex items-center gap-2 text-sm text-[#737784] hover:text-[#003686] mb-6 transition-colors"
            >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Quay lại danh sách khóa học
            </button>

            <div className="flex justify-between items-end mb-8">
                <div>
                    <nav className="flex text-[10px] uppercase tracking-[0.1em] text-[#737784] mb-2 font-medium">
                        <span>Admin</span>
                        <span className="mx-2">/</span>
                        <span>Khóa học</span>
                        <span className="mx-2">/</span>
                        <span className="text-[#003686] font-bold">#{id}</span>
                    </nav>
                    <h2 className="text-4xl font-serif font-bold text-[#003686]">Chi tiết khóa học</h2>
                </div>
                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold gap-1.5 ${currentStatus.bg}`}>
                    <span className={`w-2 h-2 rounded-full ${currentStatus.dot}`}></span>
                    {currentStatus.label.toUpperCase()}
                </span>
            </div>

            <form onSubmit={handleSave}>
                <div className="bg-[#ffffff] rounded-xl shadow-[0_4px_20px_rgba(0,54,134,0.03)] overflow-hidden mb-6">
                    <div className="p-8">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-20 h-20 rounded-2xl bg-[#003686]/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                                {course.thumbnail ? (
                                    <img src={course.thumbnail} alt={course.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="material-symbols-outlined text-3xl text-[#003686]">school</span>
                                )}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-[#1a1c1d]">{course.name}</h3>
                                <p className="text-sm text-[#737784]">ID: #{course.id} · {course.slug}</p>
                            </div>
                        </div>

                        {success && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                                {success}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#737784] mb-1.5">Tên khóa học</label>
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
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#737784] mb-1.5">Slug</label>
                                <input
                                    name="slug"
                                    value={form?.slug || ''}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition-all ${
                                        errors.slug ? 'border-[#ba1a1a] focus:ring-1 focus:ring-[#ba1a1a]' : 'border-[#c3c6d5] focus:border-[#003686] focus:ring-1 focus:ring-[#003686]'
                                    }`}
                                />
                                {errors.slug && <p className="mt-1 text-xs text-[#ba1a1a]">{errors.slug[0]}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#737784] mb-1.5">Học phí (VND)</label>
                                <input
                                    name="price"
                                    type="number"
                                    value={form?.price ?? ''}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition-all ${
                                        errors.price ? 'border-[#ba1a1a] focus:ring-1 focus:ring-[#ba1a1a]' : 'border-[#c3c6d5] focus:border-[#003686] focus:ring-1 focus:ring-[#003686]'
                                    }`}
                                    placeholder="5000000"
                                />
                                {errors.price && <p className="mt-1 text-xs text-[#ba1a1a]">{errors.price[0]}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#737784] mb-1.5">Trạng thái</label>
                                <select
                                    name="status"
                                    value={form?.status ?? 0}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-[#c3c6d5] rounded-lg text-sm outline-none focus:border-[#003686] focus:ring-1 focus:ring-[#003686] transition-all bg-white"
                                >
                                    {STATUS_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                                {errors.status && <p className="mt-1 text-xs text-[#ba1a1a]">{errors.status[0]}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#737784] mb-1.5">Mô tả</label>
                                <textarea
                                    name="description"
                                    value={form?.description || ''}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-4 py-2.5 border border-[#c3c6d5] rounded-lg text-sm outline-none focus:border-[#003686] focus:ring-1 focus:ring-[#003686] transition-all resize-none"
                                    placeholder="Mô tả ngắn về khóa học..."
                                />
                                {errors.description && <p className="mt-1 text-xs text-[#ba1a1a]">{errors.description[0]}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#737784] mb-1.5">Link thumbnail</label>
                                <input
                                    name="thumbnail"
                                    value={form?.thumbnail || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-[#c3c6d5] rounded-lg text-sm outline-none focus:border-[#003686] focus:ring-1 focus:ring-[#003686] transition-all"
                                    placeholder="https://..."
                                />
                                {errors.thumbnail && <p className="mt-1 text-xs text-[#ba1a1a]">{errors.thumbnail[0]}</p>}
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-[#f4f3f4]/50 rounded-lg">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                <div>
                                    <p className="text-xs text-[#737784] mb-1">Học phí</p>
                                    <p className="text-sm font-bold text-[#003686]">{formatCurrency(course.price)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#737784] mb-1">Số lớp</p>
                                    <p className="text-sm font-bold text-[#003686]">{course.classes_count ?? 0}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#737784] mb-1">Ngày tạo</p>
                                    <p className="text-sm font-bold text-[#003686]">{course.created_at ? new Date(course.created_at).toLocaleDateString('vi-VN') : '—'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#737784] mb-1">Cập nhật</p>
                                    <p className="text-sm font-bold text-[#003686]">{course.updated_at ? new Date(course.updated_at).toLocaleDateString('vi-VN') : '—'}</p>
                                </div>
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