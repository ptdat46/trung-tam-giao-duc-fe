import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

// Map role -> heading title
const HEADING_TITLES = {
  admin: { title: 'Đăng nhập Quản trị', subtitle: 'Vui lòng đăng nhập để quản lý hệ thống.' },
  teacher: { title: 'Đăng nhập Giáo viên', subtitle: 'Vui lòng đăng nhập để quản lý lớp học.' },
  student: { title: 'Chào mừng bạn trở lại', subtitle: 'Vui lòng đăng nhập để tiếp tục việc học của bạn.' },
};

// Redirect paths after successful login per role
const REDIRECT_PATHS = {
  admin: '/admin/dashboard',
  teacher: '/teacher/dashboard',
  student: '/student/dashboard',
};

export default function LoginPage({ role = 'student' }) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const heading = HEADING_TITLES[role] || HEADING_TITLES.student;
  const redirectPath = REDIRECT_PATHS[role] || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setErrors({});
    setLoading(true);

    const result = await login(email, password, role);

    if (result.success) {
      navigate(redirectPath);
    } else {
      if (result.errors) {
        setErrors(result.errors);
        setError(result.message || 'Đăng nhập thất bại');
      } else {
        setError(result.message || 'Đăng nhập thất bại');
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-body text-on-background">
      <main className="flex-grow flex items-center justify-center relative overflow-hidden px-4 py-12">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0 academic-overlay opacity-10" />
        <div className="absolute inset-0 z-0 bg-gradient-to-tr from-surface-container via-transparent to-primary-fixed-dim opacity-30" />

        {/* Auth Container */}
        <div className="relative z-10 w-full max-w-[1000px] grid md:grid-cols-2 bg-surface-container-lowest shadow-2xl rounded-xl overflow-hidden">
          {/* Left Side: Visual/Branding */}
          <div className="hidden md:flex flex-col justify-between p-12 bg-primary relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <img
                alt="Branding Image"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9p7AI-uKgCOMBUrHnQfKIHrNREGlIenb0xJ4xDRypocRUIed0CWNAPoQ-hAl5IAHGyThZRrsBGxu3TK3ocP_D6dMR4jOQL-tS_7QQf2Q6JaUJLOUoWPxO_eo0AMfdA6B9uinJAQYFrom9yJgDympiDAp-AQi45EozeZORZlnYyPIFXvD_HRkPGLnGCzvpoTuED7lZrWWIuOm3Nc1iow7HyECIHMOY3cv1dR8cnshVo6cfD4J7PMKsRBpgrWSf1pdqLieCWVXWVQ"
              />
            </div>
            <div className="relative z-10">
              <h1 className="font-headline text-4xl font-bold text-on-primary-container leading-tight">Nam Thái</h1>
              <p className="font-label mt-4 text-primary-fixed-dim tracking-wider uppercase text-xs">Trung tâm bồi dưỡng kiến thức</p>
            </div>
            <div className="relative z-10">
              <h2 className="font-headline text-3xl text-white leading-snug">Khám phá tri thức cùng Nam Thái</h2>
              <p className="mt-4 text-on-primary-container opacity-80 text-sm leading-relaxed max-w-xs">
                Hành trình chinh phục đỉnh cao tri thức bắt đầu từ những bước chân vững chắc nhất tại môi trường giáo dục chuyên nghiệp.
              </p>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
            {/* Heading */}
            <div className="mb-8 text-center md:text-left">
              <h2 className="font-headline text-2xl font-bold text-on-surface mb-2">{heading.title}</h2>
              <p className="text-secondary font-body text-sm">{heading.subtitle}</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-4 p-3 bg-error-container text-on-error-container text-sm rounded-lg">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="block font-label text-xs font-semibold text-outline tracking-wider uppercase">
                  Gmail
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                    mail
                  </span>
                  <input
                    className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg transition-all font-body text-sm outline-none ${
                      errors.email
                        ? 'border-error focus:border-error focus:ring-1 focus:ring-error'
                        : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary'
                    }`}
                    placeholder="example@gmail.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-error mt-1">{errors.email[0]}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block font-label text-xs font-semibold text-outline tracking-wider uppercase">
                    Mật khẩu
                  </label>
                  <a className="text-xs text-primary font-medium hover:underline" href="#">
                    Quên mật khẩu?
                  </a>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                    lock
                  </span>
                  <input
                    className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg transition-all font-body text-sm outline-none ${
                      errors.password
                        ? 'border-error focus:border-error focus:ring-1 focus:ring-error'
                        : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary'
                    }`}
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-error mt-1">{errors.password[0]}</p>
                )}
              </div>

              {/* Remember Checkbox */}
              <div className="flex items-center">
                <input
                  className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary"
                  id="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  disabled={loading}
                />
                <label className="ml-2 text-sm text-secondary font-body" htmlFor="remember">
                  Ghi nhớ đăng nhập
                </label>
              </div>

              {/* Submit Button */}
              <button
                className={`w-full py-3 bg-gradient-to-r from-primary to-primary-container text-white font-label font-bold rounded-lg shadow-md transition-all ${
                  loading
                    ? 'opacity-70 cursor-not-allowed'
                    : 'hover:shadow-lg active:scale-[0.98]'
                }`}
                type="submit"
                disabled={loading}
              >
                {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP'}
              </button>
            </form>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
