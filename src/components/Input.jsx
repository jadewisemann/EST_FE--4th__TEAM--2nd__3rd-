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
    autoComplete: 'email',
  },
  password: {
    icon: 'lock',
    placeholder: '••••••',
    type: 'password',
    label: '비밀번호',
    validation: value => (value || '').length > 5,
    errorMessage: '비밀번호는 6자리 이상 입력해주세요',
    autoComplete: 'current-password',
  },
  confirmPassword: {
    icon: 'lock',
    type: 'password',
    placeholder: '비밀번호 확인',
    label: '비밀번호 확인',
    validation: (value, compareValue) => value === compareValue,
    errorMessage: '비밀번호가 동일하지 않습니다.',
    autoComplete: 'new-password',
  },
  name: {
    icon: 'user',
    placeholder: '홍길동',
    label: '이름',
    validation: value => (value || '').length > 1,
    errorMessage: '이름은 2자 이상 입력해주세요',
    autoComplete: 'name',
  },
  tel: {
    icon: 'phone',
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
  number: {
    type: 'number',
    placeholder: '사용할 포인트를 입력해주세요',
    label: '',
  },
};

const Input = ({
  inputType,
  type,
  value = '',
  label = '',
  className = '',
  compareValue = '',
  placeholder = '',
  errorMessage = '',
  autoComplete = '',
  inputClass = '',
  onChange = () => {},
  onValidChange = () => {},
}) => {
  const config = typeConfig[inputType] || {};
  const inputId = `input-${inputType}`;
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);

  // 유효성 검사
  const checkValidity = (val, compVal) =>
    config.validation ? config.validation(val, compVal) : true;

  const isValid = checkValidity(value, compareValue);
  const showError = value.length > 0 && !isValid;

  // 핸들러
  const handleChange = e => {
    let newValue = e.target.value;

    // tel 타입일 경우 숫자만 입력받도록 필터링
    if (inputType === 'tel') {
      newValue = newValue.replace(/[^\d]/g, '');
      newValue = formatPhoneNumber(newValue);
    }

    onChange(newValue);
    onValidChange(checkValidity(newValue, compareValue));
  };

  // 하이픈 추가
  const formatPhoneNumber = number => {
    if (number.length <= 3) {
      return number;
    } else if (number.length <= 7) {
      return `${number.slice(0, 3)}-${number.slice(3)}`;
    } else {
      return `${number.slice(0, 3)}-${number.slice(3, 7)}-${number.slice(7, 11)}`;
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <label className='mb-1 text-base tracking-tight' htmlFor={inputId}>
        {label || config.label}
      </label>

      {/* 값에 따른 보더색상 변경 */}
      <div
        className={`relative flex items-center gap-2.5 rounded-full border-[1.5px] bg-white text-neutral-600 transition-all outline-none focus-within:border-violet-600 dark:bg-neutral-800 dark:focus-within:border-violet-400 ${value === '' ? 'border-neutral-300 dark:border-neutral-400' : isValid ? 'border-violet-600 dark:border-violet-400' : 'border-red-500!'} `}
      >
        {/* 아이콘 */}
        <div className='absolute left-5 min-w-[20px]'>
          <label htmlFor={inputId}>
            {config.icon && (
              <Icon
                name={config.icon}
                strokeWidth={
                  config.type === 'email' || config.type === 'tel' ? 0 : 1
                }
              />
            )}
          </label>
        </div>

        {/* 인풋 필드 */}

        <input
          id={inputId}
          type={
            inputType === 'password' || inputType === 'confirmPassword'
              ? isPasswordVisible
                ? 'password'
                : 'text'
              : type || config.type
          }
          className={`w-full rounded-full border-none px-14 py-4 outline-none placeholder:text-neutral-300 dark:text-neutral-50 dark:placeholder:text-neutral-400 ${inputClass}`}
          placeholder={placeholder || config.placeholder}
          value={value}
          onChange={handleChange}
          autoComplete={autoComplete || config.autoComplete || 'off'}
        />

        {/* 지우기 버튼 */}
        {inputType !== 'password' &&
          inputType !== 'confirmPassword' &&
          value && (
            <button
              type='button'
              className='absolute right-5 cursor-pointer'
              onClick={() => {
                onChange('');
                onValidChange(false);
              }}
            >
              <Icon
                name='close'
                className='text-neutral-600 dark:text-neutral-400'
              />
              <span className='sr-only'>지우기 버튼</span>
            </button>
          )}

        {/* 비밀번호 보이기*/}
        {(inputType === 'password' || inputType === 'confirmPassword') &&
          value && (
            <button
              type='button'
              className='absolute right-5 cursor-pointer'
              onClick={() => setIsPasswordVisible(prev => !prev)}
            >
              <Icon
                name={isPasswordVisible ? 'eye' : 'eye_close'}
                className='text-neutral-600 dark:text-neutral-400'
                strokeWidth={0.5}
              />
              <span className='sr-only'>
                {isPasswordVisible ? '비밀번호 보이기' : '비밀번호 숨기기'}
              </span>
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
// 기본적으로 label과 placeholder는 inputType에 따라 정적으로 설정됩니다
// prop으로 placeholder,label로

// onChange를 기입하기 위해 부모 페이지에 상태 정의를 하도록 변경 했습니다 .

//val 상태를 정의 해주고

// const [email, setEmail] = useState('');
// const [name, setName] = useState('');
// const [password, setPassword] = useState('');

// 인풋 컴포넌트 호출후 onChange에 상태변경을 추가하면 됩니다

/* <Input inputType='email' value={email} onChange={setEmail} />
<Input inputType='password' value={password} onChange={setPassword} />
<Input inputType='name' value={name} onChange={setName} /> 
<Input inputType='search' value={search} onChange={setSearch} /> */

// 최상단에 classname으로 스타일 적용 할 수 있도록 하였습니다 className=""
// type을 지정 할 수 있도록 하였습니다
// email , password 인풋 사용시 form 태그를 사용해 주세요
