import { useState } from 'react';
import Icon from './Icon';

const typeConfig = {
  email: {
    icon: 'email',
    placeholder: 'abc@example.com',
    label: '이메일',
    validation: value => value.includes('@'),
  },
  password: {
    icon: 'lock',
    placeholder: '•••••••',
    label: '비밀번호',
    validation: value => value.length > 5,
  },
  name: {
    icon: 'user',
    placeholder: '홍길동',
    label: '이름',
    validation: value => value.length > 1,
  },
  search: {
    icon: 'search',
    placeholder: '숙박명 검색',
    label: '',
  },
};

const Input = ({ label, type, placeholder }) => {
  const [value, setValue] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isTouched, setIsTouched] = useState(false);

  // type을 config로 축약
  const config = typeConfig[type] || {};

  // config 아이콘 가져오기
  const getIcon = () =>
    config.icon ? <Icon name={config.icon} strokeWidth={0} /> : '';

  // placeholder 값
  const getPlaceholder = () => placeholder || config.placeholder || '';

  // label 값
  const getLabel = () => label || config.label || '';

  // 입력값 핸들러
  const handleChange = e => {
    setValue(e.target.value);
    setIsTouched(true);
    setIsValid(config.validation ? config.validation(e.target.value) : true);
  };

  return (
    <div className='flex flex-col'>
      <label className='mb-1 text-base/loose tracking-tight'>
        {getLabel()}
      </label>
      <div
        className={`flex items-center gap-5 rounded-full border-2 bg-white px-5 py-4 text-neutral-600 outline-none ${
          isTouched && !isValid
            ? 'border-red-500'
            : value
              ? 'border-violet-600'
              : 'border-neutral-600'
        }`}
      >
        {getIcon()}
        <input
          type={type}
          className='flex-grow border-none outline-none'
          placeholder={getPlaceholder()}
          value={value}
          onChange={handleChange}
        />
        {value && (
          <button onClick={() => setValue('')}>
            <Icon name='close' color='black' />
          </button>
        )}
      </div>

      {!isValid && (
        <p className='mt-1 text-sm text-red-500'>잘못 된 {getLabel()}입니다.</p>
      )}
    </div>
  );
};

export default Input;
// 사용법
// 기본적으로 label과 placeholder는 type에 따라 자동으로 설정됩니다.
// type 은 email, password, name 세가지가 있습니다.
// <Input type="email" />
// placeholder 나 label을 직접 설정하고 싶다면
// <Input type="email" placeholder="이메일을 입력" label="이메일임" />
