import { useState } from 'react';
import { addRecipeIngredient } from '../api/recipeApi';
import { ADDITIONAL_INGREDIENT_FIXTURES } from './recipeFixtures';

export const useRecipeIngredientAdd = (recipeId: number) => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const submit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      await Promise.all(
        Array.from(selectedIds).map((ingredientCatalogId) =>
          addRecipeIngredient(recipeId, ingredientCatalogId)
        )
      );
      return true;
    } catch (err) {
      console.error('Failed to add recipe ingredients:', err);
      setError('재료를 추가하는데 실패했습니다.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    candidates,
    selectedIds,
    toggleSelect,
    submit,
    isSubmitting,
    error,
  };
};
