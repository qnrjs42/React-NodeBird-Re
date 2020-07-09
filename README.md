검색엔진에서 처음 로딩 페이지가 나오면 이 페이지는 컨텐츠가 없다고 판단하여 검색엔진에서 순위가 확 떨어질 수 있다
구글 검색엔진은 똑똑해서 조금 기다리면 데이터가 온다는걸 알지만 다른 검색엔진은 그렇지 않다

검색엔진에서는 모든 데이터를 불러오는 서버 사이드 렌더링 (SSR)
SSR: 브라우저 - 프론트 서버 - 백엔드 서버 - 데이터베이스 - 백엔드 서버 - 프론트 서버 - 브라우저

방문한 페이지만 보여주는 클라이언트 사이드 렌더링 (CSR)
CSR : 브라우저 - 프론트 서버 - 브라우저 - 백엔드 서버 - 데이터베이스 - 백엔드 서버 - 브라우저

프리렌더는 검색엔진일 경우 SSR 형식, 일반유저일 경우 CSR 형식 / 근데 복잡

-------------------------------------------------------------------------------------------------------------------------

Next.js는 SSR을 쉽게 만들어 줌
Next.js를 쓰는 경우 / import Ract from 'react' / 를 쓸 필요가 없다, 있어도 상관 없음
Next.js는 pages 폴더를 인식하기 때문에 pages 폴더는 꼭 있어야 한다


주소 동적 라우팅할 때 [name].js 대괄호를 붙이면 된다

-------------------------------------------------------------------------------------------------------------------------
eslint 개발자 코드 사용 룰
예) 누구는 세미콜론 붙이고 누구는 세미콜론 안 붙이는거를 통일 시켜버린다