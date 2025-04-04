import { useNavigate } from 'react-router-dom';

import Button from '../../../components/Button';

const DetailProduct = ({ detailProducts, rooms }) => {
  const navigate = useNavigate();

  return (
    <ul>
      {detailProducts?.map((product, index) => (
        <li
          key={index}
          className='mb-4 overflow-hidden rounded-xl shadow-[0px_2px_4px_2px_rgba(0,0,0,0.1)]'
        >
          <img className='block aspect-video w-full' src={product.img} alt='' />

          <div className='px-4 py-3 dark:bg-neutral-700'>
            <div className='font-bold tracking-tight'>{product.title}</div>
            <div className='mt-4 mb-5 flex items-end justify-between'>
              <ul className='text-xs tracking-tight text-neutral-400 dark:text-neutral-300 [&>li]:mt-1'>
                <li className='first:mt-0'>
                  {product.info.find(item => item.title === '객실정보').content}
                </li>
                <li>
                  <span>{product.check_in}</span>
                  <span> ~ </span>
                  <span>{product.check_out}</span>
                </li>
              </ul>

              <div className='flex flex-col items-end justify-end gap-2'>
                <div className='flex flex-col items-end text-sm'>
                  {product.price_final ? (
                    <>
                      <span className='text-neutral-400 line-through dark:text-neutral-300'>
                        {product.price.toLocaleString()}원
                      </span>
                      <div className='flex items-end gap-1.5'>
                        <span className='mb-1 text-xs font-bold text-violet-600 dark:text-violet-500'>
                          {Math.ceil(
                            ((product.price - product.price_final)
                              / product.price)
                              * 100,
                          )}
                          %
                        </span>

                        <span className='text-lg font-bold'>
                          {product.price_final.toLocaleString()}원
                        </span>
                      </div>
                    </>
                  ) : (
                    <span className='ml-2 text-lg font-bold'>
                      {product.price.toLocaleString()}원
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Button
              color='prime'
              size='full'
              onClick={() => {
                navigate(`/checkout/${rooms[index].room_uid}`);
              }}
            >
              예약
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default DetailProduct;
