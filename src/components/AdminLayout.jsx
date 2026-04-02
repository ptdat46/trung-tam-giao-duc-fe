import AdminSidebar from './AdminSidebar';
import AdminTopBar from './AdminTopBar';

export default function AdminLayout({ children, activeItem = 'Tổng quan' }) {
    return (
        <div className="flex h-screen overflow-hidden bg-[#faf9fa]">
            <AdminSidebar activeItem={activeItem} />
            <div className="flex-1 ml-64 flex flex-col h-full overflow-hidden">
                <AdminTopBar />
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}