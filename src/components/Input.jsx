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
    placeholder: '•••••••',
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
  type,
  value = '',
  label = '',
  className,
  compareValue = '',
  placeholder = '',
  errorMessage = '',
  autoComplete = '',
  onChange = () => {},
  onValidChange = () => {},
}) => {
  const config = typeConfig[inputType] || {};
  const inputId = `input-${inputType}`;

  // 유효성 검사
  const checkValidity = (val, compVal) =>
    config.validation ? config.validation(val, compVal) : true;

  const isValid = checkValidity(value, compareValue);
  const showError = value.length > 0 && !isValid;

  // 핸들러
  const handleChange = e => {
    const newValue = e.target.value;

    // tel 타입일 경우 숫자와 - 만 허용
    if (inputType === 'tel') {
      const filteredValue = newValue.replace(/[^\d-]/g, '');
      if (filteredValue !== newValue) {
        onChange(filteredValue);
        onValidChange(checkValidity(filteredValue, compareValue));
        return;
      }
    }

    onChange(newValue);
    onValidChange(checkValidity(newValue, compareValue));
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <label className='mb-1 text-base tracking-tight' htmlFor={inputId}>
        {label || config.label}
      </label>
      {/* 값에 따른 보더색상 변경 */}
      <div
        className={`relative flex items-center gap-2.5 rounded-full border-2 bg-white text-neutral-600 transition-all outline-none ${
          value === ''
            ? 'border-neutral-300'
            : isValid
              ? 'border-violet-600'
              : 'border-red-500'
        }`}
      >
        {/* 아이콘 */}
        <div className='absolute left-5 min-w-[20px]'>
          {config.icon && <Icon name={config.icon} strokeWidth={0} />}
        </div>

        {/* 인풋 필드 */}

        <input
          id={inputId}
          type={type || config.type}
          className='w-full rounded-full border-none px-14 py-4 outline-none'
          placeholder={placeholder || config.placeholder}
          value={value}
          onChange={handleChange}
          autoComplete={autoComplete || config.autoComplete}
        />

        {/* 닫기 버튼 */}
        {value && (
          <button className='absolute right-5' onClick={() => onChange('')}>
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
