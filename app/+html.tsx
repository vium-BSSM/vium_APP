import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

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
        {/* 브라우저 자동 다크 모드가 색을 반전시키지 않도록 라이트 고정 */}
        <meta name="color-scheme" content="light" />

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

const inputFocusStyle = `
input:focus,
input:focus-visible,
textarea:focus,
textarea:focus-visible {
  outline: none;
}
`;

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
