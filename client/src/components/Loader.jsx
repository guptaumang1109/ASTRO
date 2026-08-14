
const Loader = ({ fullScreen = false, text = '' }) => {
  const containerClass = fullScreen
    ? 'bg-[#F8FAFC] dark:bg-[#0D1117] flex flex-col items-center justify-center h-screen w-screen text-[#0F172A] dark:text-[#E6EDF3] transition-colors duration-300'
    : 'flex flex-col items-center justify-center h-full w-full min-h-[300px] flex-1 text-[#0F172A] dark:text-[#E6EDF3] transition-colors duration-300';

  return (
    <div className={containerClass}>
      <div className='w-10 h-10 rounded-full border-4 border-[#06B6D4]/20 border-t-[#06B6D4] border-r-[#6366F1] animate-spin mb-3'></div>
      {text && (
        <p className='text-sm text-[#64748B] dark:text-[#8B949E] animate-pulse font-medium'>
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;
