import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

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
    <Loader 
      fullScreen={true} 
      text={searchParams.get('session_id') ? 'Verifying payment...' : 'Loading...'} 
    />
  );
};

export default Loading;
