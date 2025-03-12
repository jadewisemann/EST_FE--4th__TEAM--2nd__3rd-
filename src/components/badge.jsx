const Badge = () => {
  const sale = 10;
  return (
    <>
      <div className='inline-flex items-center justify-center gap-2.5 rounded-xs bg-violet-200 p-0.5 text-sm'>
        <span className='font-inter text-sm font-medium text-violet-600'>
          {sale}% off
        </span>
      </div>
    </>
  );
};

export default Badge;
