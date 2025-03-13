const Badge = ({ children, type }) => {
  if (type === 'sale') {
    return (
      <div className='inline-flex items-center justify-center gap-2.5 rounded-xs bg-violet-200 p-0.5 text-sm'>
        <span className='font-inter text-sm font-medium text-violet-600'>
          {children}% off
        </span>
      </div>
    );
  } else {
    return (
      <div className='inline-flex items-center justify-center gap-2.5 rounded-xs bg-violet-200 p-0.5 text-sm'>
        <span className='font-inter text-sm font-medium text-violet-600'>
          {children}
        </span>
      </div>
    );
  }
};

export default Badge;
// 사용법
// 세일 태그  <Badge type={sale} chiledren={}  /> -- 추후db에 sale 값 가져오기
// 텍스트 태그  <Badge chiledren={오늘의 최저가} />
// 컴포넌트 선언후 추후 db에 들어있는 rooms.sale을 넣어주면 됩니다
//
