import { RecipeDetail, RecipeListItem } from '../types';

/**
 * 레시피 API 연동 전까지 사용하는 임시 데이터입니다.
 * 백엔드 `/api/me/recipes` 연동이 완료되면 제거하세요.
 */
export const RECIPE_FIXTURES: RecipeDetail[] = [
  {
    id: 1,
    title: '당근 크림 파스타',
    cookTimeMinutes: 20,
    tags: ['#당근', '#감자', '#무지방 우유'],
    category: '양식',
    ingredients: [
      { id: 1, name: '당근' },
      { id: 2, name: '감자' },
      { id: 3, name: '무지방 우유' },
      { id: 4, name: '파스타면' },
      { id: 5, name: '당근' },
    ],
    steps: [
      { step: 1, description: '끓인 물에다가 면을 넣어 삶아주세요!' },
      { step: 2, description: '면을 건져내고 다른 재료들과 볶아주세요' },
      { step: 3, description: '접시에 플레이팅하세요! 완성입니다.' },
    ],
  },
  {
    id: 2,
    title: '당근 크림 파스타',
    cookTimeMinutes: 20,
    tags: ['#당근', '#감자', '#무지방 우유'],
    category: '양식',
    ingredients: [
      { id: 1, name: '당근' },
      { id: 2, name: '감자' },
      { id: 3, name: '무지방 우유' },
    ],
    steps: [
      { step: 1, description: '끓인 물에다가 면을 넣어 삶아주세요!' },
      { step: 2, description: '면을 건져내고 다른 재료들과 볶아주세요' },
      { step: 3, description: '접시에 플레이팅하세요! 완성입니다.' },
    ],
  },
  {
    id: 3,
    title: '당근 크림 파스타',
    cookTimeMinutes: 20,
    tags: ['#당근', '#감자', '#무지방 우유'],
    category: '한식',
    ingredients: [
      { id: 1, name: '당근' },
      { id: 2, name: '감자' },
      { id: 3, name: '무지방 우유' },
    ],
    steps: [
      { step: 1, description: '끓인 물에다가 면을 넣어 삶아주세요!' },
      { step: 2, description: '면을 건져내고 다른 재료들과 볶아주세요' },
      { step: 3, description: '접시에 플레이팅하세요! 완성입니다.' },
    ],
  },
];

export const RECIPE_LIST_FIXTURES: RecipeListItem[] = RECIPE_FIXTURES.map(
  ({ id, title, cookTimeMinutes, tags, category, image }) => ({
    id,
    title,
    cookTimeMinutes,
    tags,
    category,
    image,
  })
);

/** 요리에 추가로 넣을 수 있는 후보 재료 목록 (임시) */
export const ADDITIONAL_INGREDIENT_FIXTURES = [
  { id: 101, name: '당근' },
  { id: 102, name: '양파' },
  { id: 103, name: '치킨너겟' },
  { id: 104, name: '팽이버섯' },
  { id: 105, name: '중국당면' },
  { id: 106, name: '우유' },
  { id: 107, name: '쪽파' },
];
