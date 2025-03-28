const SkeletonItem = ({ type }) => {
  if (type === 'horizon') {
    return (
      <div className='w-full animate-pulse'>
        <div className='block aspect-video w-full rounded-lg bg-gray-300' />
        <div className='mt-2'>
          <div className='flex flex-col'>
            <div className='my-1.5 h-5 w-32 rounded bg-gray-300' />
            <div className='h-5 w-24 rounded bg-gray-300' />
            <div className='mt-1 h-5 w-20 rounded bg-gray-300' />
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

// 사용법
// < SkeletonItem type={} />
// 기본적으로 버티컬에 맞춰 있으며
// 호라이즌 사용시 type={'horizon'} 넣으면 됩니다.
