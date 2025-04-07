<p align="center">
  <img src="/src/assets/img/bg_logo.svg" alt="pookjayo">
</p>

<b><i><p align="center">EST soft, FE 4기, 2조</p></i></b>

## 팀원

| 역할 | 이름 | 주요 업무 |
|------|------|-----------|
| 팀장 | 정유진 | <ul><li>PM</li><li>User flow 설계</li><li>데이터 크롤 설계 - db 구조, api</li><li>비즈니스 로직 구현 - db, 유저 정보, 결제 서비스, 위시리스트</li><li>형상 관리 및 컨벤션 제정</li><li>발표 및 ppt 제작</li><li>eslint, prettier 등 개발 환경 관리 및 초기 세팅</li><li>Component - modal, calendar, button, counter</li></ul> |
| 팀원 | 김석용 | <ul><li>공통 컴포넌트 분리</li></ul> |
| 팀원 | 김인배 | <ul><li>Component - input, toast, skeleton, heart, loading</li><li>Page - login, signup, find-password</li><li>Protect route 및 private route 구현</li><li>토스트 프로바이더 구현</li><li>인풋 검증 로직 구현</li></ul> |
| 팀원 | 오초록 | <ul><li>UI design</li><li>Component - Nav, Tab, Complete, DetailSection, Horizontal list</li><li>Page - main page, search-result, my-page</li></ul> |
| 팀원 | 한은혁 | <ul><li>Component - checkbox, icon, radio, rating, verticallist</li><li>Page - details, checkout, reservation-detail, wishlist</li><li>다크 모드 구현 (로컬 스토리지 및 시스템 설정)</li><li>웹 표준 및 html 오류 수정</li></ul> |


## 프로젝트 개요

- 숙박예약 앱 구성
- 회원가입 기능
- 검색 기능
- 찜하기
- 결제 기능 구성
- mobile-first 디자인

## 개발 환경

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

- HTML 5
- JavaScript
- React v19
- Tailwind CSS v4

### 의존성
![Zustand](https://img.shields.io/badge/Zustand-brown.svg?style=for-the-badge&logo=&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![React Native](https://img.shields.io/badge/react_icon-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Swiper](https://img.shields.io/badge/Swiper-F06A6A.svg?style=for-the-badge&logo=&logoColor=white)

- zustand
- react-router
- react-icon
- swiper

### formatting

![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/prettier-%23F7B93E.svg?style=for-the-badge&logo=prettier&logoColor=black)

- eslint
- prettier

### BAAS

![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)

- Firebase
  - Firestore
  - Firebase Functions
  - Firebase Authentication
  
### 프로젝트 관리
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)
![GitHub](https://img.shields.io/badge/github_wiki-181717?style=for-the-badge&logo=github)
![GitHub](https://img.shields.io/badge/github_project-181717?style=for-the-badge&logo=github)
[![discord](https://img.shields.io/badge/Discord-blue?style=for-the-badge)](https://discord.com/)

- 형상관리: `github`
- 지식 관리: `github wiki`
- 일정 관리: `discord`
- 이슈/태스크 관리: `github project (kanban)`

### 데이터 크롤
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Python](https://img.shields.io/badge/Beautiful_soup-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Selenium](https://img.shields.io/badge/-selenium-%43B02A?style=for-the-badge&logo=selenium&logoColor=white)

- python
  - BS4
  - selenium


## 기능 요구사항


### 필수 기능
- [x] 회원인증
  - [x] 기본정보 가입 (이메일, 비밀번호, 이름)
  - [x] 로그인
  - [x] 회원가입

- [x] 전체 상품 목록 조회
  - [x] 데이터 베이스에서 상품 목록을 가져옵니다.
  - [x] 이미지, 상품명, 상품가격을 기본으로 출력합니다.
  - [x] 재고에 따라 출력여부를 결정합니다.
  - [x] 페이징을 만듭니다.
  
- [x] 상품 옵션
  - [x] 상세소개 페이지에서 상품 옵션을 선택.
  - [x] 날짜, 여행인원
 
- [x] 결제하기
  - [x] 주문 페이지에서 로직 및 주문 처리
  - [x] 데이터베이스에 주문 정보를 저장합니다.
  
- [x] 주문결과확인
  - [x] 결제를 성공적으로 처리하면 주문한 상품결과를 출력합니다.

### 선택 기능
- [x] 카테고리를 분류하여 상품을 출력합니다.
- [x] 장바구니 담기 => 위시리스트
  - [x] 체크박스를 통해 상품을 선택/제외합니다.
  - [ ] 주문하기 버튼으로 결제화면으로 이동합니다.
- [x] 주문내역확인
  - [x] 별도 주문 내역페이지에 주문한 이력을 출력합니다.  

### 추가 기능
- [x] 다크 모드
- [x] 포인트 시스템
- [x] 반응형 디자인
- [x] 로컬 스토리지를 활용한 상태 관리
- [x] 로그인 없이 위시리스트 구현
- [x] 프로텍트, 퍼블릭 라우트

## 주요 기능 설명

### 매인 페이지
<table>
  <tr>
    <td><img src="docs/ppt/screen-shot/01.png" height="600px"></td>
    <td><img src="docs/ppt/screen-shot/02.png" height="600px"></td>
    <td><img src="docs/ppt/screen-shot/03.png" height="600px"></td>
  </tr>
</table>

- 검색 기능
- 추천 호텔 및 카테고리 바로 가기 가능
- 캘린더 모달로 날짜 선택
- 사람수 선택택 모달

### 검색 결과 페이지
<table>
  <tr>
    <td><img src="docs/ppt/screen-shot/04.png" height="600px"></td>
    <td><img src="docs/ppt/screen-shot/05.png" height="600px"></td>
    <td><img src="docs/ppt/screen-shot/06.png" height="600px"></td>
  </tr>
</table>

- 검색어로 검색결과
- 검색 모달로 검색 가능
- 상단에 탭을 눌러 카테고리 필터링
  
### 관심 숙소

<table>
  <tr>
    <td><img src="docs/ppt/screen-shot/07.png" height="600px"></td>
    <td><img src="docs/ppt/screen-shot/08.png" height="600px"></td>
  </tr>
</table>


- 검색 결과에서 하트를 눌러 관심숙소에 추가 가능
- 관심숙소 페이지에 저장됨
- 로컬로 저장했다가 로그인하면 반영
  
### 로그인


<table>
  <tr>
    <td><img src="docs/ppt/screen-shot/09.png" height="600px"></td>
    <td><img src="docs/ppt/screen-shot/09.png" height="600px"></td>
    <td><img src="docs/ppt/screen-shot/11.png" height="600px"></td>
  </tr>
</table>

- 입력 검증
- 서버 측 로그인 검증증

### 회원가입

<table>
  <tr>
    <td><img src="docs/ppt/screen-shot/12.png" height="600px"></td>
    <td><img src="docs/ppt/screen-shot/13.png" height="600px"></td>
    <td><img src="docs/ppt/screen-shot/14.png" height="600px"></td>
  </tr>
</table>

- 입력 검증
- 서버 측 로그인 검증증
- 회원가입시 자동 로그인 및 라우팅팅

### 상세 페이지
<table>
  <tr>
    <td><img src="docs/ppt/screen-shot/17.png" height="600px"></td>
    <td><img src="docs/ppt/screen-shot/18.png" height="600px"></td>
    <td><img src="docs/ppt/screen-shot/19.png" height="600px"></td>
  </tr>
</table>


### 결제 페이지

<table>
  <tr>
    <td><img src="docs/ppt/screen-shot/20.png" height="600px"></td>
    <td><img src="docs/ppt/screen-shot/21.png" height="600px"></td>
    <td><img src="docs/ppt/screen-shot/22.png" height="600px"></td>
  </tr>
</table>


- 입력 값에 따라 결제 검증 및 제출
- 서버에 예약 내역 기록
  
### 마이페이지
<img src="docs/ppt/screen-shot/26.png" height="600px">

- 유저 정보 확인 가능
- 다크모드 가능

### 예약 상세

<table>
  <tr>
    <td><img src="docs/ppt/screen-shot/23.png" height="600px"></td>
    <td><img src="docs/ppt/screen-shot/24.png" height="600px"></td>
    <td><img src="docs/ppt/screen-shot/25.png" height="600px"></td>
  </tr>
</table>


- 서버에서 예약 내역 가져오서 상세 확인

### 다크모드

<table>
  <tr>
    <td><img src="docs/ppt/screen-shot/28.png" height="600px"></td>
    <td><img src="docs/ppt/screen-shot/29.png" height="600px"></td>
    <td><img src="docs/ppt/screen-shot/30.png" height="600px"></td>
  </tr>
</table>


- 마이페이지에서 다크모드 
  - 시스템 설정이랑 로컬 스토리지 확인해서 구현현

## 주요 기술 구현

### 데이터 수집 (크롤링)

- Python, Beautiful Soup, Selenium을 활용한 웹 스크래핑
- 전국 9개 지역의 숙소 정보 수집 (각 100개씩, 900개)

### 상태 관리 (Zustand)

- 간결한 상태 구현
- 로컬 스토리지 연동 (persist)
- FSM(Finite State Machine) 패턴과 세션 스토리지를 적용한 결제 프로세스
  - side-effect 방지

### 모달 및 토스트 알림

- React Portal을 활용한 독립적 렌더링
- 전역 및 지역 상태 분리로 렌더링 최적화

### 라우팅

- public/private 라우팅 구현
- 인증 상태에 따른 경로 보호

### 스타일링

- Tailwind CSS 활용
  - **우수한 DX**
  - 성능 저하 없음 (CSS in Js)
  - 컴포넌트 설계에 적합 (CSS Module)
- 내장 기능(`dark:`)으로 다크 모드 간결하고 컴포넌트 단에서 구현

### 페이지네이션

- 모바일이라는 특성에 맞춰 무한 스크롤로 페이지 네이션 구현
- 최하단에 observer를 부착한 요소를 로딩 애니메이션(svg)로 배치
  - 로딩 애니메이션을 사용자가 보게되는 동시에 옵저버가 트리거되며 새로운 정보를 로딩
![img](/docs/infinite-scroll.gif)

### 예약

- 예약 요청 검증 (client && firebase functions)
  - 사용자 정보, 객실 ID, 날짜, 결제 정보 등의 필수 입력값 검증
  - 날짜 형식 및 유효성 검증 (체크아웃 > 체크인)
- 객실 가용성 확인 (일반적으로는 검색에서 필터링되어 접근이 불가)
  - 요청된 날짜 범위에 해당 객실이 예약 가능한지 확인
  - 이미 예약된 날짜와 겹치는지 검증
- 트랜잭션 처리 
  - 예약 정보 생성 (reservations 컬렉션)
  - 객실 예약 상태 업데이트 (rooms.reservedDates)
  - 호텔 예약 가능 여부 카운터 업데이트 (availability.dates)
  - 검색 인덱스 갱신 (예약 가능 객실이 0개인 날짜는 search_index.reservedDates에 추가)
- 결제 및 포인트 처리
  - 사용자 포인트 차감 및 기록
  - 결제 트랜잭션 생성

### n-gram 인덱싱
- firestore는 no sql이라 전문 검색이 불가
- 호텔의 이름과 주소를 ngram으로 쪼개고 합쳐서 `combined_ngram`을 구성
- 상수시간 복잡도로 찾을수 있도록 객체에 ngram을 키로, 값은 모두 `true`로 할당하여 구상
- 호텔마다 n-gram이 있으면 호텔의 uid를 가지고 있음
  - 호텔은 호텔의 정보만 가지고 기타 예약 사항, 가격 정보는 search_index로 보내 추상화 및 쿼리 최적화
  
### 검색 (필터링)

- 검색 요청 처리
  - 검색어, 지역, 카테고리, 날짜 범위 등 조건 확인
  - 검색어 ngram 생성
- 날짜 기반 사전 필터링
  - 요청된 날짜 범위에 예약 불가능한 호텔 필터링
  - search_index.reservedDates 배열 활용
    - 여행 일정 사이의 모든 날 중 하나라도 reservedDate에 있으면 필터링
- 호텔 검색 처리
  - (검색 결과에서 이미 필터링된 호텔 제외)
  - 일반 조건 검색 (ngram, 지역, 카테고리)
- 예약 가능 객실 확인
  - 검색 결과 호텔 (적어도 1개 이상의 예약 가능한 방이 있음이 확인됨)의 모든 방을 조회
    - 호텔은 방의 uid를 가지고 있어 rooms 콜렉션을 uid로 조회
    - rooms안의 문서에 reservedDate가 여행 일정 사이에 있으면 필터링
- 검색 => 호텔 필터링 => 호텔 내에서 객실 필터링


### 성능 최적화 전략

- 캐싱 전략
  - 인메모리 캐시와 IndexedDB를 활용한 클라이언트 측 캐싱
- 데이터 구조 최적화
  - 모든 날을 생성하는 것이 아니라 예약된 날만 저장
    - 날짜 데이터를 배열이 아닌 객체 형태로 저장 (O(1) 접근 가능)
    - 데이터 크기 최소화 및 빠른 조회 가능
  - 검색 인덱스에 예약 불가 날짜만 저장하여 데이터 크기 최소화
- 트랜잭션 처리
  - 모든 데이터 변경 작업을 단일 트랜잭션으로 처리하여 일관성 유지
  - 예약 처리 시 원자적 업데이트 보장
- 효율적인 쿼리 설계  
  - 날짜 필터링을 검색 초기 단계에서 수행하여 처리할 데이터 최소화
  - 필요한 데이터만 정확하게 조회하는 쿼리 설계 

## 기능 구현 세부 사항

### 데이터 흐름

```mermaid
flowchart TD
    %% 사용자와 UI 상호작용
    subgraph main page
    U[User] -->|클릭: 검색 버튼| SB[검색 버튼]
    U -->|클릭: 좋아요 버튼|tt
    U -->|클릭: 숙소카드| mmc
    mmc[숙소카드]
    subgraph #header
    SB --> SI[검색 입력 노출]
    tt[좋아요]
    end

    end
    subgraph search result
    SI -->|입력: 검색어| SR[검색 요청]
    SR -->|응답| MC[숙소 카드 목록 표시]
    end

    subgraph Firebase
    subgraph Firestore
    MC -->|클릭: 좋아요 버튼| WL[wishlist]
    end
    end

    WL -->|데이터 전달| LP
    tt -->|진입: 좋아요 페이지| LP

    subgraph wishlist page
    LP[좋아요 목록 조회] --> |데이터 전달| rendering
    end

    %% 숙소 상세정보 요청
    subgraph hotel detail page
    mmc --> |선택: 숙소카드| MD
    MC -->|선택: 숙소 카드| MD[숙소 상세 정보 요청]
    MD -->|데이터 수신| RD[상세 정보 렌더링]
    end
```

### 검색 필터링

#### 숙박 업체 필터링

```mermaid
sequenceDiagram
    actor 사용자
    participant API
    participant 검색미들웨어
    participant 인덱스DB
    participant 메인DB
    
    사용자->>API: 검색 요청(검색어, 지역, 날짜 범위)
    activate API
    
    API->>검색미들웨어: 검색 요청 전달
    activate 검색미들웨어
    
    검색미들웨어->>검색미들웨어: 검색어 ngram 생성(한글 자모)
    
    검색미들웨어->>인덱스DB: ngram 인덱스 조회
    activate 인덱스DB
    인덱스DB-->>검색미들웨어: 검색어 일치 항목들
    deactivate 인덱스DB
    
    검색미들웨어->>인덱스DB: 날짜 기반 필터링(search_index.reservatedDates)
    activate 인덱스DB
    인덱스DB-->>검색미들웨어: 날짜 가용성 정보
    deactivate 인덱스DB
    
    검색미들웨어->>검색미들웨어: 필터링 로직 적용
    
    검색미들웨어->>검색미들웨어: 결과 정렬 및 페이징
    Note right of 검색미들웨어: 상위 20개 항목 선택
    
    검색미들웨어->>메인DB: 최종 필터링된 호텔 ID로 상세 정보 요청
    activate 메인DB
    메인DB-->>검색미들웨어: 20개 호텔 상세 정보
    deactivate 메인DB
    
    검색미들웨어-->>API: 필터링된 최종 결과(20개)
    deactivate 검색미들웨어
    
    API-->>사용자: 검색 결과 반환
    deactivate API
```
#### 객실 필터링

```mermaid
sequenceDiagram
    participant 검색미들웨어
    participant 객실필터링서비스
    participant 메인DB
    
    검색미들웨어->>객실필터링서비스: 호텔 uid 목록 전달
    activate 객실필터링서비스
    
    객실필터링서비스->>메인DB: 호텔 uid로 객실 uid 목록 요청
    activate 메인DB
    메인DB-->>객실필터링서비스: 호텔의 모든 객실 uid 목록
    deactivate 메인DB
    
    loop 각 객실에 대해
        객실필터링서비스->>메인DB: 객실 uid로 예약일 정보 요청
        activate 메인DB
        메인DB-->>객실필터링서비스: 객실 예약일 정보(reservatedDates)
        deactivate 메인DB
        
        객실필터링서비스->>객실필터링서비스: 요청 날짜 범위와 예약일 비교
        Note right of 객실필터링서비스: 요청 날짜와 reservatedDates가<br>겹치지 않으면 가용 객실로 판단
    end
    
    객실필터링서비스->>객실필터링서비스: 가용 객실 목록 생성
    
    객실필터링서비스->>메인DB: 가용 객실 상세 정보 요청
    activate 메인DB
    메인DB-->>객실필터링서비스: 객실 상세 정보(가격, 옵션 등)
    deactivate 메인DB
    
    객실필터링서비스-->>검색미들웨어: 가용 객실 목록 및 상세 정보
    deactivate 객실필터링서비스
```

### 결제 상태 관리 (FSM)

```mermaid
stateDiagram-v2
  [*] --> IDLE
  
  IDLE --> DATA_LOADED
  IDLE --> ERROR
  
  DATA_LOADED --> PROCESSING
  DATA_LOADED --> ERROR
  DATA_LOADED --> IDLE
  
  PROCESSING --> COMPLETED
  PROCESSING --> ERROR
  
  COMPLETED --> IDLE
  
  ERROR --> IDLE
  ERROR --> DATA_LOADED
```

### reservation(payment) middle ware

```mermaid
sequenceDiagram
    participant auth Store
    participant checkout page
    Note over reservation Store: state: initial
    par global store
        auth Store ->> checkout page : user info
    and 
        auth Store ->> reservation Store : users info
    end
    checkout page ->> reservation Store : room uid  
    reservation Store ->> firebase: room uid 
    firebase ->> reservation Store : room info
    Note over reservation Store : make room info immutable 
    Note over reservation Store : state: dataLoaded
    reservation Store ->> checkout page : room info  
    checkout page ->> reservation Store : ask payment (users input)
    Note over reservation Store : state: processing
    reservation Store ->> firebase : ask payment<br/> (user info, users input,room uid)
    firebase ->> reservation Store : payment result
    Note over reservation Store : state: completed || errror
    reservation Store ->> checkout page : payment result
```

### 결제 시퀀스

```mermaid
sequenceDiagram
    participant a as component
    participant c as reservation Store
    participant f as payment Service
    participant g as firebase/paymentApi
    participant d as firebase
    
    c -->> a :   give room data to component
    a -->> c :  component ask payment
    Note over c : state: processing
    c ->> f : requestPayment<br/>(user, usersInput, roomUid)
    f ->> g: processPayment<br/>{data}
    g ->> d: callFunction('payment', {data})
    d ->> g: return Success || Fail
    g ->> f: return Success || Fail
    f ->> c: return Success || Fail
    Note over c : state: completed || error
    c ->> a: return Success || Fail
    Note over a : Conditional Rendering
```

### firebase 통신

```mermaid

sequenceDiagram
    participant a as auth Store
    participant b as checkout page
    participant c as reservation Store
    participant f as payment Service
    participant e as firebase/searchQuery
    participant g as firebase/paymentApi
    participant d as firebase

    Note over c : state: initial
    
    par global store
        a ->> b : user info
    and 
        a ->> c : users info
    end

    b ->> c : loadRoom(room uid)  
    c ->> e: getRoomById(room uid) 
    e ->> d: getDoc()
    d ->> e : return roomData
    e ->> c: return roomData
    Note over c : make room info immutable 
    Note over c : state: dataLoaded
    c ->> b : return RoomData


    b ->> c : submitPayment (users input)
    Note over c : state: processing
    c ->> f : requestPayment<br/> (user info, users input,room uid)
    f ->> g: processPayment<br/>{data}
    g ->> d: callFunction('payment', {data})
    d ->> g: return Success || Fail
    g ->> f: return Success || Fail
    f ->> c: return Success || Fail
    Note over c : state: completed || error
    c ->> b: return Success || Fail
    Note over b : Conditional Rendering
```


### Firebase Firestore 데이터베이스 구조

```mermaid
flowchart TD
    subgraph 호텔 관련
        Hotels[Hotels 컬렉션]
        Rooms[Rooms 컬렉션]
        SearchIndex[Search_Index 컬렉션<br/>문서 ID: 호텔 이름]
    end
    
    subgraph 사용자 관련
        Users[Users 컬렉션<br/>문서 ID: uid]
        PointHistory[PointHistory 컬렉션<br/>문서 참조: uid]
        Reservations[Reservations 컬렉션<br/>사용자 참조: uid<br/>방 참조: roomUid]
    end
    
    %% 연결 관계
    Hotels -->|rooms 배열에 uid 포함| Rooms
    Hotels -->|동일한 이름으로 참조| SearchIndex
    Users -->|uid로 연결| PointHistory
    Users -->|uid로 연결| Reservations
    Rooms -->|roomUid로 연결| Reservations
    
    classDef hotel fill:#e6f7ff,stroke:#1890ff,stroke-width:1px;
    classDef user fill:#f6ffed,stroke:#52c41a,stroke-width:1px;
    
    class Hotels,Rooms,SearchIndex hotel;
    class Users,PointHistory,Reservations user;
```

```mermaid
graph TD
    users["users
    문서ID: user_uid
    - name
    - email
    - points
    - password_hash
    - created_at"]
        
    hotels["hotels
    문서ID: hotel_uid
    - name
    - location
    - description
    - category
    - amenities[]
    - images[]
    - rating"]
        
    rooms["rooms
    문서ID: room_uid
    - hotel_uid
    - name
    - price
    - description
    - capacity
    - amenities[]
    - images[]
    - reservatedDates[]"]
        
    availability["availability
    문서ID: hotel_uid
    - dates{date: count}"]
        
    search_index["search_index
    문서ID: hotel_uid
    - ngram_name{ngram: true}
    - ngram_location{ngram: true}
    - reservatedDates[]"]
        
    reservations["reservations
    문서ID: reservation_uid
    - user_uid
    - hotel_uid
    - room_uid
    - check_in
    - check_out
    - total_price
    - status
    - created_at"]
        
    transactions["transactions
    문서ID: transaction_uid
    - user_uid
    - reservation_uid
    - amount
    - payment_method
    - status
    - created_at"]
        
    point_history["point_history
    문서ID: point_history_uid
    - user_uid
    - reservation_uid
    - points
    - type
    - created_at"]
    
    %% 참조 관계 표시
    users -.-> reservations
    users -.-> transactions
    users -.-> point_history
    
    hotels -.-> rooms
    hotels -.-> availability
    hotels -.-> search_index
    
    rooms -.-> reservations
    
    reservations -.-> transactions
    reservations -.-> point_history
    
    %% 스타일 적용
    classDef collection fill:#f9f9f9,stroke:#333,stroke-width:2px
    class users,hotels,rooms,availability,search_index,reservations,transactions,point_history collection
```


## 프로젝트 구조
```
📜eslint.config.js // eslint 설정 
📜index.html       // 진입 포인트
📜package.json     // 의존성
📦src              // 소스
 ┣ 📂assets        // 정적파일
 ┃ ┣ 📂ico         // 아이콘 
 ┃ ┗ 📂img         // 이미지 
 ┣ 📂components    // 컴포넌트
 ┣ 📂firebase      // firebase 관련 서비스
 ┣ 📂pages         // 페이지
 ┣ 📂routes        // 라우팅
 ┣ 📂services      // 서비스
 ┣ 📂store         // 스토어
 ┣ 📜App.css       // tailwind entry point
 ┣ 📜App.jsx       // react entry point
 ┣ 📜index.css  
 ┗ 📜main.jsx
```

## 배포 링크

<img src="docs/qr.png">
