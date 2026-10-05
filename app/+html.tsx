import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

// 웹(PWA) 빌드 시 모든 페이지의 <html> 템플릿. 브라우저에서만 쓰이며 앱 코드에서 import 불가
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#ffffff" />

        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ViUM" />

        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: phoneFrameStyle }} />
        <style dangerouslySetInnerHTML={{ __html: inputFocusStyle }} />
        <script dangerouslySetInnerHTML={{ __html: registerServiceWorker }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

// 화면이 아이폰 17(402×874)보다 넓으면 가운데에 그 크기로 고정. 폰에서는 화면 전체를 그대로 사용
// body에 transform을 줘서 Modal 등 position: fixed 요소도 프레임 안에 갇히게 함
// `html body`: 나중에 로드되는 Tailwind preflight의 body { margin: 0 }에 덮이지 않도록 우선순위를 높임
const phoneFrameStyle = `
@media (min-width: 403px) {
  html {
    height: 100%;
    background-color: #EBEBEB;
  }
  html body {
    position: relative;
    width: 402px;
    height: min(874px, 100dvh);
    margin: max(0px, calc((100dvh - 874px) / 2)) auto 0;
    overflow: hidden;
    background-color: #ffffff;
    transform: translateZ(0);
  }
}
`;

// 입력칸 포커스 시 브라우저가 그리는 파란 테두리(outline) 제거. 앱과 동일하게 보이도록
const inputFocusStyle = `
input:focus,
input:focus-visible,
textarea:focus,
textarea:focus-visible {
  outline: none;
}
`;

// 서비스 워커는 배포 빌드에서만 등록. 개발 서버는 번들 주소가 매번 같아서 캐시되면 수정한 코드가 반영되지 않으므로
// 개발 중에는 이전에 등록된 서비스 워커와 캐시를 지움
const registerServiceWorker =
  process.env.NODE_ENV === 'production'
    ? `
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
`
    : `
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister());
  });
}
if ('caches' in window) {
  caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)));
}
`;
