export default function Badge({ sale }) {
  return (
    <>
      <div className='inline-flex items-center justify-center gap-2.5 rounded-xs bg-violet-200 p-0.5 text-sm'>
        <span className='font-inter text-sm font-medium text-violet-600'>
          {sale}% off
        </span>
      </div>
    </>
  );
}

// 사용법
// 예시 <Badge sale={rooms.sale} />
// 컴포넌트 선언후 추후 db에 들어있는 rooms.sale을 넣어주면 됩니다
//
