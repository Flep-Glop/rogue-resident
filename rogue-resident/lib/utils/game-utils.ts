import { ChallengeGrade } from '@/lib/types/challenge-types'
import { ItemEffect, ItemRarity } from '@/lib/types/item-types'

/**
 * Calculates grade based on a numeric score
 */
export function calculateGrade(score: number, maxScore: number): ChallengeGrade {
  const percentage = (score / maxScore) * 100
  
  if (percentage >= 95) return 'S'
  if (percentage >= 85) return 'A'
  if (percentage >= 70) return 'B'
  if (percentage >= 50) return 'C'
  return 'F'
}

/**
 * Calculates insight reward based on grade
 */
export function calculateInsightReward(grade: ChallengeGrade, baseReward: number = 50): number {
  const multipliers: Record<ChallengeGrade, number> = {
    'S': 2.0,
    'A': 1.5,
    'B': 1.0,
    'C': 0.5,
    'F': 0.1
  }
  
  return Math.round(baseReward * multipliers[grade])
}

/**
 * Gets item rarity based on a random roll with configurable chances
 */
export function getRandomItemRarity(
  chances: { 
    common: number, 
    uncommon: number, 
    rare: number, 
    legendary: number 
  } = { 
    common: 0.6, 
    uncommon: 0.3, 
    rare: 0.08, 
    legendary: 0.02 
  }
): ItemRarity {
  const roll = Math.random()
  
  if (roll < chances.legendary) return 'legendary'
  if (roll < chances.legendary + chances.rare) return 'rare'
  if (roll < chances.legendary + chances.rare + chances.uncommon) return 'uncommon'
  return 'common'
}

/**
 * Formats time in seconds to a readable format (MM:SS)
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * Calculates the total effect value for a specific modifier from multiple items
 */
export function calculateTotalItemEffect(
  items: { effects: ItemEffect[] }[],
  targetType: string,
  modifierType: string
): number {
  return items.reduce((total, item) => {
    // Find effects that match the target and modifier type
    const matchingEffects = item.effects.filter(
      effect => effect.target === targetType && effect.modifier === modifierType
    )
    
    // Sum up the effect values
    const effectSum = matchingEffects.reduce((sum, effect) => {
      if (typeof effect.value === 'number') {
        return sum + effect.value
      }
      return sum
    }, 0)
    
    return total + effectSum
  }, 0)
}

/**
 * Checks if the player has a specific effect from items
 */
export function hasItemEffect(
  items: { effects: ItemEffect[] }[],
  targetType: string,
  modifierType: string
): boolean {
  return items.some(item => 
    item.effects.some(effect => 
      effect.target === targetType && 
      effect.modifier === modifierType &&
      Boolean(effect.value)
    )
  )
}

/**
 * Get difficulty color class based on difficulty string
 */
export function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'text-green-400'
    case 'normal':
      return 'text-yellow-400'
    case 'hard':
      return 'text-red-400'
    default:
      return 'text-slate-400'
  }
}

/**
 * Get stars for difficulty
 */
export function getDifficultyStars(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return '★'
    case 'normal':
      return '★★'
    case 'hard':
      return '★★★'
    default:
      return ''
  }
}