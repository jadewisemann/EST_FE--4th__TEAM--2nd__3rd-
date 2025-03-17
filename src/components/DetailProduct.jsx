import Icon from '../components/Icon';
import Badge from './Badge';
import Button from './Button';

const DetailProduct = ({ detailProducts }) => (
  <ul>
    {detailProducts?.map((product, index) => (
      <li
        key={index}
        className='mb-4 overflow-hidden rounded-[10px] shadow-[0px_2px_4px_2px_rgba(0,0,0,0.1)]'
      >
        <img className='block w-full' src={product.thumbnail} alt='' />
        <div>
          <div className='border-b border-gray-200 px-4 py-3'>
            <div className='flex gap-2'>
              <h2 className='text-sm tracking-tight'>{product.name}</h2>
              {product.specialOffer && <Badge>오늘의 최저가</Badge>}
            </div>
            <div className='mt-2 flex justify-between'>
              <div className='flex items-center gap-1'>
                <Icon name='bed' color='black' size={18} />
                <span className='text-xxs text-gray-700'>{product.bed}</span>
              </div>
              <div className='flex items-center gap-1'>
                {product.info.smoke ? (
                  <>
                    <Icon name='smoke' className='text-gray-700' size={16} />
                    <span className='text-xxs text-gray-700'>흡연</span>
                  </>
                ) : (
                  <>
                    <Icon
                      name='smoke_non'
                      className='text-gray-700'
                      size={16}
                    />
                    <span className='text-xxs text-gray-700'>금연</span>
                  </>
                )}
                {product.info.wifi && (
                  <>
                    <Icon name='wifi' className='text-gray-700' size={16} />
                    <span className='text-[10px] text-gray-700'>무료 WIFI</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className='flex justify-between px-4 py-3'>
            <ul className='flex flex-col gap-0.5 text-xs tracking-tight text-neutral-600'>
              <li>성인 2명 요금 / 최대 2인</li>
              <li>
                체크인 {product.info.checkInHour}
                <span> ~ </span>
                <span className='whitespace-nowrap'>
                  체크아웃 {product.info.checkOutHour}
                </span>
              </li>
              {product.info.noRefund && (
                <li className='text-red-500'>환불불가 상품</li>
              )}
              {!product.info.addPerson && <li>추가 인원 불가</li>}
            </ul>
            <div className='flex shrink-0 flex-col items-end justify-end gap-2'>
              <span className='text-sm font-bold text-violet-600'>
                <span className='text-lg font-bold'>
                  {product.price.toLocaleString()}
                </span>
                원
              </span>
              <Button color='prime' size='xSmall' onClick={() => {}}>
                예약
              </Button>
            </div>
          </div>
        </div>
      </li>
    ))}
  </ul>
);

export default DetailProduct;
