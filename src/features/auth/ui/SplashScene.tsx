import React, { memo, useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import type { SvgProps } from 'react-native-svg';
import BackgroundCircle from '@/../assets/splash/background-circle.svg';
import CharacterOnion from '@/../assets/splash/character-onion.svg';
import CharacterPotato from '@/../assets/splash/character-potato.svg';
import CharacterTomato from '@/../assets/splash/character-tomato.svg';
import IngredientBroccoli from '@/../assets/splash/ingredient-broccoli.svg';
import IngredientCarrot from '@/../assets/splash/ingredient-carrot.svg';
import IngredientEgg from '@/../assets/splash/ingredient-egg.svg';
import IngredientLeaf from '@/../assets/splash/ingredient-leaf.svg';
import IngredientMushroom from '@/../assets/splash/ingredient-mushroom.svg';
import IngredientOnion from '@/../assets/splash/ingredient-onion.svg';
import IngredientPotato from '@/../assets/splash/ingredient-potato.svg';
import IngredientTomato from '@/../assets/splash/ingredient-tomato.svg';
import LogoI from '@/../assets/splash/logo-i.svg';
import LogoM from '@/../assets/splash/logo-m.svg';
import LogoU from '@/../assets/splash/logo-u.svg';
import LogoV from '@/../assets/splash/logo-v.svg';
import ShadowOnion from '@/../assets/splash/shadow-onion.svg';
import ShadowPotato from '@/../assets/splash/shadow-potato.svg';
import ShadowTomato from '@/../assets/splash/shadow-tomato.svg';
import Tagline from '@/../assets/splash/tagline.svg';
import { sampleSplashTrack } from '../lib/sampleSplashTrack';
import {
  CHARACTER_PIECES,
  INGREDIENT_PIECES,
  LOGO_PIECES,
  PARTICLE_PIECES,
  SPLASH_EASES,
  TAGLINE_PIECE,
} from '../lib/splashTimeline';
import type { SplashPiece, SplashTrackKey } from '../lib/splashTypes';

// Figma 프레임 크기 — 모든 좌표가 이 기준
export const SPLASH_ARTBOARD_WIDTH = 402;
export const SPLASH_ARTBOARD_HEIGHT = 874;

const ASSETS: Record<string, React.FC<SvgProps>> = {
  logoV: LogoV,
  logoI: LogoI,
  logoU: LogoU,
  logoM: LogoM,
  circle: BackgroundCircle,
  shadowTomato: ShadowTomato,
  shadowOnion: ShadowOnion,
  shadowPotato: ShadowPotato,
  tomato: CharacterTomato,
  onion: CharacterOnion,
  potato: CharacterPotato,
  tagline: Tagline,
};

const INGREDIENT_ASSETS: Record<string, React.FC<SvgProps>> = {
  tomato: IngredientTomato,
  potato: IngredientPotato,
  broccoli: IngredientBroccoli,
  onion: IngredientOnion,
  carrot: IngredientCarrot,
  leaf: IngredientLeaf,
  mushroom: IngredientMushroom,
  egg: IngredientEgg,
};

interface PieceProps {
  piece: SplashPiece<string>;
  progress: SharedValue<number>;
  children: React.ReactNode;
}

/**
 * Figma 노드 하나. 움직임(이동·회전·크기·투명도)은 박스 가운데 기준으로 바깥 Animated.View에,
 * Figma에서 원래 기울어져 있던 각도는 안쪽 View에 둬서 두 회전이 섞이지 않게 함
 */
const AnimatedPiece = memo(({ piece, progress, children }: PieceProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    const { tracks } = piece;
    const value = (key: SplashTrackKey, fallback: number) => {
      const keyframes = tracks[key];
      return keyframes ? sampleSplashTrack(keyframes, progress.value, SPLASH_EASES) : fallback;
    };
    return {
      opacity: value('opacity', 1),
      transform: [
        { translateX: value('x', 0) },
        { translateY: value('y', 0) },
        { rotate: `${value('rotate', 0)}rad` },
        { scaleX: value('scaleX', 1) },
        { scaleY: value('scaleY', 1) },
      ],
    };
  });

  const [insetTop, insetRight, insetBottom, insetLeft] = piece.inset ?? [0, 0, 0, 0];

  // 좌표는 데이터마다 달라서 className으로 만들 수 없음 → 배치만 style로 지정
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        { position: 'absolute', left: piece.left, top: piece.top, width: piece.width, height: piece.height },
        animatedStyle,
      ]}
    >
      <View className="flex-1 items-center justify-center">
        <View
          style={{
            width: piece.innerWidth ?? piece.width,
            height: piece.innerHeight ?? piece.height,
            transform: piece.rotate ? [{ rotate: `${piece.rotate}deg` }] : undefined,
          }}
        >
          <View
            style={{
              position: 'absolute',
              top: `${insetTop}%`,
              right: `${insetRight}%`,
              bottom: `${insetBottom}%`,
              left: `${insetLeft}%`,
            }}
          >
            {children}
          </View>
        </View>
      </View>
    </Animated.View>
  );
});
AnimatedPiece.displayName = 'AnimatedPiece';

const renderAsset = (Asset: React.FC<SvgProps> | undefined) =>
  Asset ? <Asset width="100%" height="100%" /> : null;

interface SplashSceneProps {
  // 0 = 시작(빈 화면), 1 = 끝(로고·캐릭터만 남은 상태)
  progress: SharedValue<number>;
  // false면 끝 상태에서 안 보이는 식재료·파티클을 그리지 않음 (정적인 시작 화면용)
  withIntro?: boolean;
}

/** Figma splash 프레임 (1236:1550) — z순서도 Figma 레이어 순서와 같음 */
export const SplashScene: React.FC<SplashSceneProps> = ({ progress, withIntro = true }) => (
  <>
    {LOGO_PIECES.map((piece) => (
      <AnimatedPiece key={piece.id} piece={piece} progress={progress}>
        {renderAsset(piece.asset && ASSETS[piece.asset])}
      </AnimatedPiece>
    ))}
    {CHARACTER_PIECES.map((piece) => (
      <AnimatedPiece key={piece.id} piece={piece} progress={progress}>
        {renderAsset(piece.asset && ASSETS[piece.asset])}
      </AnimatedPiece>
    ))}
    {withIntro &&
      PARTICLE_PIECES.map((piece) => (
        <AnimatedPiece key={piece.id} piece={piece} progress={progress}>
          <View className="flex-1 rounded-full" style={{ backgroundColor: piece.color }} />
        </AnimatedPiece>
      ))}
    {withIntro &&
      INGREDIENT_PIECES.map((piece) => (
        <AnimatedPiece key={piece.id} piece={piece} progress={progress}>
          {renderAsset(piece.asset && INGREDIENT_ASSETS[piece.asset])}
        </AnimatedPiece>
      ))}
    <AnimatedPiece piece={TAGLINE_PIECE} progress={progress}>
      {renderAsset(ASSETS.tagline)}
    </AnimatedPiece>
  </>
);

/**
 * 402×874 Figma 프레임을 화면 안에 다 들어오도록 비율 유지 축소/확대해서 가운데 배치.
 * 애니메이션 화면과 시작 화면이 같은 배치를 써야 전환이 끊기지 않음
 */
export const SplashArtboard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 창 크기가 아니라 실제로 차지한 영역 기준 (웹은 폰 크기 컨테이너 안에 그려짐)
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  };
  const scale = size
    ? Math.min(size.width / SPLASH_ARTBOARD_WIDTH, size.height / SPLASH_ARTBOARD_HEIGHT)
    : 1;

  return (
    <View className="absolute inset-0 overflow-hidden bg-white" onLayout={handleLayout}>
      {size && (
        // 아트보드를 영역 가운데에 놓고 가운데 기준으로 축소/확대
        <View
          style={{
            position: 'absolute',
            left: (size.width - SPLASH_ARTBOARD_WIDTH) / 2,
            top: (size.height - SPLASH_ARTBOARD_HEIGHT) / 2,
            width: SPLASH_ARTBOARD_WIDTH,
            height: SPLASH_ARTBOARD_HEIGHT,
            transform: [{ scale }],
          }}
        >
          {children}
        </View>
      )}
    </View>
  );
};
