import { NodeType } from '@/lib/types/node-types';
import { cn } from './cn';

/**
 * Node theme colors based on the design document
 */
export const NodeColors: Record<NodeType, { 
  primary: string, 
  secondary: string, 
  text: string,
  tailwindBg: string,
  tailwindBorder: string,
  tailwindText: string,
  tailwindHighlight: string
}> = {
  clinical: {
    primary: '#4A90E2',
    secondary: '#F4D03F',
    text: 'white',
    tailwindBg: 'bg-clinical',
    tailwindBorder: 'border-clinical-accent',
    tailwindText: 'text-white',
    tailwindHighlight: 'bg-clinical-accent'
  },
  qa: {
    primary: '#5A6978',
    secondary: '#E53E3E',
    text: 'white',
    tailwindBg: 'bg-qa',
    tailwindBorder: 'border-qa-accent',
    tailwindText: 'text-white',
    tailwindHighlight: 'bg-qa-accent'
  },
  educational: {
    primary: '#26A69A',
    secondary: '#F9E79F',
    text: 'white',
    tailwindBg: 'bg-educational',
    tailwindBorder: 'border-educational-accent',
    tailwindText: 'text-white',
    tailwindHighlight: 'bg-educational-accent'
  },
  storage: {
    primary: '#D8CCA3',
    secondary: '#8B4513',
    text: 'black',
    tailwindBg: 'bg-storage',
    tailwindBorder: 'border-amber-700',
    tailwindText: 'text-gray-900',
    tailwindHighlight: 'bg-amber-600'
  },
  vendor: {
    primary: '#2C3E50',
    secondary: '#9B59B6',
    text: 'white',
    tailwindBg: 'bg-vendor',
    tailwindBorder: 'border-purple-500',
    tailwindText: 'text-white',
    tailwindHighlight: 'bg-purple-500'
  },
  boss: {
    primary: '#4FC3F7',
    secondary: '#FF5722',
    text: 'white',
    tailwindBg: 'bg-boss',
    tailwindBorder: 'border-orange-500',
    tailwindText: 'text-white',
    tailwindHighlight: 'bg-orange-500'
  },
  start: {
    primary: '#4CAF50',
    secondary: '#8BC34A',
    text: 'white',
    tailwindBg: 'bg-green-500',
    tailwindBorder: 'border-green-300',
    tailwindText: 'text-white',
    tailwindHighlight: 'bg-green-300'
  }
};

/**
 * Get CSS variables for a node type (useful for inline styles)
 * @param nodeType The node type
 * @returns CSS variable object for React style prop
 */
export function getNodeThemeVars(nodeType: NodeType): React.CSSProperties {
  const colors = NodeColors[nodeType];
  
  return {
    '--node-primary': colors.primary,
    '--node-secondary': colors.secondary,
    '--node-text': colors.text,
  } as React.CSSProperties;
}

/**
 * Get Tailwind classes for a node based on type and status
 * @param nodeType The node type
 * @param status Optional node status
 * @returns String of Tailwind classes
 */
export function getNodeClasses(
  nodeType: NodeType, 
  status?: 'locked' | 'available' | 'current' | 'completed' | undefined,
  additionalClasses?: string
): string {
  const colors = NodeColors[nodeType];
  
  // Base classes that apply to all nodes
  let classes = cn(
    'rounded-lg shadow-md border-2 transition-all duration-200',
    colors.tailwindBg,
    colors.tailwindBorder,
    colors.tailwindText
  );
  
  // Add status-specific classes
  if (status) {
    switch (status) {
      case 'locked':
        classes = cn(
          classes,
          'opacity-50 grayscale cursor-not-allowed'
        );
        break;
      case 'available':
        classes = cn(
          classes,
          'hover:shadow-lg hover:scale-105 cursor-pointer'
        );
        break;
      case 'current':
        classes = cn(
          classes,
          'ring-4 ring-yellow-300 transform scale-105'
        );
        break;
      case 'completed':
        classes = cn(
          classes,
          'opacity-75'
        );
        break;
    }
  }
  
  // Add any additional classes
  if (additionalClasses) {
    classes = cn(classes, additionalClasses);
  }
  
  return classes;
}

/**
 * Get Tailwind classes for a button based on node type
 * @param nodeType The node type
 * @param variant Button variant ('primary', 'secondary', 'outline')
 * @returns String of Tailwind classes
 */
export function getButtonClasses(
  nodeType: NodeType,
  variant: 'primary' | 'secondary' | 'outline' = 'primary',
  additionalClasses?: string
): string {
  const colors = NodeColors[nodeType];
  
  // Base button classes
  let classes = cn(
    'px-4 py-2 rounded font-medium transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2'
  );
  
  // Add variant-specific classes
  switch (variant) {
    case 'primary':
      classes = cn(
        classes,
        colors.tailwindBg,
        colors.tailwindText,
        'hover:opacity-90'
      );
      break;
    case 'secondary':
      classes = cn(
        classes,
        colors.tailwindHighlight,
        colors.tailwindText,
        'hover:opacity-90'
      );
      break;
    case 'outline':
      classes = cn(
        classes,
        `border-2 ${colors.tailwindBorder}`,
        colors.tailwindText,
        `hover:${colors.tailwindBg} hover:bg-opacity-10`
      );
      break;
  }
  
  // Add any additional classes
  if (additionalClasses) {
    classes = cn(classes, additionalClasses);
  }
  
  return classes;
}

/**
 * Get difficulty color classes
 * @param difficulty The difficulty level
 * @returns Tailwind color classes
 */
export function getDifficultyClasses(difficulty: 'easy' | 'normal' | 'hard'): string {
  switch (difficulty) {
    case 'easy':
      return 'text-green-400';
    case 'normal':
      return 'text-yellow-400';
    case 'hard':
      return 'text-red-400';
    default:
      return 'text-slate-400';
  }
}

/**
 * Get grade color classes
 * @param grade The challenge grade
 * @returns Tailwind color classes
 */
export function getGradeClasses(grade: 'S' | 'A' | 'B' | 'C' | 'F' | null): string {
  if (!grade) return 'text-slate-400';
  
  switch (grade) {
    case 'S':
      return 'text-purple-400';
    case 'A':
      return 'text-green-400';
    case 'B':
      return 'text-blue-400';
    case 'C':
      return 'text-yellow-400';
    case 'F':
      return 'text-red-400';
    default:
      return 'text-slate-400';
  }
}

/**
 * Get rarity color classes for items
 * @param rarity The item rarity
 * @returns Tailwind color classes
 */
export function getRarityClasses(rarity: 'common' | 'uncommon' | 'rare' | 'legendary' | 'unique'): string {
  switch (rarity) {
    case 'common':
      return 'text-slate-400 border-slate-400';
    case 'uncommon':
      return 'text-green-400 border-green-400';
    case 'rare':
      return 'text-blue-400 border-blue-400';
    case 'legendary':
      return 'text-purple-400 border-purple-400';
    case 'unique':
      return 'text-orange-400 border-orange-400';
    default:
      return 'text-slate-400 border-slate-400';
  }
}

/**
 * Get icon for a node type
 * @param nodeType The node type
 * @returns Icon path or component name
 */
export function getNodeTypeIcon(nodeType: NodeType): string {
  // This would return icon paths or component names
  switch (nodeType) {
    case 'clinical':
      return 'MedicalIcon';
    case 'qa':
      return 'SettingsIcon';
    case 'educational':
      return 'SchoolIcon';
    case 'storage':
      return 'ArchiveIcon';
    case 'vendor':
      return 'ShoppingCartIcon';
    case 'boss':
      return 'FlashOnIcon';
    case 'start':
      return 'PlayArrowIcon';
    default:
      return 'CircleIcon';
  }
}