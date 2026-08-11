import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { axios } = useAppContext();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`/api/user/reset-password/${token}`, { newPassword });
      if (data.success) {
        toast.success(data.message || "Password reset successfully!");
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0D1117] text-[#E6EDF3] flex items-center justify-center h-screen w-screen">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-[#E6EDF3] rounded-2xl shadow-2xl border border-[#30363D] bg-[#161B22]">
        <h1 className="text-[#E6EDF3] text-3xl mt-4 font-semibold">Reset Password</h1>
        <p className="text-sm text-[#8B949E]">Enter your new password below</p>

        <div className="flex items-center mt-2 w-full bg-[#0D1117] border border-[#30363D] h-12 rounded-full overflow-hidden pl-6 gap-2 transition-colors focus-within:border-[#06B6D4]/60">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8B949E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          <input
            type="password"
            placeholder="New Password"
            className="border-none outline-none ring-0 w-full bg-transparent text-[#E6EDF3] placeholder-[#8B949E]"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center mt-2 w-full bg-[#0D1117] border border-[#30363D] h-12 rounded-full overflow-hidden pl-6 gap-2 transition-colors focus-within:border-[#06B6D4]/60">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8B949E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          <input
            type="password"
            placeholder="Confirm New Password"
            className="border-none outline-none ring-0 w-full bg-transparent text-[#E6EDF3] placeholder-[#8B949E]"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full h-11 rounded-full text-white bg-gradient-to-r from-[#06B6D4] to-[#6366F1] hover:brightness-110 transition-all py-2 font-medium shadow-lg shadow-[#06B6D4]/20 cursor-pointer disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
