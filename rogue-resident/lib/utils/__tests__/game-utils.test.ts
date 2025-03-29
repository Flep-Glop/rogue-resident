import {
    calculateGrade,
    calculateInsightReward,
    getRandomItemRarity,
    formatTime,
    calculateTotalItemEffect,
    hasItemEffect,
    getDifficultyColor,
    getDifficultyStars
  } from '../game-utils'
  import { ChallengeGrade } from '@/lib/types/challenge-types'
  import { ItemEffect } from '@/lib/types/item-types'
  
  describe('Game Utility Functions', () => {
    // Test calculateGrade function
    describe('calculateGrade', () => {
      it('returns S grade for scores >= 95%', () => {
        expect(calculateGrade(95, 100)).toBe('S')
        expect(calculateGrade(100, 100)).toBe('S')
        expect(calculateGrade(950, 1000)).toBe('S')
      })
      
      it('returns A grade for scores between 85% and 94.9%', () => {
        expect(calculateGrade(85, 100)).toBe('A')
        expect(calculateGrade(90, 100)).toBe('A')
        expect(calculateGrade(94, 100)).toBe('A')
      })
      
      it('returns B grade for scores between 70% and 84.9%', () => {
        expect(calculateGrade(70, 100)).toBe('B')
        expect(calculateGrade(80, 100)).toBe('B')
        expect(calculateGrade(84, 100)).toBe('B')
      })
      
      it('returns C grade for scores between 50% and 69.9%', () => {
        expect(calculateGrade(50, 100)).toBe('C')
        expect(calculateGrade(60, 100)).toBe('C')
        expect(calculateGrade(69, 100)).toBe('C')
      })
      
      it('returns F grade for scores < 50%', () => {
        expect(calculateGrade(0, 100)).toBe('F')
        expect(calculateGrade(25, 100)).toBe('F')
        expect(calculateGrade(49, 100)).toBe('F')
      })
    })
    
    // Test calculateInsightReward function
    describe('calculateInsightReward', () => {
      it('returns correct reward for each grade with default base reward', () => {
        expect(calculateInsightReward('S')).toBe(100) // 50 * 2.0
        expect(calculateInsightReward('A')).toBe(75)  // 50 * 1.5
        expect(calculateInsightReward('B')).toBe(50)  // 50 * 1.0
        expect(calculateInsightReward('C')).toBe(25)  // 50 * 0.5
        expect(calculateInsightReward('F')).toBe(5)   // 50 * 0.1
      })
      
      it('returns correct reward with custom base reward', () => {
        expect(calculateInsightReward('S', 100)).toBe(200) // 100 * 2.0
        expect(calculateInsightReward('A', 100)).toBe(150) // 100 * 1.5
        expect(calculateInsightReward('B', 100)).toBe(100) // 100 * 1.0
        expect(calculateInsightReward('C', 100)).toBe(50)  // 100 * 0.5
        expect(calculateInsightReward('F', 100)).toBe(10)  // 100 * 0.1
      })
    })
    
    // Test formatTime function
    describe('formatTime', () => {
      it('formats seconds correctly', () => {
        expect(formatTime(30)).toBe('00:30')
        expect(formatTime(59)).toBe('00:59')
        expect(formatTime(60)).toBe('01:00')
        expect(formatTime(90)).toBe('01:30')
        expect(formatTime(3661)).toBe('61:01') // 1 hour, 1 minute, 1 second
      })
      
      it('handles zero and negative values', () => {
        expect(formatTime(0)).toBe('00:00')
        expect(formatTime(-60)).toBe('-01:00') // Negative time should still format correctly
      })
    })
    
    // Test calculateTotalItemEffect function
    describe('calculateTotalItemEffect', () => {
      const items = [
        {
          effects: [
            { target: 'clinical', modifier: 'performance', value: 10, description: '+10% clinical performance' },
            { target: 'qa', modifier: 'precision', value: 2, description: '+2 QA precision' }
          ] as ItemEffect[]
        },
        {
          effects: [
            { target: 'clinical', modifier: 'performance', value: 15, description: '+15% clinical performance' },
            { target: 'all', modifier: 'performance', value: 5, description: '+5% all performance' }
          ] as ItemEffect[]
        }
      ]
      
      it('sums up matching effect values correctly', () => {
        expect(calculateTotalItemEffect(items, 'clinical', 'performance')).toBe(25) // 10 + 15
        expect(calculateTotalItemEffect(items, 'qa', 'precision')).toBe(2) // 2
        expect(calculateTotalItemEffect(items, 'all', 'performance')).toBe(5) // 5
      })
      
      it('returns 0 for non-existent effect types', () => {
        expect(calculateTotalItemEffect(items, 'educational', 'effectiveness')).toBe(0)
        expect(calculateTotalItemEffect(items, 'qa', 'performance')).toBe(0)
      })
      
      it('handles empty items array', () => {
        expect(calculateTotalItemEffect([], 'clinical', 'performance')).toBe(0)
      })
    })
    
    // Test hasItemEffect function
    describe('hasItemEffect', () => {
      const items = [
        {
          effects: [
            { target: 'clinical', modifier: 'performance', value: 10, description: '+10% clinical performance' },
            { target: 'qa', modifier: 'reroll', value: true, description: 'Allow reroll in QA challenges' }
          ] as ItemEffect[]
        }
      ]
      
      it('correctly identifies existing effects', () => {
        expect(hasItemEffect(items, 'clinical', 'performance')).toBe(true)
        expect(hasItemEffect(items, 'qa', 'reroll')).toBe(true)
      })
      
      it('correctly identifies non-existent effects', () => {
        expect(hasItemEffect(items, 'educational', 'effectiveness')).toBe(false)
        expect(hasItemEffect(items, 'clinical', 'reroll')).toBe(false)
      })
      
      it('handles empty items array', () => {
        expect(hasItemEffect([], 'clinical', 'performance')).toBe(false)
      })
    })
    
    // Test getDifficultyColor function
    describe('getDifficultyColor', () => {
      it('returns correct color classes for different difficulties', () => {
        expect(getDifficultyColor('easy')).toBe('text-green-400')
        expect(getDifficultyColor('normal')).toBe('text-yellow-400')
        expect(getDifficultyColor('hard')).toBe('text-red-400')
        expect(getDifficultyColor('unknown')).toBe('text-slate-400')
      })
    })
    
    // Test getDifficultyStars function
    describe('getDifficultyStars', () => {
      it('returns correct star representation for different difficulties', () => {
        expect(getDifficultyStars('easy')).toBe('★')
        expect(getDifficultyStars('normal')).toBe('★★')
        expect(getDifficultyStars('hard')).toBe('★★★')
        expect(getDifficultyStars('unknown')).toBe('')
      })
    })
  })