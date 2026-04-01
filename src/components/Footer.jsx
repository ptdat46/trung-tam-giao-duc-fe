export default function Footer() {
  return (
    <footer className="w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto bg-stone-100 dark:bg-stone-900 border-t-0">
      <div className="mb-6 md:mb-0">
        <span className="font-headline font-bold text-slate-800 dark:text-slate-200">Nam Thái</span>
        <p className="text-slate-500 dark:text-slate-400 font-body text-sm tracking-wide mt-2">
          © 2026 Trung tâm bồi dưỡng kiến thức Nam Thái. All rights reserved.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-8">
        <a
          className="text-slate-500 dark:text-slate-400 font-body text-sm tracking-wide hover:text-blue-700 dark:hover:text-blue-300 transition-opacity duration-200"
          href="#"
        >
          Chính sách bảo mật
        </a>
        <a
          className="text-slate-500 dark:text-slate-400 font-body text-sm tracking-wide hover:text-blue-700 dark:hover:text-blue-300 transition-opacity duration-200"
          href="#"
        >
          Các điều khoản dịch vụ
        </a>
        <a
          className="text-slate-500 dark:text-slate-400 font-body text-sm tracking-wide hover:text-blue-700 dark:hover:text-blue-300 transition-opacity duration-200"
          href="#"
        >
          Trung tâm hỗ trợ
        </a>
      </div>
    </footer>
  )
}
