import { useState } from 'react';
import api from '../utils/api';

export default function AdminAddCourseModal({ onClose, onSuccess }) {
    const [form, setForm] = useState({ name: '', slug: '', description: '', price: '', thumbnail: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);
        try {
            const payload = {};
            if (form.name) payload.name = form.name;
            if (form.slug) payload.slug = form.slug;
            if (form.description) payload.description = form.description;
            if (form.price) payload.price = Number(form.price);
            if (form.thumbnail) payload.thumbnail = form.thumbnail;
            await api.post('/admin/courses', payload);
            onSuccess();
            onClose();
        } catch (err) {
            const errData = err.response?.data;
            if (errData?.errors) setErrors(errData.errors);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#e9e8e9]">
                    <h3 className="text-lg font-bold text-[#1a1c1d]">Tạo khóa học mới</h3>
                    <button onClick={onClose} className="text-[#737784] hover:text-[#1a1c1d] transition-colors">
                        <span className="material-symbols-outlined text-2xl">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#737784] mb-1.5">Tên khóa học *</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition-all ${
                                errors.name ? 'border-[#ba1a1a] focus:ring-1 focus:ring-[#ba1a1a]' : 'border-[#c3c6d5] focus:border-[#003686] focus:ring-1 focus:ring-[#003686]'
                            }`}
                            placeholder="IELTS Intensive"
                        />
                        {errors.name && <p className="mt-1 text-xs text-[#ba1a1a]">{errors.name[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#737784] mb-1.5">Slug *</label>
                        <input
                            name="slug"
                            value={form.slug}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition-all ${
                                errors.slug ? 'border-[#ba1a1a] focus:ring-1 focus:ring-[#ba1a1a]' : 'border-[#c3c6d5] focus:border-[#003686] focus:ring-1 focus:ring-[#003686]'
                            }`}
                            placeholder="ielts-intensive"
                        />
                        {errors.slug && <p className="mt-1 text-xs text-[#ba1a1a]">{errors.slug[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#737784] mb-1.5">Mô tả</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2.5 border border-[#c3c6d5] rounded-lg text-sm outline-none focus:border-[#003686] focus:ring-1 focus:ring-[#003686] transition-all resize-none"
                            placeholder="Mô tả ngắn về khóa học..."
                        />
                        {errors.description && <p className="mt-1 text-xs text-[#ba1a1a]">{errors.description[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#737784] mb-1.5">Học phí (VND)</label>
                        <input
                            name="price"
                            type="number"
                            value={form.price}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition-all ${
                                errors.price ? 'border-[#ba1a1a] focus:ring-1 focus:ring-[#ba1a1a]' : 'border-[#c3c6d5] focus:border-[#003686] focus:ring-1 focus:ring-[#003686]'
                            }`}
                            placeholder="5000000"
                        />
                        {errors.price && <p className="mt-1 text-xs text-[#ba1a1a]">{errors.price[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#737784] mb-1.5">Link thumbnail</label>
                        <input
                            name="thumbnail"
                            value={form.thumbnail}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-[#c3c6d5] rounded-lg text-sm outline-none focus:border-[#003686] focus:ring-1 focus:ring-[#003686] transition-all"
                            placeholder="https://..."
                        />
                        {errors.thumbnail && <p className="mt-1 text-xs text-[#ba1a1a]">{errors.thumbnail[0]}</p>}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 border border-[#c3c6d5] text-[#434653] rounded-lg text-sm font-semibold hover:bg-[#f4f3f4] transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2.5 bg-[#003686] text-white rounded-lg text-sm font-semibold hover:bg-[#094cb2] transition-all disabled:opacity-60"
                        >
                            {loading ? 'Đang xử lý...' : 'Tạo khóa học'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}