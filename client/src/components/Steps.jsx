import React from 'react';
import { assets } from '../assets/assets'; // Ensure all icons are correctly linked

const Steps = () => {
  return (
    <div className='px-4 md:px-8 xl:px-0 max-w-screen-xl mx-auto py-20 xl:py-32'>
      <h1 className='text-center text-2xl md:text-3xl lg:text-4xl font-semibold bg-gradient-to-r from-gray-900 to-gray-400 bg-clip-text text-transparent leading-snug'>
        Steps to Remove Background <br className='hidden md:block' /> from Image in Seconds
      </h1>

      <div className='flex flex-wrap justify-center gap-6 mt-12 md:mt-16'>

        {/* Step 1 */}
        <div className='w-full sm:w-[300px] flex items-start gap-4 bg-white border border-gray-200 shadow-md p-5 md:p-6 rounded-lg hover:scale-105 transition-transform duration-500'>
          <img className='w-10 h-10 shrink-0' src={assets.upload_icon} alt="Upload" />
          <div>
            <p className='text-lg font-semibold'>Upload Image</p>
            <p className='text-sm text-gray-600 mt-1'>
              Upload the image you want to process. It's quick and secure.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className='w-full sm:w-[300px] flex items-start gap-4 bg-white border border-gray-200 shadow-md p-5 md:p-6 rounded-lg hover:scale-105 transition-transform duration-500'>
          <img className='w-10 h-10 shrink-0' src={assets.remove_bg_icon} alt="Remove BG" />
          <div>
            <p className='text-lg font-semibold'>Remove Background</p>
            <p className='text-sm text-gray-600 mt-1'>
              Our AI removes the background automatically in seconds.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className='w-full sm:w-[300px] flex items-start gap-4 bg-white border border-gray-200 shadow-md p-5 md:p-6 rounded-lg hover:scale-105 transition-transform duration-500'>
          <img className='w-10 h-10 shrink-0' src={assets.download_icon} alt="Download" />
          <div>
            <p className='text-lg font-semibold'>Download Image</p>
            <p className='text-sm text-gray-600 mt-1'>
              Download your high-quality transparent image instantly.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Steps;
