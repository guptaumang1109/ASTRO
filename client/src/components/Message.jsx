import { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import moment from 'moment';
import Markdown from 'react-markdown';
import Prism from 'prismjs';

const Message = ({message}) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [message.content]);

  return (
    <div>
      {message.role === "user" ? (
        <div className='flex items-start justify-end my-3 gap-2'>
          <div className='flex flex-col gap-1.5 p-3 px-4 bg-white dark:bg-[#161B22] border border-[#E2E8F0] dark:border-[#30363D] rounded-lg max-w-[85%] sm:max-w-xl md:max-w-2xl shadow-sm'>
            <p className='text-sm text-[#0F172A] dark:text-[#E6EDF3] break-words'>{message.content}</p>
            <span className='text-xs text-[#64748B] dark:text-[#8B949E]'>
              {moment(message.timestamp).fromNow()}</span>
          </div>
          <img src={assets.user_icon} className='w-7 sm:w-8 rounded-full shrink-0' alt="" />
        </div>
      ) : (
        // AI GENERATED CONTENT 
        <div className='inline-flex flex-col gap-1.5 p-3 px-4 max-w-[85%] sm:max-w-xl md:max-w-2xl bg-white dark:bg-[#161B22] border border-[#E2E8F0] dark:border-[#30363D] rounded-lg my-3 shadow-sm shadow-[#06B6D4]/5'>
          {message.isImage ? (
            imgError ? (
              <div className='p-4 my-2 border border-red-500/20 bg-red-500/10 rounded-md text-xs text-red-300 flex flex-col gap-1'>
                <span className='font-semibold'>Image load failed</span>
                <span className='text-[#64748B] dark:text-[#8B949E]'>This image link is unavailable or expired.</span>
              </div>
            ) : (
              <img
                src={message.content}
                alt="AI Generated"
                className='w-full max-w-xs sm:max-w-sm md:max-w-md mt-2 rounded-md object-cover bg-black/20'
                onError={() => setImgError(true)}
              />
            )
          ) : (
            <div className='text-sm text-[#0F172A] dark:text-[#E6EDF3] reset-tw font-code overflow-x-auto'><Markdown>{message.content}</Markdown></div>
          )}
          <span className='text-xs text-[#64748B] dark:text-[#8B949E]'>{moment(message.timestamp).fromNow()}</span>
        </div>
      )
      }
    </div>
  );
};

export default Message;
