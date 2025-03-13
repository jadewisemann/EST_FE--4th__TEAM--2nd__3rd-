const Rating = ({ name, options }) => (
  <ul>
    {options?.map((option, index) => (
      <li key={index} className='mt-3 flex items-center gap-2 first:mt-0'>
        <input
          id={name + index}
          // 받아온 name으로 같은 라디오 내 한가지만 선택 가능하도록 구현
          name={name}
          type='radio'
          disabled={option.disabled}
          className='peer aspect-square w-[1.125rem] accent-violet-600'
        />
        <label
          htmlFor={name + index}
          className={`text-sm font-medium text-neutral-400 peer-checked:text-black`}
        >
          {option.value}
        </label>
      </li>
    ))}
  </ul>
);

export default Rating;

// 데이터 예시
// [
// { value: '신용카드', disabled: true },
// { value: '포인트 결제', disabled: false },
// { value: '현장에서 결제하기', disabled: false },
// ];
