const Badge = ({ children, type }) => (
  <div className='inline-flex items-center justify-center rounded-xs bg-violet-200 p-1 text-sm'>
    <span className='font-inter text-sm font-medium text-violet-600'>
      {type === 'sale' ? `${children}% off` : children}
    </span>
  </div>
);

export default Badge;
// 사용법
// 세일 태그  <Badge type={sale} chiledren={15}  /> children -- 추후db에 sale 값 가져오기
// 텍스트 태그  <Badge chiledren={오늘의 최저가} />
