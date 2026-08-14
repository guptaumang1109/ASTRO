import { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import toast from 'react-hot-toast';

const Community = ({ setIsMenuOpen }) => {

  const { axios, theme } = useAppContext();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {
    try {
      const { data } = await axios.get('/api/user/published-image');
      if (data.success) {
        setImages(data.images || []);
      }
      else {
        toast.error(data.message || "Failed to load community images");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
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

      <div className='flex-1 overflow-y-auto px-4 py-6 sm:p-6 sm:pt-8 md:pt-10 xl:px-12 2xl:px-20 w-full text-[#0F172A] dark:text-[#E6EDF3] transition-colors duration-300'>
        <h2 className='text-xl sm:text-2xl font-semibold mb-5 sm:mb-6 text-[#0F172A] dark:text-[#E6EDF3]'>Community Images</h2>

        {images.length > 0 ? (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5 pb-6'>
            {images.map((item, index) => (
              <a target="_blank" key={index} href={item.imageUrl} className='relative group block rounded-xl overflow-hidden 
              border border-[#E2E8F0] dark:border-[#30363D] hover:border-[#06B6D4] bg-white dark:bg-[#161B22] shadow-sm hover:shadow-lg
              transition-all duration-300'>
                <img src={item.imageUrl} alt=""
                  className='w-full h-32 sm:h-40 md:h-44 lg:h-48 2xl:h-56 object-cover group-hover:scale-105 
                transition-transform duration-300 ease-in-out' />
                <p className='absolute bottom-0 right-0 text-xs bg-black/70 backdrop-blur 
                text-[#E6EDF3] px-3 py-1 sm:px-4 sm:py-1.5 rounded-tl-xl opacity-0
                group-hover:opacity-100 transition duration-300'>Created by {item.userName}</p>
              </a>
            ))}
          </div>
        ) : (
          <p className='text-center text-[#64748B] dark:text-[#8B949E]
          mt-10'>No Images Available</p>
        )}
      </div>
    </div>
  );
};

export default Community;
