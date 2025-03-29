# Rogue Resident: Medical Physics Residency

An educational roguelike game that teaches medical physics through engaging, scenario-based gameplay.

## About The Project

Rogue Resident is a web-based roguelike game where players navigate procedurally generated "floors" with different challenge nodes, collect items, build synergies, and face boss encounters, all while learning and applying medical physics concepts.

### Core Pillars:
1. **Educational Value** - Teach real medical physics in an engaging way
2. **Scenario-Based Depth** - Multi-stage challenges that test different skills
3. **Meaningful Progression** - Item synergies and build diversity
4. **Engaging Aesthetics** - Distinctive visual identity for node types

## Built With

- [Next.js 14](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [React Flow](https://reactflow.dev/) - Interactive node-based diagrams

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
   ```sh
   git clone https://github.com/your-username/rogue-resident.git
   ```

2. Install NPM packages
   ```sh
   npm install
   ```

3. Run the development server
   ```sh
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Game Structure

### Node Types

- **Clinical Scenario**: Patient cases with treatment planning challenges
- **QA Scenario**: Equipment calibration and quality assurance tasks
- **Educational Scenario**: Teaching and knowledge assessment
- **Storage Closet**: Discover and collect items
- **Vendor Showcase**: Purchase items with insight currency
- **Boss Node**: Multi-phase encounters testing comprehensive skills

### Challenge System

Challenges are multi-stage and may include:
- **Introduction**: Context setting for the challenge
- **Stage 1-3**: Specific tasks related to the node type
- **Outcome**: Results and rewards based on performance

### Item System

Items provide bonuses and special abilities across different challenge types.
- **Knowledge Tools**: Books, references, guides
- **Technical Equipment**: Measurement devices, analysis tools
- **Teaching Aids**: Visual aids, presentation tools
- **Personal Development**: Skill enhancement items
- **Specialized Items**: Unique effects that change gameplay

## Project Architecture

The project follows a modern Next.js App Router structure:

```
rogue-resident/
├── app/                # App Router pages and layouts
├── components/         # React components
│   ├── ui/             # Reusable UI components
│   └── game/           # Game-specific components
├── lib/                # Shared code and utilities
│   ├── redux/          # Redux store and slices
│   ├── hooks/          # Custom hooks
│   ├── utils/          # Utility functions
│   └── types/          # TypeScript types
├── public/             # Static assets
└── styles/             # Global styles
```

## Development Notes

### Running Tests

```sh
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Linting

```sh
# Lint the project
npm run lint
```

### Building for Production

```sh
# Build the project
npm run build

# Start the production server
npm run start
```

## Game Components

### UI Components

- **Button**: Customizable button with different variants for node types
- **Card**: Content containers with themed variants
- **Modal**: Dialog windows for game interactions
- **Progress**: Visual indicators for challenge progress
- **Badge**: Status and category indicators
- **Tooltip**: Information tooltips for UI elements
- **Notification**: System notifications and alerts

### Game Systems

- **Map System**: Procedurally generated node maps with connections
- **Node System**: Different node types with unique interactions
- **Challenge System**: Multi-stage scenario-based challenges
- **Inventory System**: Item acquisition and management
- **Save/Load System**: Game state persistence

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Medical physics professionals who provided domain expertise