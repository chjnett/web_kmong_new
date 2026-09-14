# ATELIER AERO

고급 주거 리모델링 스튜디오의 포트폴리오 시연 사이트. Next.js App Router, TypeScript, Tailwind CSS 4, GSAP ScrollTrigger, React Three Fiber / Drei / Three.js.

```bash
npm install
npm run dev
```

http://localhost:3000 에서 확인합니다. `npm run typecheck`와 `npm run build`로 검증합니다. 정적 내보내기는 `out/`에 생성되며 Vercel에서도 배포할 수 있습니다.

## 구현 범위

첨부 영상을 사용하는 Hero, 스크롤 Navbar, 브랜드 철학, 3개 프로젝트 상세, Draco 압축 GLB 기반 고정 시점 쇼룸, 4단계 공정, 고객 후기, 견적 폼, Footer. 모바일 메뉴, 키보드 쇼룸 탐색, 영상 재생 제어, 모션 축소 설정, 3D 실패 안내 포함.

## 시연 데이터

브랜드, 주소, 시공 사례, 수치, 후기는 모두 가상입니다. 문의 폼은 브라우저 내에서 유효성을 검사하고 제출 완료 화면을 표시하며 정보를 저장하거나 전송하지 않습니다. 실제 문의 수신을 위해서는 별도 서버 엔드포인트 및 개인정보 처리 동의 정책 연동이 필요합니다.

3D 모델은 `scripts/create-showroom.mjs`로 제작한 더미 주거 공간입니다. `npm run model`로 재생성할 수 있습니다. 로컬 Draco 디코더를 사용해 외부 CDN에 의존하지 않습니다. 이미지와 GLB 모델은 동일한 실측 공간을 재현한 자산이 아닌 별도의 시각화 예시입니다.

Hero 영상은 사용자 제공 원본에서 무음·웹 스트리밍 재생용으로 변환했습니다.

## 방문 통계

루트 레이아웃에 Vercel Web Analytics를 연결했습니다. Vercel의 `web-kmong-new` 프로젝트에서 Analytics → Enable을 선택한 뒤 새로 배포해야 집계가 시작됩니다. 방문자 수, 페이지 조회, 유입 경로와 기기별 통계는 Vercel 관리자 화면에서 확인합니다. 별도의 공개 `/admin` 페이지는 만들지 않습니다.

설정 이전의 방문은 소급 집계되지 않으며, 이미 보낸 이메일의 개별 수신자를 식별하거나 이메일 유입을 확정하지 않습니다. 광고 차단 등으로 실제 방문과 집계 수치에 차이가 있을 수 있습니다. 문의 폼의 입력값은 Analytics에 전송하지 않습니다.

포트폴리오 사진 3장은 내장 ImageGen으로 생성했으며, 최종 파일 경로와 제작 프롬프트는 `public/images/ASSETS.md`에 기록했습니다. 쇼룸 미리보기는 실제 GLB 렌더링 화면입니다.
