import Heart from '../components/Heart';
import Rating from '../components/Rating';
import Icon from '../components/Icon';

const VerticalList = ({ products }) => (
  <>
    {products?.map((product, index) => (
      <button
        key={index}
        className='w-full cursor-pointer border-b-1 border-neutral-200 py-4'
        onClick={() => {
          alert('확인');
        }}
      >
        <div type='button' className='flex w-full gap-3'>
          <div className='shrink-0'>
            <img
              className='block h-20 w-20 rounded-[10px] object-cover'
              src={product.rooms?.[0]?.img || product.image?.[0] || ''}
              alt=''
            />
          </div>
          <div className='flex grow justify-between'>
            <div className='flex flex-col'>
              <div className=''>
                <h2 className='mb-1.5 text-left text-sm'>{product.title}</h2>
              </div>
              <address className='flex items-center text-[11px] text-neutral-500 not-italic'>
                <Icon name='location' className='text-neutral-500' size={20} />
                {product.location[0]}
              </address>
              <div className='mt-1 mt-auto flex items-end gap-1'>
                <span className='text-sm font-bold text-violet-600'>
                  {(product.rooms?.[0]?.price ?? 0).toLocaleString()}원
                </span>
                <span className='text-xs text-neutral-500'>/ 1박</span>
              </div>
            </div>
            <div className='flex flex-col justify-between'>
              <div className='ml-auto'>
                <Rating rate={product._debug?.score || 0} />
              </div>
              <div
                onClick={e => {
                  e.stopPropagation(); // 여기서 버블링 막기
                }}
              >
                <Heart className='relative z-10' />
              </div>
            </div>
          </div>
        </div>
      </button>
    ))}
  </>
);
export default VerticalList;
