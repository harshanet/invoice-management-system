import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import Toast from '../components/Toast';

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
  </svg>
);

const PASSWORD_RULES = [
  { label: 'Uppercase letter',                test: (p) => /[A-Z]/.test(p) },
  { label: 'Lowercase letter',                test: (p) => /[a-z]/.test(p) },
  { label: 'Number',                          test: (p) => /\d/.test(p) },
  { label: 'Special character (e.g. !?<>@#$%)', test: (p) => /[!?<>@#$%^&*()_+\-=[\]{};':"\\|,./`~]/.test(p) },
  { label: '8 characters or more',            test: (p) => p.length >= 8 },
];

const PasswordChecklist = ({ password }) => (
  <ul className="mt-3 flex flex-col gap-1.5">
    {PASSWORD_RULES.map(({ label, test }) => {
      const met = password.length > 0 && test(password);
      return (
        <li key={label} className="flex items-center gap-2 text-sm">
          {met ? (
            <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <span className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0 inline-block" />
          )}
          <span className={met ? 'text-green-600 font-medium' : 'text-gray-500'}>{label}</span>
        </li>
      );
    })}
  </ul>
);

const LeftPanel = () => (
  <div className="hidden lg:flex lg:w-5/12 bg-[#151929] relative overflow-hidden flex-col p-10 text-white min-h-screen">
    <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-indigo-600/10" />
    <div className="absolute top-16 -right-12 w-56 h-56 rounded-full bg-indigo-600/10" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-900/20" />
    <div className="flex items-center gap-2 z-10">
      <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
        <div className="w-3 h-3 bg-white rounded-sm" />
      </div>
      <span className="font-bold text-lg">LearnLib</span>
    </div>
    <div className="my-auto z-10">
      <h1 className="text-4xl font-bold leading-tight mb-4">
        Your gateway to<br />curated learning.
      </h1>
      <p className="text-gray-400 text-sm mb-10">
        Browse thousands of resources across<br />programming, design, data science & more.
      </p>
      <div className="flex flex-col gap-3">
        {['1,000+ resources', 'Free to browse', 'Personalized bookmarks'].map((f) => (
          <div key={f} className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-full w-fit">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-sm text-gray-200">{f}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Register = () => {
  const [formData, setFormData]         = useState({ name: '', email: '', password: '' });
  const [errors, setErrors]             = useState({});
  const [touched, setTouched]           = useState({});
  const [bannerError, setBannerError]   = useState('');
  const [loading, setLoading]           = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const set = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

  const validate = (data) => {
    const errs = {};
    if (!data.name) errs.name = 'Full name is required';
    if (!data.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(data.email)) errs.email = 'Enter a valid email address';
    if (!data.password) errs.password = 'Password is required';
    else if (!PASSWORD_RULES.every(({ test }) => test(data.password)))
      errs.password = 'Password does not meet all requirements';
    return errs;
  };

  const handleBlur = (key) => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(validate(formData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(formData);
    setErrors(errs);
    setTouched({ name: true, email: true, password: true });
    if (Object.keys(errs).length) return;

    setLoading(true);
    setBannerError('');
    try {
      await axiosInstance.post('/api/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setBannerError('Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (key) =>
    `w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:border-transparent ${
      touched[key] && errors[key]
        ? 'border-red-400 focus:ring-red-300'
        : 'border-gray-200 focus:ring-indigo-400'
    }`;

  const labelClass = (key) =>
    `text-sm font-medium block mb-1.5 ${touched[key] && errors[key] ? 'text-red-500' : 'text-gray-700'}`;

  return (
    <div className="min-h-screen flex">
      <LeftPanel />

      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
            <Link to="/login" className="flex-1 text-sm text-gray-500 py-2 text-center hover:text-gray-700">Login</Link>
            <span className="flex-1 text-sm font-semibold py-2 text-center bg-white rounded-lg shadow text-gray-800">Register</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h2>
          <p className="text-sm text-gray-500 mb-6">Join thousands of learners today.</p>

          {bannerError && (
            <Toast title="Sign up failed" message={bannerError} onClose={() => setBannerError('')} />
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className={labelClass('name')}>Full name</label>
              <input
                type="text"
                value={formData.name}
                onChange={set('name')}
                onBlur={() => handleBlur('name')}
                placeholder="Your name"
                className={inputClass('name')}
              />
              {touched.name && errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className={labelClass('email')}>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={set('email')}
                onBlur={() => handleBlur('email')}
                placeholder="you@example.com"
                className={inputClass('email')}
              />
              {touched.email && errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className={labelClass('password')}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={set('password')}
                  onBlur={() => handleBlur('password')}
                  placeholder="••••••••"
                  className={inputClass('password') + ' pr-11'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
              {formData.password.length > 0 && (
                <PasswordChecklist password={formData.password} />
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 mt-1"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
