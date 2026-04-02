import { useState } from 'react';
import api from '../utils/api';

export default function AdminAddTeacherModal({ onClose, onSuccess }) {
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
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
            await api.post('/admin/teachers', { teachers: [form] });
            onSuccess();
            onClose();
        } catch (err) {
            const errData = err.response?.data;
            if (errData?.errors) {
                const mapped = {};
                Object.keys(errData.errors).forEach(key => {
                    const cleanKey = key.replace(/^teachers\.\d+\./, '');
                    mapped[cleanKey] = errData.errors[key];
                });
                setErrors(mapped);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#e9e8e9]">
                    <h3 className="text-lg font-bold text-[#1a1c1d]">Thêm giáo viên mới</h3>
                    <button onClick={onClose} className="text-[#737784] hover:text-[#1a1c1d] transition-colors">
                        <span className="material-symbols-outlined text-2xl">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#737784] mb-1.5">Họ và tên *</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition-all ${
                                errors.name ? 'border-[#ba1a1a] focus:ring-1 focus:ring-[#ba1a1a]' : 'border-[#c3c6d5] focus:border-[#003686] focus:ring-1 focus:ring-[#003686]'
                            }`}
                            placeholder="Nguyễn Văn A"
                        />
                        {errors.name && <p className="mt-1 text-xs text-[#ba1a1a]">{errors.name[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#737784] mb-1.5">Email *</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition-all ${
                                errors.email ? 'border-[#ba1a1a] focus:ring-1 focus:ring-[#ba1a1a]' : 'border-[#c3c6d5] focus:border-[#003686] focus:ring-1 focus:ring-[#003686]'
                            }`}
                            placeholder="teacher@example.com"
                        />
                        {errors.email && <p className="mt-1 text-xs text-[#ba1a1a]">{errors.email[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#737784] mb-1.5">Số điện thoại</label>
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border border-[#c3c6d5] rounded-lg text-sm outline-none focus:border-[#003686] focus:ring-1 focus:ring-[#003686] transition-all ${
                                errors.phone ? 'border-[#ba1a1a]' : ''
                            }`}
                            placeholder="0901234567"
                        />
                        {errors.phone && <p className="mt-1 text-xs text-[#ba1a1a]">{errors.phone[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#737784] mb-1.5">Mật khẩu *</label>
                        <input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition-all ${
                                errors.password ? 'border-[#ba1a1a] focus:ring-1 focus:ring-[#ba1a1a]' : 'border-[#c3c6d5] focus:border-[#003686] focus:ring-1 focus:ring-[#003686]'
                            }`}
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="mt-1 text-xs text-[#ba1a1a]">{errors.password[0]}</p>}
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
                            {loading ? 'Đang xử lý...' : 'Thêm giáo viên'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}