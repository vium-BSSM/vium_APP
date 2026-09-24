import { useState } from 'react';
import { ADDITIONAL_INGREDIENT_FIXTURES } from './recipeFixtures';

export const useRecipeIngredientAdd = () => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const candidates = ADDITIONAL_INGREDIENT_FIXTURES;

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return {
    candidates,
    selectedIds,
    toggleSelect,
  };
};
