import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Loading = () => {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { fetchUser, axios } = useAppContext();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    const verifyAndRedirect = async () => {
      if (sessionId) {
        try {
          const { data } = await axios.post('/api/credit/verify', { sessionId });
          if (data.success) {
            toast.success(data.message || 'Payment verified successfully!');
          } else {
            toast.error(data.message || 'Failed to verify payment');
          }
        } catch (error) {
          console.error("Payment verification error:", error);
        }
      }
      await fetchUser();
      navigate('/');
    };

    verifyAndRedirect();
  }, []);

  return (
    <div className='bg-[#F8FAFC] dark:bg-[#0D1117] flex flex-col items-center justify-center h-screen w-screen
    text-[#0F172A] dark:text-[#E6EDF3] transition-colors duration-300'>
      <div className='w-12 h-12 rounded-full border-4 border-[#06B6D4]/20 
      border-t-[#06B6D4] border-r-[#6366F1] animate-spin mb-4'></div>
      {searchParams.get('session_id') && (
        <p className='text-sm text-[#64748B] dark:text-[#8B949E] animate-pulse font-medium'>
          Verifying payment...
        </p>
      )}
    </div>
  )
}

export default Loading
