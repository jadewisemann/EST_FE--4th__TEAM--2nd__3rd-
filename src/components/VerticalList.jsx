import Heart from '../components/Heart';
import Rating from '../components/Rating';
import Icon from '../components/Icon';

const VerticalList = ({ products }) => (
  <>
    <div></div>
    {products?.map((product, index) => (
      <div key={index} className='border-b-1 border-neutral-200 py-4'>
        <div type='button' className='flex w-full gap-3'>
          <button className='cursor-pointer'>
            <img
              className='block h-20 w-20 rounded-[10px]'
              src={product.thumbnail}
              alt=''
            />
          </button>
          <div className='flex grow justify-between'>
            <div className='flex flex-col'>
              <button className='cursor-pointer'>
                <h2 className='mb-1.5 text-left text-sm'>{product.name}</h2>
              </button>
              <address className='flex items-center text-[11px] text-neutral-500 not-italic'>
                <Icon name='location' className='text-neutral-500' size={20} />
                {product.location}
              </address>
              <div className='mt-1 mt-auto flex items-end gap-1'>
                <span className='text-sm font-bold text-violet-600'>
                  {product.price.toLocaleString()}원
                </span>
                <span className='text-xs text-neutral-500'>/ 1박</span>
              </div>
            </div>
            <div className='flex flex-col justify-between'>
              <div className='ml-auto'>
                <Rating rate={product.rate} />
              </div>
              <div className=''>
                <Heart />
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </>
);
export default VerticalList;
