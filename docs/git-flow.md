# Git Flow

## overview

```mermaid
gitGraph
  branch hotfix/123

  checkout main
  commit
  commit

  branch develop
  checkout develop

  commit
  branch feature/123
  checkout feature/123
  commit
  checkout develop
  merge feature/123

  commit
  branch bugfix/123
  checkout bugfix/123
  commit
  checkout develop
  merge bugfix/123

  commit
  branch refactor/123
  checkout refactor/123
  commit
  checkout develop
  merge refactor/123

  checkout develop
  commit

  checkout main
  merge develop
  checkout develop

  checkout hotfix/123
  commit
  commit

  checkout develop 
  merge hotfix/123
  commit 

  checkout main
  merge develop
  commit
  checkout develop
  commit
```

## 브랜치 종류

- `main`
    - 긴급 수정: `hotfix/`
        - `hotfix/security-vulnerability`
- `develop`
    - 기능 개발: `feature/`
        - `feature/login-system`
    - 디자인 변경: `design/`
        - `design/landing-page-redesign`
    - 버그 수정: `bugfix/`
        - `bugfix/blinking`
    - 리팩토링: `refactor/`
        - `refactor/improve-performance`
    - 문서: `docs/`
        - `docs/api-guide`
    - 테스트: `test/`
        - `test/integration-test`
    - 잡무: `chore/`
        - `chore/update-dependencies`
    - 코드 스타일 변경: `style/`
        - `style/lint-fixes`
    - 성능 개선: `perf/`
        - `perf/optimize-database`
- `release`는 운용 안함

## 브랜치 네이밍 규칙

- 모든 브랜치명은 **소문자**로 작성
- 단어 사이는 **하이픈(-)** 로 구분
- 브랜치 유형 다음에 **슬래시(/)** 를 사용하여 구분
- 설명적이고 간결한 이름 사용


## 사용법

- 새 브랜치 생성 시 적절한 접두사(prefix) 선택 후 슬래시(/) 뒤에 작업 내용 명시
    - 예: `feature/user-authentication`
- 브랜치명은 해당 작업의 목적을 명확히 표현
    - 예: `bugfix/login-error` (O)
    - 예: `bug` (X)
- 작업 완료 후 `develop` 브랜치로 Pull Request 생성
- 코드 리뷰 후 승인 시 `develop`에 머지
- 긴급 수정만 `main` 브랜치에서 `hotfix/` 브랜치 생성 후 작업

## 예시

```bash
# 새로운 기능 개발 시
git checkout develop
git pull
git checkout -b feature/user-profile-update

# 버그 수정 시
git checkout develop
git pull
git checkout -b bugfix/password-reset-issue

# 긴급 보안 패치 시
git checkout main
git pull
git checkout -b hotfix/xss-vulnerability

# 성능 개선 작업 시
git checkout develop
git pull
git checkout -b perf/reduce-loading-time
```
