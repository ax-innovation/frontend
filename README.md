# 금융상품 추천 프론트엔드

청년·직장인 금융상품 추천 서비스의 React 프론트엔드입니다.

## 브랜치 구조
| 브랜치 | 설명 | 상태 |
|---|---|---|
| `main` | 안정적인 기본 버전 | ✅ 배포 가능 |
| `feature/portfolio` | 포트폴리오 3단계 UI, 결과 전용 화면, 합산 카드 | 🚧 개발 중 |

## 기술 스택
- React 18
- Vite
- JavaScript

## 실행 전 준비
- server 저장소의 Spring Boot 서버가 먼저 실행되어 있어야 합니다
- Node.js 20 LTS 이상이 설치되어 있어야 합니다

## 실행 방법

### 1. 저장소 받아오기
```bash
git clone https://github.com/ax-innovation/frontend.git
cd frontend
```

### 2. 브랜치 선택
```bash
# 기본 버전 (main)
git checkout main

# 포트폴리오 기능 버전
git checkout feature/portfolio
```

### 3. 환경변수 설정

**Windows:**
```bash
copy .env.example .env.production
```
**Mac/Linux:**
```bash
cp .env.example .env.production
```

`.env.production` 내용:
```
# 로컬 개발 시 그대로 사용
VITE_API_URL=http://localhost:8080

# AWS 배포 후 EC2 주소로 변경
# VITE_API_URL=http://EC2주소:8080
```

### 4. 라이브러리 설치 및 실행
```bash
npm install
npm run dev
```

브라우저에서 http://localhost:5173 접속

## 화면 구성

### 저축·적금 탭
| 모드 | 설명 |
|---|---|
| 일반 모드 | 월 납입 금액 전체로 상품 추천 + 만기 수령액 시뮬레이션 |
| 포트폴리오 모드 | 3단계 흐름으로 상품별 금액 배분 후 합산 수령액 계산 |

**포트폴리오 모드 3단계 흐름:**
```
1단계: 기본 정보 입력 + 일반/포트폴리오 모드 선택
       ↓
2단계: 상품별 금액 배분 + 추천 상품 목록에서 하나씩 선택
       ↓
3단계: 최종 합산 결과 화면 (상품별 수령액 + 합산 수령액)
```

### 대출 탭
- 시중 대출 (주택담보, 전세자금, 개인신용) + 정책 대출 (디딤돌, 버팀목)
- 월 납입액, 총 이자, 총 상환액, 연도별 상환 스케줄 제공

## 전체 실행 순서
```
1. crawler → python run_all.py     (DB 데이터 수집, 최초 1회)
2. server  → bootRun               (API 서버 실행, localhost:8080)
3. frontend → npm run dev          (프론트엔드 실행, localhost:5173)
4. 브라우저에서 http://localhost:5173 접속
```
