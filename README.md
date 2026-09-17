# VocaLoop - 영단어 SRS 학습 웹앱

간격 반복(SM-2) 알고리즘 기반의 영어 단어 학습 SPA. 백엔드 없이 브라우저 localStorage에만
데이터를 저장하며, 새로고침해도 학습 기록이 유지됩니다.

## 기술 스택

- React 18 + TypeScript 5 + Vite
- Zustand (상태 관리)
- Tailwind CSS 4
- Web Speech API (발음 듣기)
- Vitest + React Testing Library

## 실행 방법

```bash
npm install
npm run dev       # 개발 서버 (http://localhost:5173)
npm run build     # 프로덕션 빌드 (tsc -b && vite build)
npm run preview   # 빌드 결과 미리보기
npm run test      # 단위/컴포넌트 테스트 실행
npm run test:watch
```

## 주요 기능

- **학습(SRS)**: 오늘 복습해야 할 카드만 필터링해 순서대로 학습. 스페이스바로 카드 뒤집기,
  숫자키 1~4로 난이도(다시/어려움/보통/쉬움) 선택, 발음 듣기 버튼 제공.
- **퀴즈**: 예문 빈칸 채우기 / 뜻 객관식 문제를 무작위로 생성해 채점.
- **대시보드**: 오늘 학습한 카드 수, 전체 단어 수, 복습 예정 카드 수, 최근 7일 학습 그래프.
- **단어 관리**: 단어 직접 추가/수정/삭제.
- **설정**: 다크모드 토글, 학습 데이터 JSON export/import.
- 앱 최초 실행 시 50개의 기본 단어가 자동으로 채워집니다.

## 폴더 구조

```
src/
  components/   화면별 React 컴포넌트 (study, quiz, dashboard, manage, settings)
  hooks/        useSpeech, useKeydown, useTheme 등 커스텀 훅
  lib/          SM-2 알고리즘, 퀴즈 생성/채점, 날짜 유틸, 저장소 어댑터, seed 데이터 (순수 함수)
  store/        Zustand 스토어
  types/        WordCard, QuizQuestion 등 타입 정의
```

## 데이터 저장 계층

`src/lib/storage/DataStorage.ts` 인터페이스로 저장 로직을 분리했습니다. 현재는
`localStorageAdapter`가 이를 구현하지만, 추후 IndexedDB나 서버 API로 교체할 때
이 인터페이스만 새로 구현하면 store 코드는 수정할 필요가 없습니다.
