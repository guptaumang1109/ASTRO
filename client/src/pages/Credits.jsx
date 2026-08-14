import { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import toast from 'react-hot-toast';

const Credits = ({ setIsMenuOpen }) => {

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { axios, theme } = useAppContext();

  //FUNCTION FOR API CALL TO FETCH PLAN DETAILS
  const fetchPlans = async () => {
    try {
      const { data } = await axios.get('/api/credit/plan');

      if (data.success) {
        setPlans(data.plans);
      }
      else {
        toast.error(data.message || 'Failed to fetch plans');
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const [buyingPlan, setBuyingPlan] = useState(null);

  const purchasePlan = async (planId) => {
    try {
      setBuyingPlan(planId);
      const { data } = await axios.post('/api/credit/purchase', { planId });
      if (data.success) {
        window.location.href = data.url;
      }
      else {
        toast.error(data.message);
        setBuyingPlan(null);
      }
    } catch (error) {
      toast.error(error.message);
      setBuyingPlan(null);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className='flex flex-col h-full min-h-0'>
      {/* MOBILE HEADER */}
      <div className="flex items-center gap-3 px-4 py-3 md:hidden shrink-0 border-b border-[#E2E8F0] dark:border-[#30363D]">
        <img
          src={assets.menu_icon}
          className="w-6 h-6 cursor-pointer not-dark:invert"
          onClick={() => setIsMenuOpen(true)}
          alt="Open menu"
        />
        <img
          src={theme === 'dark' ? assets.logo_full_dark : assets.logo_full}
          className="w-24 h-auto"
          alt="Astro Logo"
        />
      </div>

      <div className='flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-[#0F172A] dark:text-[#E6EDF3] transition-colors duration-300'>
        <h2 className='text-2xl sm:text-3xl font-semibold text-center mb-8 sm:mb-10 md:mt-8 xl:mt-16 
        text-[#0F172A] dark:text-[#E6EDF3]'>Credit Plans</h2>

        <div className='flex flex-wrap justify-center gap-5 sm:gap-8 max-w-7xl mx-auto pb-6'>
          {plans.map((plan) => (
            <div key={plan._id || plan.name} className={`border rounded-xl shadow-md hover:shadow-xl
            transition-all p-5 sm:p-6 w-full max-w-sm sm:min-w-[300px] sm:w-auto flex flex-col ${plan._id === 'pro' || plan.name?.toLowerCase().includes('pro') ?
            "bg-white dark:bg-[#161B22] border-2 border-[#06B6D4] shadow-lg shadow-[#06B6D4]/10" : "bg-white dark:bg-[#161B22] border-[#E2E8F0] dark:border-[#30363D]"}`}>
              <div className='flex-1'>
                <h3 className='text-xl font-semibold text-[#0F172A] dark:text-[#E6EDF3] 
                mb-2'>{plan.name}</h3>
                <p className='text-3xl font-bold text-[#06B6D4] 
                mb-4'>${plan.price}
                  <span className='text-base font-normal text-[#64748B] dark:text-[#8B949E]'>{' '}/ {plan.credits} credits</span>
                </p>
                <ul className='list-disc list-inside text-sm text-[#64748B] dark:text-[#8B949E] space-y-1.5'>
                  {plan.features.map((feature, index) => (
                    <li key={index} className="text-[#0F172A] dark:text-[#E6EDF3]">{feature}</li>
                  ))}
                </ul>
              </div>
              <button
                disabled={buyingPlan === plan._id}
                onClick={() => purchasePlan(plan._id)}
                className='mt-6 bg-gradient-to-r from-[#06B6D4] to-[#6366F1] hover:brightness-110 
              text-white font-medium py-2.5 rounded-lg 
              transition-all shadow-md shadow-[#06B6D4]/10 cursor-pointer disabled:opacity-60'>
                {buyingPlan === plan._id ? "Processing..." : "Buy Now"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Credits;
