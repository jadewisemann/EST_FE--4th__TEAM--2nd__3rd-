# JavaScript 코딩 스타일 가이드

## 참고
- [AirBnB 스타일 가이드](https://github.com/airbnb/javascript)
- [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)

## 기본 규칙

### 들여쓰기
- 탭이 아니라 **공백**을 사용하세요.
- JavaScript에서는 **2개의 공백**을 사용합니다.

### 세미콜론 (;)
- **무조건** 사용하세요.

### 변수 선언
- `var`는 사용하지 마세요.
- `const`를 기본으로 사용하세요.
- 값이 변경되어야 할 때만 `let`을 사용하세요.

```javascript
// 잘못된 예
var foo = 1;

// 좋은 예
const bar = 2;
let count = 0; // 값 변경이 필요한 경우
```

### 문자열
- 문자열은 큰따옴표(`"`) 대신 작은따옴표(`'`)를 사용하세요.

```javascript
// 잘못된 예
const name = "John";

// 좋은 예
const name = 'John';
```

### 템플릿 문자열
- 가변적인 문자열은 템플릿 리터럴을 사용하세요.

```javascript
const name = 'John';

// 잘못된 예
const greeting = 'Hello, ' + name + '!';

// 좋은 예
const greeting = `Hello, ${name}!`;
```

### 배열/객체 순회
- `for ... in ...`을 피하세요.
- 대신 `for ... of ...`, `forEach`를 사용하거나 배열 고급 메서드를 사용하세요.
- 순회 불가능하면 순회 가능한 객체로 변경하여 순회하세요.

```javascript
const arr = [1, 2, 3];

// 잘못된 예
for (let i in arr) {
  console.log(arr[i]);
}

// 좋은 예
for (const item of arr) {
  console.log(item);
}

// 또는
arr.forEach(item => {
  console.log(item);
});
```

### 상수
- 상수는 SCREAMING_SNAKE_CASE를 사용하세요.

```javascript
const MAX_COUNT = 100;
```

### 사용하지 않는 변수
- 사용하지 않는 변수는 선언도 하지 마세요.

### 공백 사용
- 함수 뒤에 공백을 사용하세요.
- 예약어 뒤에 공백을 사용하세요.

```javascript
// 잘못된 예
if(condition) { ... }

// 좋은 예
if (condition) { ... }
```

- 쉼표 뒤에 공백을 사용하세요.
- 연산자 뒤에 공백을 사용하세요.

### 비교 연산자
- 항상 `===`를 사용하세요. (`==` 대신)

## 객체

### 객체 생성
- 리터럴을 사용하세요.

```javascript
// 잘못된 예
const obj = new Object();

// 좋은 예
const obj = {};
```

### 메서드
- 단축 구문을 사용하세요.

```javascript
// 잘못된 예
const obj = {
  value: 1,
  addValue: function(value) {
    return obj.value + value;
  }
};

// 좋은 예
const obj = {
  value: 1,
  addValue(value) {
    return obj.value + value;
  }
};
```

### 속성
- 단축 구문을 사용하세요.

```javascript
const key = 'key';

// 잘못된 예
const obj = {
  key: key,
};

// 좋은 예
const obj = {
  key,
};
```

- 단축 구문은 시작에 모아주세요.

```javascript
const anakinSkywalker = 'Anakin Skywalker';
const lukeSkywalker = 'Luke Skywalker';

// 잘못된 예
const obj = {
  episodeOne: 1,
  twoJediWalkIntoACantina: 2,
  lukeSkywalker,
  episodeThree: 3,
  mayTheFourth: 4,
  anakinSkywalker,
};

// 좋은 예
const obj = {
  lukeSkywalker,
  anakinSkywalker,
  episodeOne: 1,
  twoJediWalkIntoACantina: 2,
  episodeThree: 3,
  mayTheFourth: 4,
};
```

### 식별자
- 유효하지 않은 식별자만 따옴표(`'`)를 사용하세요.
  - 유효하지 않은 식별자?
    - JavaScript에서 속성 식별자는 알파벳, 언더바(`_`), 달러사인(`$`)으로만 시작해야 합니다.
    - 시작 이후에는 숫자가 들어갈 수 있습니다.

```javascript
const obj = {
  validKey: 1,
  "invalid-key": 2,  // 중간에 대시 들어감 ⇒ 유효하지 않은 식별자
  "123name": 3       // 숫자로 시작함 ⇒ 유효하지 않은 식별자
};
```

### 얕은 복사
- 전개 구문(`...`)을 사용하세요.

```javascript
const original = { a: 1, b: 2 };
const copy = { ...original, c: 3 }; // copy ⇒ { a: 1, b: 2, c: 3 }

const { a, ...noA } = copy; // noA ⇒ { b: 2, c: 3 }
```

## 배열

### 생성
- 리터럴을 사용하세요.

```javascript
// 잘못된 예
const arr = new Array();

// 좋은 예
const arr = [];
```

### 값 할당
- 생성할 때를 제외하고는 `Array.prototype.push`를 사용하세요.

```javascript
// 좋은 예
const arr = [];
arr.push('abcdefg');
```

### 복사
- 전개 구문(`...`)을 사용하세요.

```javascript
// 좋은 예
const arr = [1, 2, 3];
const copy = [...arr];
```

### 순회 가능 객체로 변환
- `Array.from()`보다는 전개 구문(`...`)을 사용하세요.

```javascript
const foo = document.querySelectorAll('.foo');

// 좋은 예
const nodes = Array.from(foo);

// 더 좋은 예
const nodes = [...foo];
```

### 유사 배열 변환
- 유사 배열은 전개 구문으로 변환하면 예상처럼 동작하지 않을 수 있습니다.
- `Array.from`을 사용하세요.

```javascript
const arrLike = {...};

// 좋은 예
const arr = Array.from(arrLike);
```

### 'map'
- 전개 구문(`...`) 대신 `Array.from()`을 사용하세요.
- 중간 배열을 만들지 않아 성능적으로 유리합니다.

```javascript
// 잘못된 예
const baz = [...foo].map(bar);

// 좋은 예
const baz = Array.from(foo, bar);
```

### 배열 메소드 콜백
- `return`을 **꼭** 넣으세요.

```javascript
// 좋은 예
[1, 2, 3].map((x) => {
  const y = x + 1;
  return x * y;
});

// 좋은 예 (암시적 반환)
[1, 2, 3].map(x => x + 1);
```

### 여러 줄
- 배열을 여러 줄로 작성할 때는 요소를 한 줄씩 작성하세요.

```javascript
// 잘못된 예
const arr = [
  [0, 1], [2, 3], [4, 5],
];

const objectInArray = [{
  id: 1,
}, {
  id: 2,
}];

const numberInArray = [
  1, 2,
];

// 좋은 예
const arr = [[0, 1], [2, 3], [4, 5]]; // 한 줄이면 모두 한 줄에

const objectInArray = [
  {
    id: 1,
  },
  {
    id: 2,
  },
]; // 여러 줄이면 요소별로 줄바꿈

const numberInArray = [
  1,
  2,
]; // 숫자도 마찬가지
```

## 구조 분해

### 객체에서
- 여러 속성에 접근할 때 구조 분해 할당을 이용하세요.
  - 임시 참조를 만들지 않고 불필요한 접근을 막습니다.

```javascript
// 잘못된 예
function getFullName(user) {
  const firstName = user.firstName;
  const lastName = user.lastName;

  return `${firstName} ${lastName}`;
}

// 좋은 예
function getFullName(user) {
  const { firstName, lastName } = user;
  return `${firstName} ${lastName}`;
}

// 더 좋은 예
function getFullName({ firstName, lastName }) {
  return `${firstName} ${lastName}`;
}
```

### 배열에서
- 구조 분해를 사용하세요.

```javascript
const arr = [1, 2, 3, 4];

// 잘못된 예
const first = arr[0];
const second = arr[1];

// 좋은 예
const [first, second] = arr;
```

### 함수 반환값
- 여러 값을 반환할 때는 배열보다는 객체를 반환하세요.

```javascript
// 잘못된 예
function processInput(input) {
  // ...
  return [left, right, top, bottom];
}

const [left, __, top] = processInput(input); // 순서를 고려해야 한다

// 좋은 예
function processInput(input) {
  // ...
  return { left, right, top, bottom };
}

// 필요한 데이터만 선택할 수 있음
const { left, top } = processInput(input);
```

## 문자열

### 따옴표
- 큰따옴표(`"`) 대신 작은따옴표(`'`)를 사용하세요.

### 긴 문자열
- 한 줄에 작성하세요.
- 개발 과정에서 보는 경우는 드물고, 개행되어 있으면 작업하기 어렵습니다.

### 동적 문자열
- 템플릿 리터럴을 사용하세요.
- `+`로 문자열을 연결하지 마세요.
  - 읽기 어렵고
  - 자동 형변환이 일어나면 찾기 힘듭니다.

```javascript
// 잘못된 예
function sayHi(name) {
  return 'How are you, ' + name + '?';
}

// 좋은 예
function sayHi(name) {
  return `How are you, ${name}?`;
}
```

## 함수

### 화살표 함수
- 메서드 내부에서는 화살표 함수를 사용하세요 (this 바인딩 문제 방지)

```javascript
const foo = () => {
  // ...
};
```

### 함수 이름
- 디버깅이 필요하거나 자기 참조가 필요한 경우 함수 표현식에 이름을 지정하세요.

```javascript
const foo = function bar() {
  // ...
};
```