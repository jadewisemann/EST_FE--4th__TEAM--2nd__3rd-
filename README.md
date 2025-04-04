<p align="center">
  <h1 align="center">Pookjayo</h1>
  <img src="/src/assets/img/bg_logo.svg">
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
![GitHub](https://img.shields.io/badge/githubwiki-181717?style=for-the-badge&logo=github)

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
  - [ ] 체크박스를 통해 상품을 선택/제외합니다.
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

<img src="docs/ppt/screen-shot/01.png" height="600px">
<img src="docs/ppt/screen-shot/02.png" height="600px">
<img src="docs/ppt/screen-shot/03.png" height="600px">

- 검색 기능
- 추천 호텔 및 카테고리 바로 가기 가능
- 캘린더 모달로 날짜 선택
- 사람수 선택택 모달

### 검색 결과 페이지

<img src="docs/ppt/screen-shot/04.png" height="600px">
<img src="docs/ppt/screen-shot/05.png" height="600px">
<img src="docs/ppt/screen-shot/06.png" height="600px">

- 검색어로 검색결과
- 검색 모달로 검색 가능
- 상단에 탭을 눌러 카테고리 필터링
  
### 관심 숙소

<img src="docs/ppt/screen-shot/07.png" height="600px">
<img src="docs/ppt/screen-shot/08.png" height="600px">

- 검색 결과에서 하트를 눌러 관심숙소에 추가 가능
- 관심숙소 페이지에 저장됨
- 로컬로 저장했다가 로그인하면 반영
  
### 로그인

<img src="docs/ppt/screen-shot/09.png" height="600px">
<img src="docs/ppt/screen-shot/10.png" height="600px">
<img src="docs/ppt/screen-shot/11.png" height="600px">

- 입력 검증
- 서버 측 로그인 검증증

### 회원가입

<img src="docs/ppt/screen-shot/12.png" height="600px">
<img src="docs/ppt/screen-shot/13.png" height="600px">
<img src="docs/ppt/screen-shot/14.png" height="600px">

- 입력 검증
- 서버 측 로그인 검증증
- 회원가입시 자동 로그인 및 라우팅팅

### 상세 페이지

<img src="docs/ppt/screen-shot/17.png" height="600px">
<img src="docs/ppt/screen-shot/18.png" height="600px">
<img src="docs/ppt/screen-shot/19.png" height="600px">


### 결제 페이지

<img src="docs/ppt/screen-shot/20.png" height="600px">
<img src="docs/ppt/screen-shot/21.png" height="600px">
<img src="docs/ppt/screen-shot/22.png" height="600px">

- 입력 값에 따라 결제 검증 및 제출
- 서버에 예약 내역 기록
  
### 마이페이지
<img src="docs/ppt/screen-shot/26.png" height="600px">

- 유저 정보 확인 가능
- 다크모드 가능

### 예약 상세

<img src="docs/ppt/screen-shot/23.png" height="600px">
<img src="docs/ppt/screen-shot/24.png" height="600px">
<img src="docs/ppt/screen-shot/25.png" height="600px">

- 서버에서 예약 내역 가져오서 상세 확인

### 다크모드

<img src="docs/ppt/screen-shot/28.png" height="600px">
<img src="docs/ppt/screen-shot/29.png" height="600px">
<img src="docs/ppt/screen-shot/30.png" height="600px">

- 마이페이지에서 다크모드 
  - 시스템 설정이랑 로컬 스토리지 확인해서 구현현

## 주요 기술 구현

### 데이터 수집 (크롤링)
- Python, Beautiful Soup, Selenium을 활용한 웹 스크래핑
- 전국 9개 지역의 숙소 정보 수집

### 상태 관리 (Zustand)
- 간결한 상태 구현
- 로컬 스토리지 연동 (persist)
- FSM(Finite State Machine) 패턴 적용한 결제 프로세스

### 모달 및 토스트 알림
- React Portal을 활용한 독립적 렌더링
- 전역 및 지역 상태 분리로 렌더링 최적화

### 라우팅
- public/private 라우팅 구현
- 인증 상태에 따른 경로 보호

### 스타일링
- Tailwind CSS 활용
- 다크 모드 지원


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
    c ->> f : requsetPayment<br/> (user info, users input,room uid)
    f ->> g: processPayment<br/>{data}
    g ->> d: callFunction('payment', {data})
    d ->> g: return Success || Fail
    g ->> f: return Success || Fail
    f ->> c: return Success || Fail
    Note over c : state: completed || error
    c ->> b: return Success || Fail
    Note over b : Conditional Rednering
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
