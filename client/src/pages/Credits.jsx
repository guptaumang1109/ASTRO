import { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Credits = () => {

  const [plans,setPlans] = useState([]);
  const [loading,setLoading] = useState(true);
  const {axios} = useAppContext();

  //FUNCTION FOR API CALL TO FETCH PLAN DETAILS
  const fetchPlans = async() => {
    try {
      const {data} = await axios.get('/api/credit/plan')

      if(data.success){
        setPlans(data.plans)
      }
      else{
        toast.error(data.message ||'Failed to fetch plans');
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  }

  const purchasePlan = async(planId) => {
    try {
      const {data} = await axios.post('/api/credit/purchase' , {planId})
      if(data.success){
        window.location.href = data.url ;
      }
      else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(()=>{
    fetchPlans();
  },[])

  if(loading) return <Loader/>

  return (
    <div className='max-w-7xl h-screen overflow-y-scroll mx-auto px-4 sm:px-6
    lg:px-8 py-12 text-[#0F172A] dark:text-[#E6EDF3] transition-colors duration-300'>
      <h2 className='text-3xl font-semibold text-center mb-10 xl:mt-24 
      text-[#0F172A] dark:text-[#E6EDF3]'>Credit Plans</h2>

      <div className='flex flex-wrap justify-center gap-8'>
        {plans.map((plan) => (
          <div key={plan._id || plan.name} className={`border rounded-xl shadow-md hover:shadow-xl
          transition-all p-6 min-w-[300px] flex flex-col ${plan._id === 'pro' || plan.name?.toLowerCase().includes('pro') ? 
          "bg-white dark:bg-[#161B22] border-2 border-[#06B6D4] shadow-lg shadow-[#06B6D4]/10" : "bg-white dark:bg-[#161B22] border-[#E2E8F0] dark:border-[#30363D]"}`}>
            <div className='flex-1'>
              <h3 className='text-xl font-semibold text-[#0F172A] dark:text-[#E6EDF3] 
              mb-2'>{plan.name}</h3>
              <p className='text-3xl font-bold text-[#06B6D4] 
              mb-4'>${plan.price}
                <span className='text-base font-normal text-[#64748B] dark:text-[#8B949E]'>{' '}/ {plan.credits} credits</span>
              </p>
              <ul className='list-disc list-inside text-sm text-[#64748B] dark:text-[#8B949E] space-y-1.5'>
                {plan.features.map((feature , index)=>(
                  <li key={index} className="text-[#0F172A] dark:text-[#E6EDF3]">{feature}</li>
                ))}
              </ul>
            </div>
            <button onClick={() => toast.promise(purchasePlan(plan._id) , 
            {loading : "Processing..."})} className='mt-6 bg-gradient-to-r from-[#06B6D4] to-[#6366F1] hover:brightness-110 
            text-white font-medium py-2.5 rounded-lg 
            transition-all shadow-md shadow-[#06B6D4]/10 cursor-pointer'>Buy Now</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Credits
