# React 코딩 스타일 가이드

## 참고
- [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react)
- [React 공식 문서 스타일 가이드](https://reactjs.org/docs/code-conventions.html)

## 기본 규칙

### 파일 확장자
- `.jsx` 또는 `.tsx`(TypeScript의 경우) 확장자를 사용하세요.
- 컴포넌트가 포함된 파일은 항상 JSX/TSX 확장자로 저장하세요.

### 컴포넌트 이름
- **PascalCase**를 사용하세요.
- 파일 이름은 컴포넌트 이름과 동일하게 작성하세요.

```jsx
// 잘못된 예
function userProfile() {
  return <div>...</div>;
}

// 좋은 예
function UserProfile() {
  return <div>...</div>;
}
```

### 컴포넌트 선언
- 함수형 컴포넌트를 사용하세요.
- 가능하면 화살표 함수 대신 일반 함수를 사용하세요 (에러 추적이 더 쉽습니다).

```jsx
// 좋은 예
function UserProfile() {
  return <div>...</div>;
}

// 허용되는 예 (화살표 함수)
const UserProfile = () => {
  return <div>...</div>;
};
```

### PropTypes
- 항상 PropTypes를 정의하세요.
- 가능하면 TypeScript를 사용하세요.

```jsx
import PropTypes from 'prop-types';

function UserProfile({ name, age }) {
  return (
    <div>
      <p>Name: {name}</p>
      <p>Age: {age}</p>
    </div>
  );
}

UserProfile.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number
};

UserProfile.defaultProps = {
  age: 25
};
```

### Props
- Props 이름은 **camelCase**로 작성하세요.
- Props를 구조 분해 할당으로 사용하세요.

```jsx
// 잘못된 예
function UserProfile(props) {
  return <div>{props.user_name}</div>;
}

// 좋은 예
function UserProfile({ userName }) {
  return <div>{userName}</div>;
}
```

### JSX 문법

#### 태그 닫기
- 항상 태그를 닫으세요.
- 자식 요소가 없는 태그는 자체 닫는 태그를 사용하세요.

```jsx
// 잘못된 예
<div>
  <img src="profile.jpg">
</div>

// 좋은 예
<div>
  <img src="profile.jpg" />
</div>
```

#### 속성 줄바꿈
- 속성이 3개 이상이면 줄바꿈하세요.

```jsx
// 한 두개의 속성
<Button type="submit" disabled={isLoading}>Submit</Button>

// 여러 속성
<Button
  type="submit"
  className="btn-primary"
  disabled={isLoading}
  onClick={handleSubmit}
>
  Submit
</Button>
```

#### 조건부 렌더링
- 짧은 조건은 삼항 연산자를 사용하세요.
- 복잡한 조건은 변수나 함수로 분리하세요.

```jsx
// 짧은 조건
{isLoggedIn ? <UserProfile /> : <LoginButton />}

// 복잡한 조건
const renderContent = () => {
  if (isLoading) {
    return <Loader />;
  }
  
  if (error) {
    return <ErrorMessage message={error} />;
  }
  
  return <UserProfile data={data} />;
};

return (
  <div className="container">
    {renderContent()}
  </div>
);
```

#### JSX에서 괄호 사용
- 복잡한 JSX는 괄호로 감싸세요.

```jsx
// 좋은 예
return (
  <div>
    <Header />
    <MainContent>
      <ArticleList items={articles} />
    </MainContent>
    <Footer />
  </div>
);
```

### Hook 사용법

#### Hook 이름
- 커스텀 Hook은 항상 `use`로 시작하세요.

```jsx
// 좋은 예
function useUserData(userId) {
  const [data, setData] = useState(null);
  // ...
  return data;
}
```

#### Hook 호출 순서
- Hook은 항상 컴포넌트 최상위 레벨에서 호출하세요.
- 조건문, 반복문, 중첩 함수 내에서 Hook을 호출하지 마세요.

```jsx
// 잘못된 예
function UserProfile({ userId }) {
  const [name, setName] = useState('');
  
  if (userId) {
    // 에러: 조건부로 Hook 호출
    useEffect(() => {
      fetchUser(userId);
    }, [userId]);
  }
  
  // ...
}

// 좋은 예
function UserProfile({ userId }) {
  const [name, setName] = useState('');
  
  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
  }, [userId]);
  
  // ...
}
```

### 상태 관리

#### 상태 분리
- 관련 있는 상태는 함께 관리하세요.
- 독립적인 상태는 분리하세요.

```jsx
// 잘못된 예 - 관련된 상태가 분리됨
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [email, setEmail] = useState('');

// 좋은 예 - 관련된 상태를 함께 관리
const [formData, setFormData] = useState({
  firstName: '',
  lastName: '',
  email: ''
});

// 또는 useReducer 사용
```

#### 불변성 유지
- 상태 업데이트 시 항상 불변성을 유지하세요.

```jsx
// 잘못된 예
const handleChange = (e) => {
  formData.firstName = e.target.value; // 직접 수정
  setFormData(formData);
};

// 좋은 예
const handleChange = (e) => {
  setFormData({
    ...formData,
    firstName: e.target.value
  });
};
```

### 이벤트 핸들러

#### 이벤트 핸들러 이름
- `handle` 접두사를 사용하세요.
- Props로 전달할 때는 `on` 접두사를 사용하세요.

```jsx
// 컴포넌트 내부
const handleSubmit = (e) => {
  e.preventDefault();
  // ...
};

// Props로 전달
<Form onSubmit={handleSubmit} />
```

#### 인라인 함수 지양
- 렌더링마다 함수가 재생성되므로 성능에 영향을 줄 수 있습니다.
- 이벤트 핸들러는 컴포넌트 내부에 정의하세요.

```jsx
// 잘못된 예
<button onClick={() => handleClick(id)}>Click me</button>

// 좋은 예
const handleButtonClick = () => {
  handleClick(id);
};

<button onClick={handleButtonClick}>Click me</button>
```

### 성능 최적화

#### memo, useMemo, useCallback
- 필요할 때만 사용하세요.
- 불필요한 최적화는 오히려 성능을 저하시킬 수 있습니다.

```jsx
// React.memo 사용
const MemoizedComponent = React.memo(function MyComponent(props) {
  // 렌더링 로직
});

// useMemo 사용
const memoizedValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);

// useCallback 사용
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

### 스타일링
- 컴포넌트 안에서 tailwind로 스타일링 하세요.

### 폴더 구조

#### 컴포넌트 구성
- 관련된 파일은 같은 폴더에 넣으세요.
- 컴포넌트별로 폴더를 만들거나, 기능별로 폴더를 구성하세요.

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.jsx
│   │   ├── Button.test.jsx
│   │   ├── Button.module.css
│   │   └── index.js
│   └── UserProfile/
│       ├── UserProfile.jsx
│       ├── UserProfile.test.jsx
│       └── index.js
├── hooks/
│   ├── useAuth.js
│   └── useForm.js
├── contexts/
│   └── AuthContext.jsx
└── pages/
    ├── Home/
    └── Dashboard/
```

### 테스트

#### 테스트 파일
- 컴포넌트와 같은 폴더에 `.test.jsx` 또는 별도의 `__tests__` 폴더에 넣으세요.

```
Component/
├── Component.jsx
├── Component.test.jsx
└── index.js

// 또는

src/
├── components/
│   └── Component.jsx
└── __tests__/
    └── Component.test.jsx
```

#### 테스트 중점
- 사용자 관점에서 테스트하세요.
- 내부 구현보다는 행동에 집중하세요.

```jsx
// 좋은 예
test('사용자가 제출 버튼을 클릭하면 폼이 제출된다', () => {
  render(<ContactForm />);
  
  // 입력 값 채우기
  fireEvent.change(screen.getByLabelText(/이름/i), {
    target: { value: '홍길동' },
  });
  
  // 제출 버튼 클릭
  fireEvent.click(screen.getByRole('button', { name: /제출/i }));
  
  // 결과 확인
  expect(screen.getByText(/감사합니다/i)).toBeInTheDocument();
});
```

### 에러 처리

#### 에러 바운더리
- 컴포넌트 트리의 여러 위치에 에러 바운더리를 사용하세요.

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>문제가 발생했습니다.</h1>;
    }

    return this.props.children;
  }
}

// 사용
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

#### 비동기 에러 처리
- 비동기 작업의 에러를 항상 처리하세요.

```jsx
const fetchData = async () => {
  try {
    setLoading(true);
    const response = await api.fetchUser(userId);
    setUser(response.data);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

### 접근성

#### ARIA 속성
- 필요한 경우 ARIA 속성을 추가하세요.

```jsx
<button
  aria-label="닫기"
  aria-expanded={isOpen}
  onClick={toggle}
>
  <Icon name="close" />
</button>
```

#### 키보드 접근성
- 모든 인터랙티브 요소는 키보드로 접근 가능해야 합니다.

```jsx
// 키보드 이벤트 처리
function KeyboardNavigation() {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      activateItem();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={activateItem}
    >
      항목 선택
    </div>
  );
}
```

### 성능

#### 가상화
- 긴 목록은 가상화 라이브러리(react-window, react-virtualized)를 사용하세요.

```jsx
import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );

  return (
    <FixedSizeList
      height={500}
      width={300}
      itemCount={items.length}
      itemSize={35}
    >
      {Row}
    </FixedSizeList>
  );
}
```

#### 이미지 최적화
- 이미지 지연 로딩을 사용하세요.

```jsx
// 네이티브 지연 로딩 사용
<img src="large-image.jpg" loading="lazy" alt="Description" />

// 또는 라이브러리 사용
import { LazyLoadImage } from 'react-lazy-load-image-component';

<LazyLoadImage
  src="large-image.jpg"
  alt="Description"
  effect="blur"
/>
```

### 의존성 관리

#### 부수 효과 의존성
- useEffect의 의존성 배열을 항상 명시하세요.
- 필요한 의존성을 모두 포함하세요.

```jsx
// 잘못된 예 - 의존성 누락
useEffect(() => {
  fetchData(userId);
}, []); // userId가 의존성 배열에 누락됨

// 좋은 예
useEffect(() => {
  fetchData(userId);
}, [userId, fetchData]); // 모든 의존성 포함
```

#### 커스텀 Hook으로 로직 추출
- 컴포넌트 간에 공유되는 로직은 커스텀 Hook으로 추출하세요.

```jsx
// 커스텀 Hook
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

// 사용
function ResponsiveComponent() {
  const { width, height } = useWindowSize();
  // ...
}
```