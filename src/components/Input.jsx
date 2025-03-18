import { useState } from 'react';
import Icon from './Icon';

// inputtype 정의
const typeConfig = {
  email: {
    icon: 'email',
    type: 'email',
    placeholder: 'abc@example.com',
    label: '이메일',
    validation: value =>
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
    errorMessage: '올바른 이메일을 입력해주세요',
  },
  password: {
    icon: 'lock',
    placeholder: '•••••••',
    type: 'password',
    label: '비밀번호',
    validation: value => (value || '').length > 5,
    errorMessage: '비밀번호는 6자리 이상 입력해주세요',
  },
  confirmPassword: {
    icon: 'lock',
    type: 'password',
    placeholder: '비밀번호 확인',
    label: '비밀번호 확인',
    validation: (value, compareValue) => value === compareValue,
    errorMessage: '비밀번호가 동일하지 않습니다.',
  },
  name: {
    icon: 'user',
    placeholder: '홍길동',
    label: '이름',
    validation: value => (value || '').length > 1,
    errorMessage: '이름은 2자 이상 입력해주세요',
  },
  tel: {
    icon: 'lock',
    type: 'tel',
    placeholder: '010-1234-5678',
    label: '휴대폰 번호',
    validation: value => /^\d{3}-\d{3,4}-\d{4}$/.test(value),
    errorMessage: '-을 입력해 휴대폰 번호를 입력해주세요',
  },
  search: {
    icon: 'search',
    type: 'text',
    placeholder: '숙박명 검색',
    label: '',
  },
};

const Input = ({
  inputType,
  value = '',
  label = '',
  compareValue = '',
  placeholder = '',
  errorMessage = '',
  onChange = () => {},
  onValidChange = () => {},
}) => {
  const config = typeConfig[inputType] || {};

  // 유효성 검사
  const checkValidity = (val, compVal) =>
    config.validation ? config.validation(val, compVal) : true;

  const isValid = checkValidity(value, compareValue);
  const showError = value.length > 0 && !isValid;

  // 핸들러
  const handleChange = e => {
    const newValue = e.target.value;
    onChange(newValue);
    onValidChange(checkValidity(newValue, compareValue));
  };

  return (
    <div className='flex flex-col'>
      {label ||
        (config.label && (
          <label className='mb-1 text-base tracking-tight'>
            {label || config.label}
          </label>
        ))}
      {/* 값에 따른 보더색상 변경 */}
      <div
        className={`flex items-center gap-2.5 rounded-full border-2 bg-white px-5 py-4 text-neutral-600 transition-all outline-none ${
          value === ''
            ? 'border-neutral-300'
            : isValid
              ? 'border-violet-600'
              : 'border-red-500'
        }`}
      >
        {/* 아이콘 */}
        <div className='min-w-[24px] flex-shrink-0'>
          {config.icon && <Icon name={config.icon} strokeWidth={0} />}
        </div>

        {/* 인풋 필드 */}
        <div className='w-full flex-grow'>
          <input
            type={config.type}
            className='w-full border-none outline-none'
            placeholder={placeholder || config.placeholder}
            value={value}
            onChange={handleChange}
          />
        </div>

        {/* 닫기 버튼 */}
        {value && (
          <button type='button' onClick={() => onChange('')}>
            <Icon name='close' color='black' />
          </button>
        )}
      </div>
      {/* 에러 메세지 */}
      {showError && (
        <p className='mt-1 text-sm text-red-500'>
          {errorMessage || config.errorMessage}
        </p>
      )}
    </div>
  );
};

export default Input;

// 사용법
// 기본적으로 label과 placeholder는 inputType에 따라 자동으로 설정됩니다
// prop으로 placeholder,label로 .

// onChange를 기입하기 위해 부모 페이지에 상태 정의를 하도록 변경 했습니다 .

//val 상태를 정의 해주고

// const [email, setEmail] = useState('');
// const [name, setName] = useState('');
// const [password, setPassword] = useState('');

// 인풋 컴포넌트 호출후 onChange에 기능을 추가하면 됩니다
/* <Input inputType='email' value={email} onChange={setEmail} />
<Input inputType='password' value={password} onChange={setPassword} />
<Input inputType='name' value={name} onChange={setName} /> 
<Input inputType='search' value={search} onChange={setSearch} /> */
