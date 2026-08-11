import { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Community = () => {

  const {axios} = useAppContext()
  const [images,setImages] = useState([]);
  const [loading,setLoading] = useState(true);

  const fetchImages = async() => {
    try {
      const {data} = await axios.get('/api/user/published-image');
      if(data.success){
        setImages(data.images || []);
      }
      else{
        toast.error(data.message || "Failed to load community images");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchImages()
  },[])

  if(loading) return <Loader/>

  return (
    <div className='p-6 pt-12 xl:px-12 2xl:px-20 w-full mx-auto h-full
    overflow-y-scroll text-[#0F172A] dark:text-[#E6EDF3] transition-colors duration-300'>
      <h2 className='text-2xl font-semibold mb-6 text-[#0F172A] dark:text-[#E6EDF3]'>Community Images</h2>

      {images.length > 0 ? (
        <div className='flex flex-wrap max-sm:justify-center gap-5'>
          {images.map((item,index)=>(
            <a target="_blank" key={index} href={item.imageUrl} className='relative group block rounded-xl overflow-hidden 
            border border-[#E2E8F0] dark:border-[#30363D] hover:border-[#06B6D4] bg-white dark:bg-[#161B22] shadow-sm hover:shadow-lg
            transition-all duration-300'>
              <img src={item.imageUrl} alt="" 
              className='w-full h-40 md:h-50 2xl:h-62 object-cover group-hover:scale-105 
              transition-transform duration-300 ease-in-out'/>
              <p className='absolute bottom-0 right-0 text-xs bg-black/70 backdrop-blur 
              text-[#E6EDF3] px-4 py-1.5 rounded-tl-xl opacity-0
              group-hover:opacity-100 transition duration-300'>Created by {item.userName}</p>
            </a>
          ))}
        </div>
      ) : (
        <p className='text-center text-[#64748B] dark:text-[#8B949E]
        mt-10'>No Images Available</p>
      )}
    </div>
  )
}

export default Community
