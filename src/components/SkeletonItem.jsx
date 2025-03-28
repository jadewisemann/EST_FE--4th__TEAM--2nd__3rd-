const SkeletonItem = ({ type }) => {
  if (type === 'horizon') {
    return (
      <div className='w-full animate-pulse rounded-[10px] p-3 shadow-md dark:bg-neutral-600'>
        <div className='block aspect-video w-full rounded-lg bg-gray-300 dark:bg-gray-700' />
        <div className='mt-2'>
          <div className='flex items-center'>
            <div className='h-4 w-32 rounded bg-gray-300 dark:bg-gray-700' />
            <div className='ml-auto h-4 w-10 rounded bg-gray-300 dark:bg-gray-700' />
          </div>
          <div className='mt-1 flex items-center'>
            <div className='h-3 w-24 rounded bg-gray-300 dark:bg-gray-700' />
          </div>
          <div className='mt-1 flex items-end gap-1'>
            <div className='h-5 w-16 rounded bg-gray-300 dark:bg-gray-700' />
            <div className='h-4 w-8 rounded bg-gray-300 dark:bg-gray-700' />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex w-full animate-pulse gap-3 border-b border-neutral-200 py-4 dark:border-neutral-400'>
      <div className='h-20 w-20 rounded-[10px] bg-gray-300' />
      <div className='flex flex-1 flex-col'>
        <div className='mb-3 h-4 w-22 rounded bg-gray-300' />
        <div className='h-3 w-34 rounded bg-gray-300' />
        <div className='mt-auto h-4 w-22 rounded bg-gray-300' />
      </div>
      <div className='flex flex-col justify-between'>
        <div className='h-4 w-8 rounded bg-gray-300' />
        <div className='right-0 h-8 w-8 rounded bg-gray-300' />
      </div>
    </div>
  );
};

export default SkeletonItem;
