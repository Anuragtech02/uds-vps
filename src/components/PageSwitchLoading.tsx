import React from 'react';

const PageSwitchLoading = () => {
   return (
      <div className='fixed inset-0 z-[200] flex h-screen w-screen items-center justify-center bg-black/60 backdrop-blur-sm'>
         <div className='h-20 w-20 animate-spin rounded-full border-b-2 border-t-2 border-white'></div>
      </div>
   );
};

export default PageSwitchLoading;
