# 금융상품 추천 프론트엔드

청년·직장인 금융상품 추천 서비스의 React 프론트엔드입니다.

## 기술 스택
- React 18
- Vite
- JavaScript

## 실행 전 준비
- server 저장소의 Spring Boot 서버가 먼저 실행되어 있어야 합니다

## 실행 방법

### 1. 저장소 받아오기
```bash
git clone https://github.com/ax-innovation/frontend.git
cd frontend
```

### 2. 환경변수 설정
```bash
cp .env.example .env.production
```
`.env.production` 열어서 Spring Boot 서버 주소 확인:
VITE_API_URL=http://localhost:8080

### 3. 라이브러리 설치 및 실행
```bash
npm install
npm run dev
```
브라우저에서 http://localhost:5173 접속

## 주요 화면

### 저축·적금 탭
- 입력: 나이, 연소득, 월납입액, 희망 기간, 관심 상품
- 출력: 추천 상품 목록 + 만기 수령액 시뮬레이션
- 청년도약계좌는 은행별 비교 제공

### 대출 탭
- 입력: 나이, 연소득, 대출 희망 금액, 대출 기간, 관심 상품
- 출력: 추천 상품 목록 + 월 납입액 + 연도별 상환 스케줄

## 전체 실행 순서

crawler → python run_all.py  (DB 데이터 수집)
server  → ./gradlew bootRun  (API 서버 실행)
frontend → npm run dev       (프론트엔드 실행)
http://localhost:5173 접속
