---
marp: true
theme: gaia
# paginate: true
backgroundColor: #fff
class: lead
size: 4K
---

<style>
* {
  font-family: 'fira code', interop
}
section {
}

ul, ol {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: fit-content;
  margin: 0 auto;
}

/* 테이블 내부의 ul, ol 스타일 유지 */
table ul, table ol {
  display: block;
  width: auto;
  margin: 0;
  padding-left: 20px;
}

/* 네스팅된 ul, ol은 기본 블록 스타일 유지 */
ul ul, ul ol, ol ul, ol ol {
  display: block;
  margin-left: 20px; /* 들여쓰기 유지 */
  width: auto;
}
h1, h2, h3 {
  margin-bottom: 32px;
}


.header {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20px;
  font-weight: bold;
  font-style: italic;
}

table { font-size: 12px; }

</style>

![img](./bg_logo.svg)


<br/>

###### 2팀:  정유진, 김석용, 김인배, 오초록, 한은혁

---

# 목차

1. 프로젝트 개요
2. 팀 구성 및 역할
3. 수행 절차 및 방법
4. 프로젝트 수행 경과
5. 자체 평가 의견
---

<div class="header">프로젝트 개요</div>

## 숙박 예약 앱 

- 숙박예약 앱 구성
- 회원가입 기능
- 검색 기능
- 찜하기
- 결제 기능 구성
- mobile-first

---
<div class="header">프로젝트 개요</div>

## 언어
- HTML5, CSS3, JS
- React
- Tailwind

---
<div class="header">프로젝트 개요</div>

## 프로젝트 관리

- discord
- github wiki
- github project (kanban)

---

<div class="header">프로젝트 개요</div>

## 활용 방안 및 기대 효과

- 실시간 예약 및 결제
- 검색 및 가격 비교
- 리뷰 및 평점 확인
- 예약 관리 및 일정 조율
---

## 팀 구성 및 역할

| 역할 | 이름 | 주요 업무 |
|------|------|-----------|
| 팀장 | 정유진 | <ul><li>PM</li><li>User flow 설계</li><li>데이터 크롤 설계 - db 구조, api</li><li>비즈니스 로직 구현 - db, 유저 정보, 결제 서비스, 위시리스트</li><li>형상 관리 및 컨벤션 제정</li><li>발표 및 ppt 제작</li><li>eslint, prettier 등 개발 환경 관리 및 초기 세팅</li><li>Component - modal, calendar, button, counter</li></ul> |
| 팀원 | 김석용 | <ul><li>공통 컴포넌트 분리</li></ul> |
| 팀원 | 김인배 | <ul><li>Component - input, toast, skeleton, heart, loading</li><li>Page - login, signup, find-password</li><li>Protect route 및 private route 구현</li><li>토스트 프로바이더 구현</li><li>인풋 검증 로직 구현</li></ul> |
| 팀원 | 오초록 | <ul><li>UI design</li><li>Component - Nav, Tab, Complete, DetailSection, Horizontal list</li><li>Page - main page, search-result, my-page</li></ul> |
| 팀원 | 한은혁 | <ul><li>Component - checkbox, icon, radio, rating, verticallist</li><li>Page - details, checkout, reservation-detail, wishlist</li><li>다크 모드 구현 (로컬 스토리지 및 시스템 설정)</li><li>웹 표준 및 html 오류 수정</li></ul> |

---
# 수행 절차 및 방법

- 25 03 04 - 03 13 : 기획, 컨벤션 협의 및 구성
- 25 03 14 - 03 20 : 공통 컴포넌트 개발 &  DB 구성
- 25 03 21 - 04 01 : 페이지 개발 및 데이터 연결, 테스트
- 25 04 02 - 04 04 : 배포 및 문서화 
---
<div class="header">수행 절차 및 방법</div>

## git flow 활용

![width:900px](./mermaid-diagram.png)

---
<div class="header">수행 절차 및 방법</div>

## 컨벤션

- github wiki 활용
- eslint & prettier 사용
  - airbnb와 google의 스타일 가이드 참고

---

# 프로젝트 수행 경과

---

## crawling

---

<div class="header">프로젝트 수행 경과 / crawling </div>

### 타겟 선정

- 타겟은 로그인을 요구하지 않고 CAPTCHA를 운영하지 않는 여기어때
- 전국 9개의 지역마다 100개 씩 정보 수집 

---
<div class="header">프로젝트 수행 경과 / crawling </div>

### 크롤링 전략

- 대용량 데이터 처리에 적합한 python 활용 
  
- `lazy-loading`과 js를 활용한 렌더링이 존재
  - 정적 html parser로는 불가
  - 직접 방문후 스크래핑
    - `beautiful soup`과 `selenium`을 활용

---
<div class="header">프로젝트 수행 경과 / crawling </div>

### 스크랩

- 접근성을 위해 마련된 `aria-label` 을  css selector로 찾고
- 그 안에서 xpath를 기반으로 정보 식별하고 스크래핑

--- 

## db: firestore

---

<div class="header">프로젝트 수행 경과 / firestore </div>

### firestore

- firebase에서 제공하는 firestore 활용
- firestore => no sql => 콜력션과 문서로 이루어짐

---
<div class="header">프로젝트 수행 경과 / firestore </div>

### 유사 관계형 구현

- 서비스 특성상 관계적인 db 구성이 필요 했음
- 항목들에 uid를 할당하여 다른 db와의 연결 포인트를 구성

--- 
<div class="header">프로젝트 수행 경과 / firestore  </div>

![width:1000px](./mermaid-diagram-db.png)

---
<div class="header">프로젝트 수행 경과 / firestore  </div>

### ~~full text search~~

---
<div class="header">프로젝트 수행 경과 / firestore  </div>


#### 전문 검색 (full text search)

- 검색어  : "부산"
- 예상 결과: "부산 호텔", "부산 모텔"
- 실제 결과: "부산"

---
<div class="header">프로젝트 수행 경과 / firestore  / full text search </div>

<style>
.left {
  width: fit-content;
  margin: 0 auto;
}
</style>

<div class="left">
firestore
<br/>
=> no sql
<br/>
=> 단순 쿼리만 가능
<br/>
=> 부분 문자열 매칭 지원 X
</div>

---
<div class="header">프로젝트 수행 경과 / firestore  / full text search </div>

#### n-gram

- 문자열을 n개씩 끊어서 인덱싱  
- 예) "부산 호텔"
  -  ["부", "부산", "산 ", "산 호", "호", "호텔", ...]  
  -   부분 문자열 매칭 가능  

---
<div class="header">프로젝트 수행 경과 / firestore  / full text search </div>

주소를 n gram
+
숙소 이름을 n gram

= `combined_n_gram`

---
<div class="header">프로젝트 수행 경과 / firestore  / full text search </div>

- `search_index` 콜렉션 안의 문서

```json
{
  title: "서면 덴바스타 호텔"
  combined_ngrams: {
    // ...
    덴바 : true,
    덴바스 : true,
    덴바스타 : true,
    덴바스타 호텔 : true,
    // ...
  }
  hotel_uid: 000e784048099
}
```

---

<div class="header">프로젝트 수행 경과 / firestore  / full text search </div>

![alt text](image-1.png)

---
<div class="header">프로젝트 수행 경과 / firestore  / full text search </div>


![width:1000px](./mermaid-diagram-db.png)

---

## server: functions

---

<div class="header">프로젝트 수행 경과 / functions </div>

### 서버의 필요성

- 유저에게 포인트를 부여
- 예약 정보의 실효성 확인
- 결제 및 예약 내역을 저장

---
<div class="header">프로젝트 수행 경과 / functions </div>

### functions

- firebase의 서버리스 컴퓨팅 서비스 functions 활용
- 회원 가입시 포인트 증정
- 회원에게 포인트 부여
- 예약 검증 및 예약 데이터 저장

---
<div class="header">프로젝트 수행 경과 / functions </div>

### ex) 회원 가입시 포인트 증정

```js
const db = getFirestore();
const userRef = db.collection('users').doc(user.uid);

await userRef.set({
  ... user
  points: signupBonus,
});

// ...

export const giveSignupPoints = functions
  .region('asia-northeast3')
  .auth.user()
  .onCreate(giveSignupPointsHandler);
```
---

## style

---
<div class="header">프로젝트 수행 경과 / style </div>


- 컴포넌트 기반의 설계 => 컴포넌트 단에서 스타일링 처리
  - ~~CSS 전처리기~~

- 성능 이슈
  - ~~CSS in JS(styled components)~~

- 분리된 파일
  - ~~css module~~

- 나쁜 DX 
  - ~~vanilla extract~~ 
  
--- 
<div class="header">프로젝트 수행 경과 / style </div>

### tailwind V4
- 컴포넌트 기반의 설계에 적합
- 성능 이슈가 없음
- 하나의 파일에서 관리
- 우수한 DX

---
<div class="header">프로젝트 수행 경과 / style </div>

- 가능한 `@apply`를 사용하지 않기

- 반복되는 부분은 컴포넌트로 분리 or 동적으로 생성

---

## react V19

---
<div class="header">프로젝트 수행 경과 / react </div>

- `react-helmet-async` 의존성 제거 가능
  - 비동기적인 meta 요소 랜더링
    - 깜빡임
  - 사이드 이펙트

---

## 상태 관리 = zustand 

---
<div class="header">프로젝트 수행 경과 / 상태관리 </div>

- 간결한 상태 구현
- persist 등의 미들웨어 제공
  - local storage & session storage에 저장

---
<div class="header">프로젝트 수행 경과  / 상태관리 </div>

### persist 

- 로컬 저장소와 원격 저장소의 hydration이 가능

- `authStore`: 비동기적 인증 상태 확인
  - 프로텍트 라우팅 등 인증 상태에 의존하는 기능
     => 로딩 초기에 문제가 발생 (초기값은 언제나 null)

---
<div class="header">프로젝트 수행 경과 / 상태관리 / persist </div>

```js
const useAuthStore = create(
  persist(
    set => {
      listenAuthState(user => 
        // ...
      ),
      // ...  
    } ,{
      name: 'auth-storage',
      getStorage: () => localStorage,
      partialize: state => ({
        user: state.user,
      }),
      onRehydrateStorage: () => state => {
        if (state) {
          state.isLoading = false;
        }
      },
    },
  )
)
```
---
<div class="header">프로젝트 수행 경과 / 상태관리 / persist </div>

####  wishlist

- 로그인 없이 wishlist를 로컬에 저장
- 로그인을 하면 해당 내역을 원격에 반영

---
<div class="header">프로젝트 수행 경과 / 상태관리 </div>

### 결제

- 클로저 내부에서 관리되는 전역 스토어 이용
  - 더 나은 보안성
- zustand를 결제 미들웨어로 활용
  - store가 서버에서의 정보를 가지고 있다가
    결제 요청시  사용자 정보와 함께 서버에 요청

---
<div class="header">프로젝트 수행 경과 / 상태관리 / 결제</div>

#### side effect

- 사용자가 결제 페이지까지 진입했다가
  취소하고 다른 숙소를 예약한다면? 
- 사용자가 여러개의 창에서 결제를 시도한다면?
- 등등등

---
<div class="header">프로젝트 수행 경과 / 상태관리 / 결제</div>

#### FSM: Finite State Machine

- 유한 개수의 상태를 가짐
- 특정 조건에서만 상태간의 전이가 일어남
- 상태 간의 전이가 명확하게 한정되어 있음

---

![bg left](./mermaid-diagram-fsm-bulb.png)

- 전구의 상태
  - OFF (꺼짐)
  - ON (켜짐)
  - BROKEN (고장남)

- 전환 조건
  - switch_on 
  - switch_off 
  - break_bulb 

---
<div class="header">프로젝트 수행 경과 / 상태관리 / 결제</div>

```js
// reservation store
canTransitionTo: nextState => {
  const { currentState } = get();
  const validTransitions = {
    [STATE.IDLE]: [STATE.DATA_LOADED, STATE.ERROR],
    [STATE.DATA_LOADED]: [STATE.PROCESSING, STATE.IDLE, STATE.ERROR],
    [STATE.PROCESSING]: [STATE.COMPLETED, STATE.ERROR],
    [STATE.COMPLETED]: [STATE.IDLE],
    [STATE.ERROR]: [STATE.IDLE, STATE.DATA_LOADED],
  };
  return validTransitions[currentState]?.includes(nextState) || false;
}
```

---
<div class="header">프로젝트 수행 경과 / 상태관리 / 결제</div>

```js
submitPayment: async userInput => {
  // ...

  if (!canTransitionTo(STATE.PROCESSING)) {
    console.error(
      `${ERR_MSG.NOT_VALID_TRANSITION}: ${currentState} => ${STATE.PROCESSING}`,
    );
    return { success: false, error: ERR_MSG.NOT_VALID_TRANSITION };
  }

  // 결제 요청 제출
}
```

---
<div class="header">프로젝트 수행 경과 / 상태관리 / 결제</div>

- 여전히 탭 서로 다른 탭에서의 결제 요청은 해결 불가
  - `persist`로 탭 별로 관리되는 session storage를 사용

---

![width:1000px](./mermaid-diagram-reservation-store.png)

---
<div class="header">프로젝트 수행 경과 / 상태관리 </div>

### modal & toast

- `react portal`을 사용해서 렌더링
  - 부모 컨테이너에 영향을 받지 않고 독립적으로 랜더링
    - side-effect에서 비교적 자유로움

- 전역 상태로 열고 닫기를 관리

--- 
<div class="header">프로젝트 수행 경과 / 상태관리  / modal & toast </div>

#### modal


- 전역 상태와 지역 상태를 나누고 렌더링은 지역 상태에만 의존
  - 단방향의 상태 변화
  - 리렌더링 최적화
  
- 변경된 정보의 외부의 전달은 전역 상태 저장소 활용

---
<div class="header">프로젝트 수행 경과 / 상태관리  / modal & toast </div>

![width:1000px](./mermaid-diagram-modal.png)

---
<div class="header">프로젝트 수행 경과 / 상태관리  / modal & toast </div>

#### toast

- 매번 상태를 초기화 => 인스턴스처럼 사용

```js
const useToastStore = create(set => ({
  message: '',
  className: '',
  showToast: (msg, className = '') => {
    set({ message: msg, className });
    setTimeout(() => set({ message: '', className: '' }), 2000);
  },
}));
```
---
<div class="header">프로젝트 수행 경과 / 상태관리  </div>

### dark mode

---
<div class="header">프로젝트 수행 경과 / 상태관리 / dark mode </div>

#### tailwind, `dark:`

```jsx
<html>
  <body class="dark">
    <div class="bg-white dark:bg-black">
      <!-- ... -->
    </div>
  </body>
</html>
```

```jsx
className = '
  border-1 border-neutral-300 bg-white text-neutral-600
  hover:border-neutral-400 
  dark:border-neutral-400 dark:bg-black dark:text-neutral-400'
'
```

---

#### `darkModeStore`

```jsx
const getInitialTheme = () => {
  const isBrowserDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches;

  const storedTheme = localStorage.getItem('theme');

  return storedTheme
    ? JSON.parse(storedTheme)
    : isBrowserDarkMode
      ? 'dark'
      : '';
};
```

---

## route: `react-router-dom`

---
<div class="header">프로젝트 수행 경과 / route </div>

### public route

```jsx
<Route element={<PublicRoute />}>
  <Route path='/login' element={<LoginPage />} />
  <Route path='/signup' element={<SignupPage />} />
  <Route path='/find-password' element={<FindPasswordPage />} />
</Route>
```

```jsx
if (user) {
  return <Navigate to='/' replace />;
}

return <Outlet />;
```
---
<div class="header">프로젝트 수행 경과 / route </div>

### private routing

```jsx
<Route element={<PrivateRoute />}>
  <Route path='/mypage' element={<MyPage />} />
  <Route path='/checkout/:roomId' element={<CheckoutPage />} />
</Route>

```

```jsx
  if (!user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <Outlet />;
```
---
## page

---
<div class="header">프로젝트 수행 경과 / page / main </div>

<style>

.container {
  display: grid; 
  grid-template-columns: repeat(3, auto); 
  gap: 50px;
  justify-content: center;
  width: fit-content;
  margin: 0 auto;
}
</style>

<div class="container">
  <img src="./screen-shot/01.png" height="600px">
  <img src="./screen-shot/02.png" height="600px">
  <img src="./screen-shot/03.png" height="600px">
</div>

---

<div class="header">프로젝트 수행 경과 / page / search-result </div>


<div class="container">
  <img src="./screen-shot/04.png" height="600px">
  <img src="./screen-shot/05.png" height="600px">
  <img src="./screen-shot/06.png" height="600px">
</div>

---
<div class="header">프로젝트 수행 경과 / page / wishlist </div>

<div class="container">
  <img src="./screen-shot/07.png" height="600px">
  <img src="./screen-shot/08.png" height="600px">
</div>

---

<div class="header">프로젝트 수행 경과 / page / login </div>

<div class="container">
  <img src="./screen-shot/09.png" height="600px">
  <img src="./screen-shot/10.png" height="600px">
  <img src="./screen-shot/11.png" height="600px">
</div>

---
<div class="header">프로젝트 수행 경과 / page / signup </div>

<div class="container">
  <img src="./screen-shot/12.png" height="600px">
  <img src="./screen-shot/13.png" height="600px">
  <img src="./screen-shot/14.png" height="600px">
</div>

--- 
<div class="header">프로젝트 수행 경과 / page / details </div>

<div class="container">
  <img src="./screen-shot/17.png" height="600px">
  <img src="./screen-shot/18.png" height="600px">
  <img src="./screen-shot/19.png" height="600px">
</div>

--- 
<div class="header">프로젝트 수행 경과 / page / checkout </div>

<div class="container">
  <img src="./screen-shot/20.png" height="600px">
  <img src="./screen-shot/21.png" height="600px">
  <img src="./screen-shot/22.png" height="600px">
</div>

---
<div class="header">프로젝트 수행 경과 / page / my-page </div>

<div class="container">
  <img src="./screen-shot/26.png" height="600px">
</div>


---
<div class="header">프로젝트 수행 경과 / page / reservation-detail </div>

<div class="container">
  <img src="./screen-shot/23.png" height="600px">
  <img src="./screen-shot/24.png" height="600px">
  <img src="./screen-shot/25.png" height="600px">
</div>

---
<div class="header">프로젝트 수행 경과 / page / ...: dark mode </div>

<div class="container">
  <img src="./screen-shot/28.png" height="500px">
  <img src="./screen-shot/29.png" height="500px">
  <img src="./screen-shot/30.png" height="500px">
</div>

---

# 자체 평가 의견

---
<style>
.small {
  font-size: 22px;
  width: 80%;
  margin: 0 auto;
}
</style>


#### 김석용

<div class="small">
  
- 실력있는 2팀에 합류해서 조원분들 한분한분들에 프로젝트 진행하는 모습을 보면서  많은걸 배웠고 2팀 팀원분들도 정말 고생들 많이 하셨습니다

</div>

---

#### 김인배

<div class="small">

1. 사전기획의 관점에서 완성도 평가(10점 만점)
   - 사전에 기획했던 디자인 ,기능대로 나왔으며
    기획했던 것 이상으로 추가한 부분들이 있다는 점으로 10점 이다.

1. 개인 또는 팀이 잘한 부분과 아쉬운 점
   - 개인이 잘한점으로는 최대한 라이브러리에 의존하지 않은점이고
    팀이 잘한 부분은 서로 코드 리뷰를 통해 부족한 부분을 알려주고
    개선 할 수 있도록 도움을 준 점이라 생각한다.

3. 결과물의 추후개선점, 보완할 점
   - 데스크탑 환경을 구현 하지 못한점과 
    실제 결제 로직을 도입하지 못하는점이 아쉽고
    추후에 개선 및 보완 할 수 있는 부분이라고 생각한다.
 
4. 프로젝트를 수행 하면서 느낀 점이나 경험한 성과
   - 이번 프로젝트를 통해 코드를 읽는법 ,  효율적으로 코드를 작성 하는것,
    컴포넌트 구조에 대해 더 깊이 있게 생각 할 수 있었던거 같고
    협업에 중요성을 다시금 느낄수 있었던 기회였던거 같다.
</div>


---

#### 오초록
<div class="small">

- 검색 결과 화면을 개발하면서 탭 클릭, 정렬 기능, 더보기 버튼 등 다양한 동작이 한 화면에 모이면서 로직이 복잡해졌고, 데이터 처리 흐름도 많아져 화면에 결과가 표시되기까지 시간이 소요되는 문제가 있었습니다. 특히 정렬 기능을 추가하면서 성능 부담이 커졌고, 결과적으로 해당 기능은 제외하게 되었습니다.
  
- 이처럼 여러 기능이 얽힌 UI 흐름을 직접 다뤄보며 복잡한 상황을 어떻게 제어할지 고민할 수 있었고, 이를 통해 실무적인 감각을 조금씩 익혀갈 수 있었습니다. 또한 모달 구현 시 스토어 데이터를 활용해보았고, 다른 개발자의 코드를 분석하고 적용해보면서 협업 환경에서 필요한 역량도 체감할 수 있었습니다.

- 아쉬웠던 점은 기획 없이 바로 디자인이 시작되었고, 그 디자인을 바탕으로 개발까지 이어졌다는 점입니다. 명확한 정의서 없이 프로젝트를 진행하다 보니 중간에 UI가 자주 변경되었고, 그때마다 반복적으로 수정 작업이 필요했습니다. 기획이 어느 정도 정리된 상태였다면 더 효율적으로 진행할 수 있었을 것 같습니다.

- 전체적으로 쉽지만은 않았지만 다양한 기술을 다뤄볼 기회였고, 실제 협업 과정의 흐름을 체험해보는 데에 의미가 있었습니다.
 
</div>

---

#### 정유진

<div class="small">

1. 사전기획의 관점에서 완성도 평가(10점 만점)
   - 사전에 기획과 디자인 대비 오히려 발전된 모습과 여러 기능이 추가되었다.
    만점을 줄 수 있을 것 같다.
  
2. 개인 또는 팀이 잘한 부분과 아쉬운 점
   - 팀으로서 결과물을 성공적으로 만들었다는 점
   - 다만 설계가 자주 변경되는 바람에 시간이 부족하여
    코드 베이스의 완성도가 일부 미비한 부분이 존재한다.
  
1. 결과물의 추후개선점, 보완할 점
   - 지금은 포인트 결제만 가능한데 실제 기능을 도입해보고 싶다
   - 여러가지 환경에 대응할 수 있는 반응형 디자인과 데스크톱용 디자인의 구현

2. 프로젝트를 수행 하면서 느낀 점이나 경험한 성과
   - 설계의 변경이 팀원 모두의 노동을 발생시키는 것을 경험하며
    사전 설계의 중요성을 몸소 체감하였다. 
   - 팀원들의 코드를 읽고고 조언하고 타인의 코드를 더 잘 읽을 수 있게 되었음.
   - 단편적이나마 함께 성장하는 법에 대해서 배울 수 있었다.
</div>

---
#### 한은혁

<div class="small">

- 이번 프로젝트를 하면서 화면 개발에 있어 기본에 충실한 코드, 클린한 코드로 작성하고자 했습니다. 이전 프로젝트까지는 기능에만 몰두한 반면 이번 프로젝트에서는 기능별로 분리된 코드, 한 눈에 알아볼 수 있는 코드를 유지하며 작업했기에 더 발전할 수 있었습니다. 

- 프로젝트를 진행하면서 팀원들과 꾸준한 소통을 한 것이 좋은 결과를 내는데 도움이 되었다고 생각합니다. 각자의 장점을 살려 프로젝트를 올바른 길로 유도할 수 있었고 서로 소통하면서 자의 생각을 나누며 서로 배울 수 있는 기회가 된 것 같습니다.

- 기획에서의 아쉬움으로 UI가 자주 변경되야하는 아쉬움이 남지만, 이 또한 경험이라 생각하며 얻어가는 것이 많은 프로젝트라고 생각합니다.

</div>

---
