import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const CLASS_TYPES = {
    0: { label: 'Offline', cardClass: 'bg-slate-50 border-l-slate-400 text-slate-900', labelClass: 'text-slate-600', dot: 'bg-slate-400' },
    1: { label: 'Online', cardClass: 'bg-blue-50 border-l-blue-500 text-blue-900', labelClass: 'text-blue-700/80', dot: 'bg-blue-500' },
};

const ROOM_STATUS = {
    0: { label: 'Trống', bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-400' },
    1: { label: 'Đang học', bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-400' },
    2: { label: 'Bảo trì', bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-400' },
};

const TIME_SLOTS = ['07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];

const MOCK_CLASSES = [
    { id: 1, name: 'IELTS Intensive Sáng', course_name: 'IELTS Intensive', teacher_name: 'Nguyễn Văn A' },
    { id: 2, name: 'Toán 12 - Nâng cao', course_name: 'Toán 12', teacher_name: 'Trần Thị Lan' },
    { id: 3, name: 'Vật lý 11', course_name: 'Vật lý 11', teacher_name: 'Lê Hoàng Nam' },
    { id: 4, name: 'Hóa học 10', course_name: 'Hóa học 10', teacher_name: 'Phạm Minh Đức' },
    { id: 5, name: 'Ngữ Văn 12', course_name: 'Ngữ Văn 12', teacher_name: 'Hoàng Thu Hà' },
    { id: 6, name: 'Tiếng Anh IELTS', course_name: 'IELTS Foundation', teacher_name: 'Kevin Wilson' },
];

const MOCK_SESSIONS = {
    1: [
        { id: 101, title: 'Buổi 1 - Giới thiệu IELTS' },
        { id: 102, title: 'Buổi 2 - Ngữ pháp cơ bản' },
        { id: 103, title: 'Buổi 3 - Listening Strategy' },
        { id: 104, title: 'Buổi 4 - Reading Comprehension' },
        { id: 105, title: 'Buổi 5 - Writing Task 1' },
    ],
    2: [
        { id: 201, title: 'Buổi 1 - Hàm số bậc 2' },
        { id: 202, title: 'Buổi 2 - Phương trình lượng giác' },
        { id: 203, title: 'Buổi 3 - Tích phân' },
    ],
    3: [
        { id: 301, title: 'Buổi 1 - Cơ học cơ bản' },
        { id: 302, title: 'Buổi 2 - Điện học' },
    ],
    4: [
        { id: 401, title: 'Buổi 1 - Bảng tuần hoàn' },
        { id: 402, title: 'Buổi 2 - Phản ứng oxi hóa khử' },
    ],
    5: [
        { id: 501, title: 'Buổi 1 - Văn học trung đại' },
        { id: 502, title: 'Buổi 2 - Văn học hiện đại' },
    ],
    6: [
        { id: 601, title: 'Buổi 1 - Grammar Basics' },
        { id: 602, title: 'Buổi 2 - Vocabulary Building' },
    ],
};

function getWeekDates(weekStr) {
    const [year, week] = weekStr.split('-W').map(Number);
    const firstDayOfYear = new Date(year, 0, 1);
    const dayOfWeek = firstDayOfYear.getDay();
    const daysToMonday = dayOfWeek <= 1 ? 1 - dayOfWeek : 8 - dayOfWeek;
    const monday = new Date(firstDayOfYear);
    monday.setDate(monday.getDate() + daysToMonday + (week - 1) * 7);
    const dates = [];
    for (let i = 0; i < 5; i++) {
        const d = new Date(monday);
        d.setDate(d.getDate() + i);
        dates.push(d);
    }
    return dates;
}

function formatDate(d) {
    if (!d) return '';
    if (typeof d === 'string') {
        const [y, m, day] = d.split('-');
        return `${day}/${m}/${y}`;
    }
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}/${d.getFullYear()}`;
}

function dateToYmd(d) {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
}

function formatTimeApi(timeStr) {
    if (!timeStr) return '';
    return timeStr.substring(0, 5);
}

function getIsoWeek(year, date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    const week1 = new Date(d.getFullYear(), 0, 4);
    const weekNum = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    return `${year}-W${String(weekNum).padStart(2, '0')}`;
}

function CustomModal({ open, onClose, title, children, onOk, okText, cancelText, confirmLoading }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 className="text-base font-bold text-[#1a1c1d]">{title}</h3>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
                        <span className="material-symbols-outlined text-slate-400 text-xl">close</span>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">{children}</div>
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
                    <button onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                        {cancelText || 'Hủy'}
                    </button>
                    {onOk && (
                        <button
                            onClick={onOk}
                            disabled={confirmLoading}
                            className="px-5 py-2 rounded-lg text-sm font-bold text-white bg-[#003686] hover:bg-[#094cb2] transition-colors disabled:opacity-60"
                        >
                            {confirmLoading ? 'Đang xử lý...' : (okText || 'Xác nhận')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function AdminSchedulingPage() {
    const [activeTab, setActiveTab] = useState('calendar');
    const [stats, setStats] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [weekSessions, setWeekSessions] = useState({});
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState('');

    const now = new Date();
    const [selectedWeek, setSelectedWeek] = useState(getIsoWeek(now.getFullYear(), now));
    const weekDates = getWeekDates(selectedWeek);

    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [sessionsOfClass, setSessionsOfClass] = useState([]);
    const [assignForm, setAssignForm] = useState({
        session_id: '',
        room_id: '',
        session_date: '',
        start_time: '',
        duration: 90,
        type: '0',
    });
    const [submitLoading, setSubmitLoading] = useState(false);

    const fetchAll = async (week) => {
        setLoading(true);
        try {
            const [statsRes, roomsRes, calendarRes, requestsRes] = await Promise.all([
                api.get('/admin/scheduling/stats'),
                api.get('/admin/scheduling/rooms'),
                api.get(`/admin/scheduling/calendar?week=${week}`),
                api.get('/admin/scheduling/requests?status=0'),
            ]);
            setStats(statsRes.data);
            setRooms(Array.isArray(roomsRes.data) ? roomsRes.data : []);
            const cal = calendarRes.data;
            setWeekSessions(cal?.sessions || {});
            const req = requestsRes.data;
            if (req?.data) {
                setRequests(req.data);
            } else if (Array.isArray(req)) {
                setRequests(req);
            } else {
                setRequests([]);
            }
            const t = new Date();
            setLastUpdated(`${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`);
        } catch (err) {
            console.error('Lỗi khi tải dữ liệu lịch:', err);
            setStats(null);
            setRooms([]);
            setWeekSessions({});
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll(selectedWeek);
    }, [selectedWeek]);

    const handlePrevWeek = () => {
        const [year, week] = selectedWeek.split('-W').map(Number);
        let newYear = year, newWeek = week - 1;
        if (newWeek < 1) {
            newYear -= 1;
            const lastDay = new Date(newYear, 11, 31);
            newWeek = parseInt(getIsoWeek(newYear, lastDay).split('-W')[1], 10);
        }
        setSelectedWeek(`${newYear}-W${String(newWeek).padStart(2, '0')}`);
    };

    const handleNextWeek = () => {
        const [year, week] = selectedWeek.split('-W').map(Number);
        let newYear = year, newWeek = week + 1;
        const lastDay = new Date(year, 11, 31);
        const lastWeek = parseInt(getIsoWeek(year, lastDay).split('-W')[1], 10);
        if (newWeek > lastWeek) { newYear += 1; newWeek = 1; }
        setSelectedWeek(`${newYear}-W${String(newWeek).padStart(2, '0')}`);
    };

    const handleClassChange = async (classId) => {
        setSelectedClassId(classId);
        setAssignForm(prev => ({ ...prev, session_id: '' }));
        if (!classId) { setSessionsOfClass([]); return; }
        try {
            const res = await api.get(`/admin/classes/${classId}/sessions`);
            const data = res.data;
            setSessionsOfClass(Array.isArray(data?.sessions) ? data.sessions : Array.isArray(data) ? data : []);
        } catch {
            setSessionsOfClass(MOCK_SESSIONS[classId] || []);
        }
    };

    const handleAssignSubmit = async () => {
        if (!assignForm.session_id || !assignForm.room_id || !assignForm.session_date || !assignForm.start_time) {
            toast.error('Vui lòng điền đầy đủ thông tin.');
            return;
        }
        setSubmitLoading(true);
        try {
            await api.post('/admin/scheduling/assign', {
                session_id: Number(assignForm.session_id),
                room_id: Number(assignForm.room_id),
                session_date: assignForm.session_date,
                start_time: assignForm.start_time,
                duration: Number(assignForm.duration),
                type: Number(assignForm.type),
            });
            toast.success('Đặt phòng thành công!');
            setShowAssignModal(false);
            setAssignForm({ session_id: '', room_id: '', session_date: '', start_time: '', duration: 90, type: '0' });
            setSelectedClassId('');
            setSessionsOfClass([]);
            fetchAll(selectedWeek);
        } catch (err) {
            toast.error(err?.error || 'Đặt phòng thất bại.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleApproveRequest = async (id, status) => {
        try {
            await api.patch(`/admin/scheduling/approve-request/${id}`, { status });
            toast.success(status === 1 ? 'Đã duyệt yêu cầu.' : 'Đã từ chối yêu cầu.');
            fetchAll(selectedWeek);
        } catch {
            toast.error('Xử lý thất bại.');
        }
    };

    const occupancyPct = stats ? Math.round((stats.occupancy_ratio || 0) * 100) : 0;
    const circumference = 2 * Math.PI * 56;
    const dashOffset = circumference - (occupancyPct / 100) * circumference;

    const weekLabel = () => {
        if (!weekDates.length) return '';
        const start = weekDates[0];
        const end = weekDates[4];
        const fmt = d => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
        return `Tuần ${start.getWeek ? start.getWeek() : ''}: ${fmt(start)} - ${fmt(end)}`;
    };

    return (
        <div className="px-8 pt-8 pb-12 bg-[#faf9fa] min-h-screen">
            <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <nav className="text-[10px] uppercase tracking-[0.1em] text-[#737784] mb-1">Admin / Lịch & Phòng học</nav>
                    <h2 className="text-3xl font-serif font-bold text-[#1a1c1d]">Quản lý Lịch & Phòng học</h2>
                </div>
                <button
                    onClick={() => setShowAssignModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#003686] text-white rounded-xl font-semibold text-sm hover:bg-[#094cb2] transition-colors shadow-sm"
                >
                    <span className="material-symbols-outlined text-lg">add</span>
                    Đặt phòng
                </button>
            </div>

            <div className="grid grid-cols-12 gap-6 mb-6">
                <div className="col-span-12 md:col-span-8 flex flex-col justify-end">
                    <div className="flex items-center gap-4 mb-2">
                        <button
                            onClick={() => setActiveTab('calendar')}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'calendar' ? 'bg-white text-[#003686] shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-white hover:shadow-sm'}`}
                        >
                            Lịch tuần
                        </button>
                        <button
                            onClick={() => setActiveTab('rooms')}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'rooms' ? 'bg-white text-[#003686] shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-white hover:shadow-sm'}`}
                        >
                            Trạng thái phòng học
                        </button>
                    </div>
                    {lastUpdated && (
                        <p className="text-slate-500 text-sm italic">Cập nhật lần cuối: {lastUpdated}, Hôm nay</p>
                    )}
                </div>
            </div>

            {activeTab === 'calendar' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,54,134,0.03)] p-6">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Tỉ lệ lấp đầy</h3>
                            <div className="flex justify-center py-2">
                                <div className="relative w-32 h-32 flex items-center justify-center">
                                    <svg className="w-full h-full -rotate-90">
                                        <circle className="text-slate-200" cx="64" cy="64" fill="transparent" r="56" stroke="currentColor" strokeWidth="8" />
                                        <circle
                                            className="text-[#003686] drop-shadow-[0_0_8px_rgba(0,99,154,0.3)]"
                                            cx="64" cy="64" fill="transparent" r="56"
                                            stroke="currentColor" strokeWidth="8"
                                            strokeDasharray={circumference}
                                            strokeDashoffset={dashOffset}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-2xl font-black text-[#1a1c1d]">{loading ? '—' : `${occupancyPct}%`}</span>
                                        <span className="text-[10px] text-slate-500 uppercase">Phòng học</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,54,134,0.03)] overflow-hidden">
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="text-sm font-bold text-[#1a1c1d]">Phòng học tiêu biểu</h3>
                            </div>
                            <div className="p-2">
                                {loading ? (
                                    <div className="p-4 text-center text-slate-400 text-xs">Đang tải...</div>
                                ) : rooms.slice(0, 4).length > 0 ? rooms.slice(0, 4).map(room => {
                                    const rs = ROOM_STATUS[room.status] || ROOM_STATUS[0];
                                    return (
                                        <div key={room.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${rs.dot} shadow-sm`} />
                                                <p className="text-sm font-bold text-[#434653]">{room.name}</p>
                                            </div>
                                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${rs.bg} ${rs.text}`}>{rs.label}</span>
                                        </div>
                                    );
                                }) : (
                                    <div className="p-4 text-center text-slate-400 text-xs">Chưa có phòng học</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-3">
                        <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,54,134,0.03)] overflow-hidden">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 px-6">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-base font-bold text-[#1a1c1d]">{weekLabel()}</h3>
                                    <div className="flex bg-slate-100 rounded-lg p-0.5">
                                        <button onClick={handlePrevWeek} className="p-1.5 hover:bg-white rounded transition-all">
                                            <span className="material-symbols-outlined text-lg text-slate-500">chevron_left</span>
                                        </button>
                                        <button onClick={handleNextWeek} className="p-1.5 hover:bg-white rounded transition-all">
                                            <span className="material-symbols-outlined text-lg text-slate-500">chevron_right</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-3 flex-wrap">
                                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                        <span className="w-3 h-3 rounded-sm bg-slate-100 border border-slate-200 inline-block"></span> Offline
                                    </span>
                                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                        <span className="w-3 h-3 rounded-sm bg-blue-100 border border-blue-200 inline-block"></span> Online
                                    </span>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse min-w-[600px]">
                                    <thead>
                                        <tr>
                                            <th className="p-4 bg-slate-50 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-100 w-20">Giờ</th>
                                            {weekDates.map((d, i) => (
                                                <th key={i} className="p-4 bg-slate-50 text-center border-r border-slate-100 last:border-r-0">
                                                    <p className="text-xs font-bold text-[#434653]">{['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6'][i]}</p>
                                                    <p className="text-[10px] text-slate-500">{`${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`}</p>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {TIME_SLOTS.map(slot => (
                                            <tr key={slot} className="border-t border-slate-100">
                                                <td className="p-3 text-[10px] font-bold text-slate-400 align-top border-r border-slate-100 w-20">{slot}</td>
                                                {weekDates.map((d, di) => {
                                                    const dateKey = dateToYmd(d);
                                                    const sessions = weekSessions[dateKey] || [];
                                                    const slotSessions = sessions.filter(s => formatTimeApi(s.start_time) === slot);
                                                    return (
                                                        <td key={di} className="p-1.5 align-top border-r border-slate-100 last:border-r-0 min-h-[80px]">
                                                            {slotSessions.map(session => {
                                                                const info = CLASS_TYPES[session.type] || CLASS_TYPES[0];
                                                                const isOnline = session.type === 1;
                                                                return (
                                                                    <div key={session.id} className={`rounded-lg p-2.5 mb-1 border-l-4 shadow-sm group cursor-pointer hover:shadow-md transition-shadow ${info.cardClass}`}>
                                                                        <div className="flex items-center justify-between mb-0.5">
                                                                            <p className="text-[11px] font-black leading-tight">{session.title}</p>
                                                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${info.dot.includes('blue') ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                                                                {info.label}
                                                                            </span>
                                                                        </div>
                                                                        <p className={`text-[10px] font-medium ${info.labelClass}`}>
                                                                            {session.teacher?.name}
                                                                            {isOnline ? (
                                                                                <span className="flex items-center gap-1">
                                                                                    <span className="material-symbols-outlined text-[10px]">videocam</span>
                                                                                    {session.room?.meeting_link ? 'Online' : session.room?.name || 'Online'}
                                                                                </span>
                                                                            ) : (
                                                                                <span className="flex items-center gap-1">
                                                                                    <span className="material-symbols-outlined text-[10px]">meeting_room</span>
                                                                                    {session.room?.name || '—'}
                                                                                </span>
                                                                            )}
                                                                        </p>
                                                                        <div className="mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1.5">
                                                                            <span className="material-symbols-outlined text-xs cursor-pointer opacity-60 hover:opacity-100">edit</span>
                                                                            <span className="material-symbols-outlined text-xs cursor-pointer opacity-60 hover:opacity-100">swap_horiz</span>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'rooms' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-1">
                        <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,54,134,0.03)] p-6">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Tỉ lệ lấp đầy</h3>
                            <div className="flex justify-center py-2">
                                <div className="relative w-32 h-32 flex items-center justify-center">
                                    <svg className="w-full h-full -rotate-90">
                                        <circle className="text-slate-200" cx="64" cy="64" fill="transparent" r="56" stroke="currentColor" strokeWidth="8" />
                                        <circle className="text-[#003686]" cx="64" cy="64" fill="transparent" r="56" stroke="currentColor" strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-2xl font-black text-[#1a1c1d]">{loading ? '—' : `${occupancyPct}%`}</span>
                                        <span className="text-[10px] text-slate-500 uppercase">Phòng học</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {stats && (
                            <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,54,134,0.03)] p-5 mt-4">
                                <div className="space-y-3">
                                    {[
                                        { label: 'Tổng phòng', value: stats.total_rooms, color: '#434653' },
                                        { label: 'Đang sử dụng', value: stats.in_use, color: '#003686' },
                                        { label: 'Trống', value: stats.empty, color: '#16a34a' },
                                        { label: 'Bảo trì', value: stats.maintenance, color: '#dc2626' },
                                    ].map(item => (
                                        <div key={item.label} className="flex justify-between items-center">
                                            <span className="text-xs text-slate-500">{item.label}</span>
                                            <span className="text-sm font-bold" style={{ color: item.color }}>{item.value ?? '—'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,54,134,0.03)] overflow-hidden">
                            <div className="p-5 border-b border-slate-100">
                                <h3 className="text-sm font-bold text-[#1a1c1d]">Danh sách phòng học</h3>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {loading ? (
                                    <div className="p-8 text-center text-slate-400 text-sm">Đang tải...</div>
                                ) : rooms.length === 0 ? (
                                    <div className="p-8 text-center text-slate-400 text-sm">Chưa có dữ liệu phòng học.</div>
                                ) : rooms.map(room => {
                                    const rs = ROOM_STATUS[room.status] || ROOM_STATUS[0];
                                    return (
                                        <div key={room.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-3 h-3 rounded-full ${rs.dot} shadow-sm`} />
                                                <div>
                                                    <p className="text-sm font-bold text-[#434653]">{room.name}</p>
                                                    <p className="text-[10px] text-slate-400">{room.status_label}</p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${rs.bg} ${rs.text}`}>{rs.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,54,134,0.03)] p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h4 className="text-sm font-bold text-[#1a1c1d]">Thông báo hệ thống</h4>
                        <span className="text-[#003686] text-xs font-bold cursor-pointer">Xem tất cả</span>
                    </div>
                    <div className="space-y-3">
                        {requests.length === 0 ? (
                            <div className="text-center py-6 text-slate-400 text-sm">Không có thông báo nào.</div>
                        ) : requests.map(req => (
                            <div key={req.id} className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-blue-600 text-xl">info</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-[#434653]">{req.type_label || 'Yêu cầu đổi lịch'}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {req.user?.name} yêu cầu đổi phòng từ {req.old_room?.name} sang {req.new_room?.name}
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{req.created_at}</p>
                                    <div className="mt-2 flex gap-3">
                                        <button onClick={() => handleApproveRequest(req.id, 1)} className="text-[10px] font-bold text-green-600 uppercase tracking-wider hover:underline">Chấp nhận</button>
                                        <button onClick={() => handleApproveRequest(req.id, 2)} className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:underline">Từ chối</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <CustomModal
                open={showAssignModal}
                onClose={() => {
                    setShowAssignModal(false);
                    setAssignForm({ session_id: '', room_id: '', session_date: '', start_time: '', duration: 90, type: '0' });
                    setSelectedClassId('');
                    setSessionsOfClass([]);
                }}
                title="Đặt phòng học"
                onOk={handleAssignSubmit}
                okText="Đặt phòng"
                cancelText="Hủy"
                confirmLoading={submitLoading}
            >
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Chọn lớp học</label>
                        <select
                            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-[#434653] bg-white focus:outline-none focus:ring-2 focus:ring-[#003686]/30 focus:border-[#003686] transition-colors"
                            value={selectedClassId}
                            onChange={e => handleClassChange(e.target.value)}
                        >
                            <option value="">— Chọn lớp học —</option>
                            {MOCK_CLASSES.map(c => (
                                <option key={c.id} value={c.id}>{c.name} ({c.course_name})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Chọn buổi học</label>
                        <select
                            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-[#434653] bg-white focus:outline-none focus:ring-2 focus:ring-[#003686]/30 focus:border-[#003686] transition-colors disabled:opacity-50"
                            value={assignForm.session_id}
                            onChange={e => setAssignForm(prev => ({ ...prev, session_id: e.target.value }))}
                            disabled={!selectedClassId}
                        >
                            <option value="">{selectedClassId ? '— Chọn buổi học —' : 'Chọn lớp trước'}</option>
                            {sessionsOfClass.map(s => (
                                <option key={s.id} value={s.id}>{s.title}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Chọn phòng</label>
                        <select
                            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-[#434653] bg-white focus:outline-none focus:ring-2 focus:ring-[#003686]/30 focus:border-[#003686] transition-colors"
                            value={assignForm.room_id}
                            onChange={e => setAssignForm(prev => ({ ...prev, room_id: e.target.value }))}
                        >
                            <option value="">— Chọn phòng —</option>
                            {rooms.map(r => (
                                <option key={r.id} value={r.id}>{r.name} ({r.status_label || '—'})</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Ngày học</label>
                            <input
                                type="date"
                                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-[#434653] bg-white focus:outline-none focus:ring-2 focus:ring-[#003686]/30 focus:border-[#003686] transition-colors"
                                value={assignForm.session_date}
                                min={dateToYmd(new Date())}
                                onChange={e => setAssignForm(prev => ({ ...prev, session_date: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Giờ bắt đầu</label>
                            <input
                                type="time"
                                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-[#434653] bg-white focus:outline-none focus:ring-2 focus:ring-[#003686]/30 focus:border-[#003686] transition-colors"
                                value={assignForm.start_time}
                                onChange={e => setAssignForm(prev => ({ ...prev, start_time: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Thời lượng</label>
                            <select
                                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-[#434653] bg-white focus:outline-none focus:ring-2 focus:ring-[#003686]/30 focus:border-[#003686] transition-colors"
                                value={assignForm.duration}
                                onChange={e => setAssignForm(prev => ({ ...prev, duration: Number(e.target.value) }))}
                            >
                                <option value={30}>30 phút</option>
                                <option value={45}>45 phút</option>
                                <option value={60}>60 phút</option>
                                <option value={90}>90 phút</option>
                                <option value={120}>120 phút</option>
                                <option value={150}>150 phút</option>
                                <option value={180}>180 phút</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Loại buổi</label>
                            <select
                                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-[#434653] bg-white focus:outline-none focus:ring-2 focus:ring-[#003686]/30 focus:border-[#003686] transition-colors"
                                value={assignForm.type}
                                onChange={e => setAssignForm(prev => ({ ...prev, type: e.target.value }))}
                            >
                                <option value="0">Offline</option>
                                <option value="1">Online</option>
                            </select>
                        </div>
                    </div>
                </div>
            </CustomModal>
        </div>
    );
}