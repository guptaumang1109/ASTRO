import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [state, setState] = useState("login"); // "login" | "register" | "forgot"
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { axios, fetchUser, setUser } = useAppContext();

  // FUNCTION FOR API CALL FOR LOGIN, SIGNUP, OR FORGOT PASSWORD
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setLoading(false);
      return toast.error("Please enter a valid email address.");
    }

    try {
      if (state === 'login') {
        const { data } = await axios.post('/api/user/login', {
          email: formData.email,
          password: formData.password
        });
        if (data.success) {
          if (data.data?.user || data.user) {
            setUser(data.data?.user || data.user);
          } else {
            await fetchUser();
          }
          toast.success(data.message || "Logged in successfully!");
        } else {
          toast.error(data.message);
        }
      } else if (state === 'register') {
        const { data } = await axios.post('/api/user/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        if (data.success) {
          toast.success(data.message || "Registration successful! Please login.");
          setState("login");
          setFormData({ name: '', email: '', password: '' });
        } else {
          toast.error(data.message);
        }
      } else if (state === 'forgot') {
        const { data } = await axios.post('/api/user/forgot-password', {
          email: formData.email
        });
        if (data.success) {
          toast.success(data.message || "Password reset link sent to your email!");
          setState("login");
          setFormData({ name: '', email: '', password: '' });
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      const resData = error.response?.data;
      let errorMsg = error.message;
      if (typeof resData?.message === 'string' && resData.message) {
        errorMsg = resData.message;
      } else if (Array.isArray(resData?.errors) && resData.errors.length > 0) {
        const firstErr = resData.errors[0];
        errorMsg = typeof firstErr === 'string' ? firstErr : Object.values(firstErr)[0] || error.message;
      }
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'email' ? value.toLowerCase() : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-[#0F172A] dark:text-[#E6EDF3] rounded-2xl shadow-xl border border-[#E2E8F0] dark:border-[#30363D] bg-white dark:bg-[#161B22] transition-colors duration-300">
      <h1 className="text-[#0F172A] dark:text-[#E6EDF3] text-3xl mt-6 font-semibold">
        {state === "login" ? "Login" : state === "register" ? "Sign up" : "Reset Password"}
      </h1>
      <p className="text-sm font-normal text-[#64748B] dark:text-[#8B949E]">
        {state === "login"
          ? "Please sign in to continue"
          : state === "register"
          ? "Create an account to get started"
          : "Enter your email to receive a reset link"}
      </p>

      {state === "register" && (
        <div className="flex items-center mt-2 w-full bg-[#F1F5F9] dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#30363D] h-12 rounded-full overflow-hidden pl-6 gap-2 transition-colors focus-within:border-[#06B6D4]/60">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round opacity-60"><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" /></svg>
          <input type="text" name="name" placeholder="Full Name" className="border-none outline-none ring-0 w-full bg-transparent text-[#0F172A] dark:text-[#E6EDF3] placeholder:text-[#64748B] dark:placeholder:text-[#8B949E]" value={formData.name} onChange={handleChange} required />
        </div>
      )}

      <div className="flex items-center w-full mt-2 bg-[#F1F5F9] dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#30363D] h-12 rounded-full overflow-hidden pl-6 gap-2 transition-colors focus-within:border-[#06B6D4]/60">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail opacity-60"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /><rect x="2" y="4" width="20" height="16" rx="2" /></svg>
        <input type="email" name="email" placeholder="Email Address" className="border-none outline-none ring-0 w-full bg-transparent text-[#0F172A] dark:text-[#E6EDF3] placeholder:text-[#64748B] dark:placeholder:text-[#8B949E] lowercase" value={formData.email} onChange={handleChange} required />
      </div>

      {state !== "forgot" && (
        <div className="flex items-center mt-2 w-full bg-[#F1F5F9] dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#30363D] h-12 rounded-full overflow-hidden pl-6 gap-2 transition-colors focus-within:border-[#06B6D4]/60">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock opacity-60"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          <input type="password" name="password" placeholder="Password" className="border-none outline-none ring-0 w-full bg-transparent text-[#0F172A] dark:text-[#E6EDF3] placeholder:text-[#64748B] dark:placeholder:text-[#8B949E]" value={formData.password} onChange={handleChange} required />
        </div>
      )}

      {state === "login" && (
        <div className="mt-1 text-left text-[#06B6D4] hover:text-[#6366F1] transition-colors cursor-pointer w-full">
          <button className="text-sm outline-none cursor-pointer" type="button" onClick={() => setState("forgot")}>Forgot password?</button>
        </div>
      )}

      <button type="submit" disabled={loading} className="mt-2 w-full h-11 rounded-full text-white bg-gradient-to-r from-[#06B6D4] to-[#6366F1] hover:brightness-110 transition-all py-2 font-medium shadow-lg shadow-[#06B6D4]/20 cursor-pointer disabled:opacity-50">
        {loading ? "Processing..." : state === "login" ? "Login" : state === "register" ? "Sign up" : "Send Reset Link"}
      </button>

      {state === "forgot" ? (
        <p onClick={() => { setState("login"); setFormData({ name: '', email: '', password: '' }); }} className="text-[#64748B] dark:text-[#8B949E] text-sm mt-3 mb-6 cursor-pointer text-center w-full">
          Remember your password? <span className="text-[#06B6D4] hover:text-[#6366F1] hover:underline transition-colors">Back to login</span>
        </p>
      ) : (
        <p onClick={() => {
          setState(prev => prev === "login" ? "register" : "login");
          setFormData({ name: '', email: '', password: '' });
        }} className="text-[#64748B] dark:text-[#8B949E] text-sm mt-3 mb-6 cursor-pointer text-center w-full">
          {state === "login" ? "Don't have an account?" : "Already have an account?"} <span className="text-[#06B6D4] hover:text-[#6366F1] hover:underline transition-colors">click here</span>
        </p>
      )}
    </form>
  );
};

export default Login;
