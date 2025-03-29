import {
    Item,
    KnowledgeItem,
    TechnicalItem,
    TeachingItem,
    PersonalItem,
    SpecialItem,
    ItemRarity
  } from '@/lib/types/item-types';
  
  // Helper function to generate unique IDs
  const generateId = (prefix: string, index: number): string => {
    return `${prefix}_${String(index).padStart(3, '0')}`;
  };
  
  // Knowledge Tools
  export const knowledgeItems: KnowledgeItem[] = [
    {
      id: generateId('knowledge', 1),
      name: 'Vintage Dosimetry Handbook',
      description: 'A well-worn handbook from the early days of medical physics that contains fundamental principles of dosimetry.',
      type: 'knowledge',
      subtype: 'handbook',
      knowledgeDomain: 'dosimetry',
      rarity: 'uncommon',
      effects: [
        {
          type: 'clinicalBonus',
          target: 'dose-calculation',
          value: 25,
          description: '+25% performance in dose calculation challenges'
        }
      ],
      isUsable: false,
      isPassive: true,
      cost: 75,
      flavorText: 'The margins are filled with handwritten notes from generations of physicists.',
      icon: '/icons/items/vintage_handbook.png'
    },
    {
      id: generateId('knowledge', 2),
      name: 'Modern Radiation Oncology Textbook',
      description: 'The latest edition of a comprehensive textbook covering all aspects of radiation oncology physics.',
      type: 'knowledge',
      subtype: 'textbook',
      knowledgeDomain: 'radiation oncology',
      rarity: 'common',
      effects: [
        {
          type: 'clinicalBonus',
          target: 'all',
          value: 15,
          description: '+15% performance in all clinical challenges'
        }
      ],
      isUsable: false,
      isPassive: true,
      cost: 50,
      flavorText: 'Frequently updated to keep pace with rapid technological advancements.',
      icon: '/icons/items/modern_textbook.png'
    },
    {
      id: generateId('knowledge', 3),
      name: 'Journal of Medical Physics Archives',
      description: 'A digital collection of peer-reviewed research papers in medical physics spanning several decades.',
      type: 'knowledge',
      subtype: 'journal',
      knowledgeDomain: 'research',
      rarity: 'rare',
      effects: [
        {
          type: 'educationalBonus',
          target: 'all',
          value: 20,
          description: '+20% performance in educational challenges'
        },
        {
          type: 'revealAnswer',
          target: 'clinical',
          value: true,
          duration: 3,
          description: 'Reveal one correct answer in clinical challenges (3 uses)'
        }
      ],
      isUsable: true,
      isPassive: true,
      cost: 120,
      flavorText: 'Knowledge accumulated through years of scientific inquiry.',
      icon: '/icons/items/journal_archives.png'
    },
    {
      id: generateId('knowledge', 4),
      name: 'Radiation Protection Guidelines',
      description: 'Official regulatory guidelines for radiation safety and protection standards.',
      type: 'knowledge',
      subtype: 'reference',
      knowledgeDomain: 'radiation protection',
      rarity: 'common',
      effects: [
        {
          type: 'qaBonus',
          target: 'radiation-safety',
          value: 30,
          description: '+30% performance in radiation safety QA challenges'
        }
      ],
      isUsable: false,
      isPassive: true,
      cost: 40,
      flavorText: 'Safety first, always.',
      icon: '/icons/items/protection_guidelines.png'
    },
    {
      id: generateId('knowledge', 5),
      name: 'Brachytherapy Sourcebook',
      description: 'Specialized reference guide for brachytherapy sources, techniques, and calculations.',
      type: 'knowledge',
      subtype: 'handbook',
      knowledgeDomain: 'brachytherapy',
      rarity: 'uncommon',
      effects: [
        {
          type: 'clinicalBonus',
          target: 'brachytherapy',
          value: 40,
          description: '+40% performance in brachytherapy challenges'
        }
      ],
      isUsable: false,
      isPassive: true,
      cost: 85,
      flavorText: 'Contains detailed tables of radionuclide properties and dose distributions.',
      icon: '/icons/items/brachytherapy_book.png'
    }
  ];
  
  // Technical Equipment
  export const technicalItems: TechnicalItem[] = [
    {
      id: generateId('technical', 1),
      name: 'Calibration Phantom Set',
      description: 'A complete set of calibration phantoms for various measurement scenarios.',
      type: 'technical',
      subtype: 'calibration',
      technicalDomain: 'quality assurance',
      rarity: 'uncommon',
      effects: [
        {
          type: 'qaBonus',
          target: 'calibration',
          value: 30,
          description: '+30% performance in calibration challenges'
        },
        {
          type: 'rerollChallenge',
          target: 'qa',
          value: true,
          duration: 2,
          description: 'Allows rerolling QA measurement results (2 uses)'
        }
      ],
      isUsable: true,
      isPassive: true,
      cost: 95,
      flavorText: 'Precisely machined to NIST standards.',
      icon: '/icons/items/calibration_phantoms.png'
    },
    {
      id: generateId('technical', 2),
      name: 'Advanced Analysis Software',
      description: 'Cutting-edge software for analyzing complex treatment plans and dose distributions.',
      type: 'technical',
      subtype: 'software',
      technicalDomain: 'treatment planning',
      rarity: 'rare',
      effects: [
        {
          type: 'clinicalBonus',
          target: 'plan-evaluation',
          value: 35,
          description: '+35% performance in plan evaluation challenges'
        },
        {
          type: 'qaBonus',
          target: 'data-analysis',
          value: 25,
          description: '+25% performance in data analysis challenges'
        }
      ],
      isUsable: false,
      isPassive: true,
      cost: 150,
      flavorText: 'Features algorithms developed by leading researchers in the field.',
      icon: '/icons/items/analysis_software.png'
    },
    {
      id: generateId('technical', 3),
      name: 'Precision Dosimeter',
      description: 'High-precision dosimeter with exceptional accuracy and reproducibility.',
      type: 'technical',
      subtype: 'measurement',
      technicalDomain: 'dosimetry',
      rarity: 'uncommon',
      effects: [
        {
          type: 'qaBonus',
          target: 'measurement',
          value: 35,
          description: '+35% performance in measurement challenges'
        }
      ],
      isUsable: false,
      isPassive: true,
      cost: 80,
      flavorText: 'Trusted by medical physicists worldwide for its reliability.',
      icon: '/icons/items/precision_dosimeter.png'
    },
    {
      id: generateId('technical', 4),
      name: 'MLC QA Toolkit',
      description: 'Specialized tools for quality assurance of multi-leaf collimators.',
      type: 'technical',
      subtype: 'calibration',
      technicalDomain: 'linac qa',
      rarity: 'uncommon',
      effects: [
        {
          type: 'qaBonus',
          target: 'mlc-qa',
          value: 45,
          description: '+45% performance in MLC QA challenges'
        }
      ],
      isUsable: false,
      isPassive: true,
      cost: 90,
      flavorText: 'Ensures submillimeter accuracy in leaf positioning.',
      icon: '/icons/items/mlc_toolkit.png'
    },
    {
      id: generateId('technical', 5),
      name: 'Radiation Survey Meter',
      description: 'Portable device for measuring radiation levels in different environments.',
      type: 'technical',
      subtype: 'measurement',
      technicalDomain: 'radiation protection',
      rarity: 'common',
      effects: [
        {
          type: 'qaBonus',
          target: 'radiation-survey',
          value: 30,
          description: '+30% performance in radiation survey challenges'
        },
        {
          type: 'dodgeFailure',
          target: 'radiation-protection',
          value: true,
          duration: 1,
          description: 'Prevent one failure in radiation protection challenges'
        }
      ],
      isUsable: true,
      isPassive: true,
      cost: 65,
      flavorText: 'Always keep one handy for unexpected situations.',
      icon: '/icons/items/survey_meter.png'
    }
  ];
  
  // Teaching Aids
  export const teachingItems: TeachingItem[] = [
    {
      id: generateId('teaching', 1),
      name: 'Interactive Dose Visualization Tool',
      description: 'Software that creates intuitive visual representations of complex dose distributions.',
      type: 'teaching',
      subtype: 'visual',
      teachingApproach: 'interactive',
      rarity: 'rare',
      effects: [
        {
          type: 'educationalBonus',
          target: 'concept-explanation',
          value: 40,
          description: '+40% performance in concept explanation challenges'
        },
        {
          type: 'educationalBonus',
          target: 'visual-aid-creation',
          value: 50,
          description: '+50% performance in visual aid creation challenges'
        }
      ],
      isUsable: false,
      isPassive: true,
      cost: 130,
      flavorText: 'Students consistently rate this as their favorite learning tool.',
      icon: '/icons/items/dose_visualization.png'
    },
    {
      id: generateId('teaching', 2),
      name: 'Case Study Collection',
      description: 'A diverse collection of real-world medical physics cases with detailed analyses.',
      type: 'teaching',
      subtype: 'assessment',
      teachingApproach: 'case-based',
      rarity: 'uncommon',
      effects: [
        {
          type: 'educationalBonus',
          target: 'all',
          value: 25,
          description: '+25% performance in all educational challenges'
        },
        {
          type: 'clinicalBonus',
          target: 'all',
          value: 15,
          description: '+15% performance in all clinical challenges'
        }
      ],
      isUsable: false,
      isPassive: true,
      cost: 100,
      flavorText: 'Learning from experience—both successes and failures.',
      icon: '/icons/items/case_studies.png'
    },
    {
      id: generateId('teaching', 3),
      name: 'Presentation Template Library',
      description: 'Professional slide templates designed specifically for medical physics education.',
      type: 'teaching',
      subtype: 'presentation',
      teachingApproach: 'visual',
      rarity: 'common',
      effects: [
        {
          type: 'educationalBonus',
          target: 'visual-aid-creation',
          value: 35,
          description: '+35% performance in visual aid creation challenges'
        }
      ],
      isUsable: false,
      isPassive: true,
      cost: 45,
      flavorText: 'Polished visuals make complex concepts more accessible.',
      icon: '/icons/items/presentation_templates.png'
    },
    {
      id: generateId('teaching', 4),
      name: 'Physics Demonstration Kit',
      description: 'Hands-on tools for demonstrating radiation physics principles.',
      type: 'teaching',
      subtype: 'interactive',
      teachingApproach: 'hands-on',
      rarity: 'uncommon',
      effects: [
        {
          type: 'educationalBonus',
          target: 'concept-explanation',
          value: 45,
          description: '+45% performance in concept explanation challenges'
        }
      ],
      isUsable: false,
      isPassive: true,
      cost: 85,
      flavorText: 'Nothing beats a live demonstration for making abstract concepts concrete.',
      icon: '/icons/items/demonstration_kit.png'
    },
    {
      id: generateId('teaching', 5),
      name: 'Question Bank',
      description: 'Comprehensive collection of practice questions with detailed solutions.',
      type: 'teaching',
      subtype: 'assessment',
      teachingApproach: 'practice-based',
      rarity: 'common',
      effects: [
        {
          type: 'educationalBonus',
          target: 'knowledge-assessment',
          value: 40,
          description: '+40% performance in knowledge assessment challenges'
        },
        {
          type: 'educationalBonus',
          target: 'question-handling',
          value: 30,
          description: '+30% performance in question handling challenges'
        }
      ],
      isUsable: false,
      isPassive: true,
      cost: 60,
      flavorText: 'Practice makes perfect.',
      icon: '/icons/items/question_bank.png'
    }
  ];
  
  // Personal Development Items
  export const personalItems: PersonalItem[] = [
    {
      id: generateId('personal', 1),
      name: 'Time Management System',
      description: 'An effective system for organizing tasks and maximizing productivity.',
      type: 'personal',
      subtype: 'timeManagement',
      personalBenefit: 'efficiency',
      rarity: 'common',
      effects: [
        {
          type: 'clinicalBonus',
          target: 'all',
          value: 10,
          description: '+10% performance in all clinical challenges'
        },
        {
          type: 'qaBonus',
          target: 'all',
          value: 10,
          description: '+10% performance in all QA challenges'
        },
        {
          type: 'educationalBonus',
          target: 'all',
          value: 10,
          description: '+10% performance in all educational challenges'
        }
      ],
      isUsable: false,
      isPassive: true,
      cost: 50,
      flavorText: 'Work smarter, not harder.',
      icon: '/icons/items/time_management.png'
    },
    {
      id: generateId('personal', 2),
      name: 'Mindfulness Practice Guide',
      description: 'Techniques for maintaining focus and reducing stress during challenging situations.',
      type: 'personal',
      subtype: 'stressReduction',
      personalBenefit: 'focus',
      rarity: 'uncommon',
      effects: [
        {
          type: 'dodgeFailure',
          target: 'all',
          value: true,
          duration: 3,
          description: 'Prevent three failures in any challenge type'
        }
      ],
      isUsable: true,
      isPassive: false,
      cost: 80,
      flavorText: 'Clarity of mind leads to clarity of purpose.',
      icon: '/icons/items/mindfulness_guide.png'
    },
    {
      id: generateId('personal', 3),
      name: 'Professional Network Directory',
      description: 'Connections to experts in various medical physics specialties.',
      type: 'personal',
      subtype: 'networking',
      personalBenefit: 'consultation',
      rarity: 'rare',
      effects: [
        {
          type: 'revealAnswer',
          target: 'all',
          value: true,
          duration: 5,
          description: 'Reveal one correct answer in any challenge (5 uses)'
        }
      ],
      isUsable: true,
      isPassive: false,
      cost: 120,
      flavorText: 'It\'s not just what you know, but who you know.',
      icon: '/icons/items/network_directory.png'
    },
    {
      id: generateId('personal', 4),
      name: 'Focus Enhancement Tools',
      description: 'Techniques and tools for maintaining concentration during complex tasks.',
      type: 'personal',
      subtype: 'focus',
      personalBenefit: 'concentration',
      rarity: 'common',
      effects: [
        {
          type: 'qaBonus',
          target: 'precision',
          value: 25,
          description: '+25% performance in precision-focused QA challenges'
        }
      ],
      isUsable: false,
      isPassive: true,
      cost: 40,
      flavorText: 'Every small error caught saves hours of rework later.',
      icon: '/icons/items/focus_tools.png'
    },
    {
      id: generateId('personal', 5),
      name: 'Health and Wellness Program',
      description: 'A comprehensive approach to maintaining physical and mental wellbeing.',
      type: 'personal',
      subtype: 'stressReduction',
      personalBenefit: 'resilience',
      rarity: 'uncommon',
      effects: [
        {
          type: 'maxHealth',
          target: 'player',
          value: 1,
          description: 'Increase maximum health by 1'
        }
      ],
      isUsable: false,
      isPassive: true,
      cost: 100,
      flavorText: 'A healthy physicist is an effective physicist.',
      icon: '/icons/items/wellness_program.png'
    }
  ];
  
  // Special Items
  export const specialItems: SpecialItem[] = [
    {
      id: generateId('special', 1),
      name: 'Retired Physicist\'s Notebook',
      description: 'Personal notes from a legendary medical physicist with decades of experience.',
      type: 'special',
      subtype: 'historical',
      uniqueEffect: 'Provides insights into difficult challenges',
      rarity: 'rare',
      effects: [
        {
          type: 'clinicalBonus',
          target: 'all',
          value: 20,
          description: '+20% performance in all clinical challenges'
        },
        {
          type: 'qaBonus',
          target: 'all',
          value: 20,
          description: '+20% performance in all QA challenges'
        },
        {
          type: 'revealAnswer',
          target: 'all',
          value: true,
          duration: 3,
          description: 'Reveal one correct answer in any challenge (3 uses)'
        }
      ],
      isUsable: true,
      isPassive: true,
      cost: 200,
      flavorText: 'The margins are filled with clever shortcuts and hard-earned wisdom.',
      icon: '/icons/items/physicist_notebook.png'
    },
    {
      id: generateId('special', 2),
      name: 'Experimental Analysis Algorithm',
      description: 'A cutting-edge algorithm that automatically identifies patterns in complex data.',
      type: 'special',
      subtype: 'prototype',
      uniqueEffect: 'Occasional automated pattern recognition',
      rarity: 'legendary',
      effects: [
        {
          type: 'qaBonus',
          target: 'data-analysis',
          value: 50,
          description: '+50% performance in data analysis challenges'
        },
        {
          type: 'clinicalBonus',
          target: 'plan-evaluation',
          value: 40,
          description: '+40% performance in plan evaluation challenges'
        },
        {
          type: 'dodgeFailure',
          target: 'all',
          value: true,
          duration: 3,
          description: 'Prevent three failures in any challenge'
        }
      ],
      isUsable: true,
      isPassive: true,
      cost: 300,
      flavorText: 'Still in beta testing, but the results are promising.',
      icon: '/icons/items/experimental_algorithm.png'
    },
    {
      id: generateId('special', 3),
      name: 'First-Day TLD Badge',
      description: 'Your original thermoluminescent dosimeter badge from your first day as a physicist.',
      type: 'special',
      subtype: 'historical',
      uniqueEffect: 'Occasional insight bonuses during challenges',
      rarity: 'unique',
      effects: [
        {
          type: 'extraReward',
          target: 'insight',
          value: 25,
          description: 'Gain 25% more insight from all challenges'
        }
      ],
      isUsable: false,
      isPassive: true,
      cost: 0, // Cannot be purchased
      flavorText: 'A reminder of how far you\'ve come.',
      icon: '/icons/items/tld_badge.png'
    },
    {
      id: generateId('special', 4),
      name: 'Ionix Communication Module',
      description: 'A specialized interface for communicating with the sentient ion chamber Ionix.',
      type: 'special',
      subtype: 'prototype',
      uniqueEffect: 'Enhanced interactions with Ionix',
      rarity: 'unique',
      effects: [
        {
          type: 'clinicalBonus',
          target: 'boss',
          value: 50,
          description: '+50% performance in boss challenges'
        }
      ],
      isUsable: false,
      isPassive: true,
      cost: 150,
      flavorText: 'Sometimes it seems to pick up signals that aren\'t there... or are they?',
      icon: '/icons/items/ionix_module.png'
    },
    {
      id: generateId('special', 5),
      name: 'Marie Curie\'s Research Notes',
      description: 'A reproduction of the groundbreaking radiation research that started it all.',
      type: 'special',
      subtype: 'historical',
      uniqueEffect: 'Inspiration for innovative approaches',
      rarity: 'legendary',
      effects: [
        {
          type: 'clinicalBonus',
          target: 'all',
          value: 25,
          description: '+25% performance in all clinical challenges'
        },
        {
          type: 'qaBonus',
          target: 'all',
          value: 25,
          description: '+25% performance in all QA challenges'
        },
        {
          type: 'educationalBonus',
          target: 'all',
          value: 25,
          description: '+25% performance in all educational challenges'
        }
      ],
      isUsable: false,
      isPassive: true,
      cost: 250,
      flavorText: '"Be less curious about people and more curious about ideas."',
      icon: '/icons/items/curie_notes.png'
    }
  ];
  
  // Combine all items
  export const allItems: Item[] = [
    ...knowledgeItems,
    ...technicalItems,
    ...teachingItems,
    ...personalItems,
    ...specialItems
  ];
  
  /**
   * Get a random item based on rarity chances
   * @param rarityChances Object with rarity chances (should sum to 1)
   * @returns A random item
   */
  export function getRandomItem(
    rarityChances: { 
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
  ): Item {
    // Select rarity based on chances
    const roll = Math.random();
    let selectedRarity: ItemRarity;
    
    if (roll < rarityChances.legendary) {
      selectedRarity = 'legendary';
    } else if (roll < rarityChances.legendary + rarityChances.rare) {
      selectedRarity = 'rare';
    } else if (roll < rarityChances.legendary + rarityChances.rare + rarityChances.uncommon) {
      selectedRarity = 'uncommon';
    } else {
      selectedRarity = 'common';
    }
    
    // Filter items by selected rarity
    const itemsOfRarity = allItems.filter(item => item.rarity === selectedRarity);
    
    // If no items of this rarity, fall back to common
    if (itemsOfRarity.length === 0) {
      return getRandomItem({ common: 1, uncommon: 0, rare: 0, legendary: 0 });
    }
    
    // Return a random item of the selected rarity
    return itemsOfRarity[Math.floor(Math.random() * itemsOfRarity.length)];
  }
  
  /**
   * Get items by type
   * @param type The item type to filter by
   * @returns Array of items of the specified type
   */
  export function getItemsByType(type: 'knowledge' | 'technical' | 'teaching' | 'personal' | 'special'): Item[] {
    return allItems.filter(item => item.type === type);
  }
  
  /**
   * Get an item by ID
   * @param id The item ID to find
   * @returns The item with the specified ID, or undefined if not found
   */
  export function getItemById(id: string): Item | undefined {
    return allItems.find(item => item.id === id);
  }
  
  /**
   * Get items by rarity
   * @param rarity The rarity to filter by
   * @returns Array of items of the specified rarity
   */
  export function getItemsByRarity(rarity: ItemRarity): Item[] {
    return allItems.filter(item => item.rarity === rarity);
  }