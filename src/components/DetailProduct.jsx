import Button from './Button';
import { useNavigate, useParams } from 'react-router-dom';

const DetailProduct = ({ detailProducts }) => {
  const navigate = useNavigate();
  const { hotelId } = useParams();

  return (
    <ul>
      {detailProducts?.map((product, index) => (
        <li
          key={index}
          className='mb-4 overflow-hidden rounded-xl shadow-[0px_2px_4px_2px_rgba(0,0,0,0.1)]'
        >
          <img className='block w-full' src={product.img} alt='' />

          <div>
            <div className='px-4 py-3'>
              <div>
                <h2 className='font-bold tracking-tight'>{product.title}</h2>
                <div className='mt-4 mb-5 flex items-end justify-between'>
                  <ul className='text-xs tracking-tight text-neutral-400 [&>li]:mt-1'>
                    <li className='first:mt-0'>
                      {
                        product.info.find(item => item.title === '객실정보')
                          .content
                      }
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
                          <span className='text-neutral-400 line-through'>
                            {product.price.toLocaleString()}원
                          </span>
                          <div className='flex items-end gap-1.5'>
                            <span className='mb-1 text-xs font-bold text-violet-600'>
                              {Math.ceil(
                                ((product.price - product.price_final) /
                                  product.price) *
                                  100,
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
              </div>
              <Button
                color='prime'
                size='full'
                onClick={() => {
                  navigate(`/checkout/${hotelId}/${index}`);
                }}
              >
                예약
              </Button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default DetailProduct;
