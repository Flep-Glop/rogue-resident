import challengeReducer, {
    startChallenge,
    advanceStage,
    recordResponse,
    setOverallGrade,
    completeChallenge,
    failChallenge,
    resetChallenge,
    decrementTimer
  } from '../challenge-slice';
  import { ChallengeType, ChallengeStage, ChallengeGrade } from '@/lib/types/challenge-types';
  import { Difficulty } from '@/lib/types/game-types';
  
  describe('Challenge Slice', () => {
    // Initial state tests
    describe('initial state', () => {
      it('should return the initial state', () => {
        const initialState = {
          currentChallengeId: null,
          challengeType: null,
          difficulty: 'normal',
          title: '',
          description: '',
          currentStage: null,
          stages: [],
          isCompleted: false,
          overallGrade: null,
          insightReward: 0,
          itemReward: null,
          timeRemaining: null,
          challengeState: 'inactive'
        };
        
        // @ts-ignore - Passing undefined action is valid for initial state
        expect(challengeReducer(undefined, { type: 'unknown' })).toEqual(initialState);
      });
    });
  
    // Action tests
    describe('challenge actions', () => {
      it('should handle startChallenge', () => {
        const params = {
          id: 'challenge-001',
          type: 'clinical' as ChallengeType,
          totalStages: 3,
          title: 'Test Challenge',
          description: 'A test challenge',
          difficulty: 'normal' as Difficulty,
          timeLimit: 300
        };
        
        const state = challengeReducer(undefined, startChallenge(params));
        
        expect(state.currentChallengeId).toBe(params.id);
        expect(state.challengeType).toBe(params.type);
        expect(state.title).toBe(params.title);
        expect(state.description).toBe(params.description);
        expect(state.difficulty).toBe(params.difficulty);
        expect(state.currentStage).toBe('introduction');
        expect(state.isCompleted).toBe(false);
        expect(state.timeRemaining).toBe(params.timeLimit);
        expect(state.challengeState).toBe('active');
      });
  
      it('should handle advanceStage', () => {
        const initialState = {
          currentChallengeId: 'challenge-001',
          challengeType: 'clinical' as ChallengeType,
          difficulty: 'normal' as Difficulty,
          title: 'Test Challenge',
          description: 'A test challenge',
          currentStage: 'introduction' as ChallengeStage,
          stages: [],
          isCompleted: false,
          overallGrade: null,
          insightReward: 0,
          itemReward: null,
          timeRemaining: 300,
          challengeState: 'active'
        };
        
        const newStage: ChallengeStage = 'stage1';
        const state = challengeReducer(initialState, advanceStage(newStage));
        
        expect(state.currentStage).toBe(newStage);
      });
  
      it('should handle recordResponse', () => {
        const initialState = {
          currentChallengeId: 'challenge-001',
          challengeType: 'clinical' as ChallengeType,
          difficulty: 'normal' as Difficulty,
          title: 'Test Challenge',
          description: 'A test challenge',
          currentStage: 'stage1' as ChallengeStage,
          stages: [
            {
              id: 'stage1',
              type: 'imaging',
              content: {},
              isCompleted: false
            }
          ],
          isCompleted: false,
          overallGrade: null,
          insightReward: 0,
          itemReward: null,
          timeRemaining: 300,
          challengeState: 'active'
        };
        
        const response = { answer: 'test answer' };
        const state = challengeReducer(
          initialState, 
          recordResponse({ stage: 'stage1' as ChallengeStage, response })
        );
        
        expect(state.stages[0].userAnswer).toEqual(response);
        expect(state.stages[0].isCompleted).toBe(true);
      });
  
      it('should handle setOverallGrade', () => {
        const initialState = {
          currentChallengeId: 'challenge-001',
          challengeType: 'clinical' as ChallengeType,
          difficulty: 'normal' as Difficulty,
          title: 'Test Challenge',
          description: 'A test challenge',
          currentStage: 'outcome' as ChallengeStage,
          stages: [],
          isCompleted: false,
          overallGrade: null,
          insightReward: 0,
          itemReward: null,
          timeRemaining: 300,
          challengeState: 'active'
        };
        
        const grade: ChallengeGrade = 'A';
        const state = challengeReducer(initialState, setOverallGrade(grade));
        
        expect(state.overallGrade).toBe(grade);
        expect(state.insightReward).toBe(75); // Reward for A grade
      });
  
      it('should handle completeChallenge', () => {
        const initialState = {
          currentChallengeId: 'challenge-001',
          challengeType: 'clinical' as ChallengeType,
          difficulty: 'normal' as Difficulty,
          title: 'Test Challenge',
          description: 'A test challenge',
          currentStage: 'outcome' as ChallengeStage,
          stages: [],
          isCompleted: false,
          overallGrade: null,
          insightReward: 0,
          itemReward: null,
          timeRemaining: 300,
          challengeState: 'active'
        };
        
        const completionParams = {
          grade: 'S' as ChallengeGrade,
          rewards: [
            { type: 'insight', value: 100 },
            { type: 'item', itemId: 'item-001' }
          ]
        };
        
        const state = challengeReducer(initialState, completeChallenge(completionParams));
        
        expect(state.isCompleted).toBe(true);
        expect(state.overallGrade).toBe(completionParams.grade);
        expect(state.challengeState).toBe('completed');
        expect(state.insightReward).toBe(100);
        expect(state.itemReward).toBe('item-001');
      });
  
      it('should handle failChallenge', () => {
        const initialState = {
          currentChallengeId: 'challenge-001',
          challengeType: 'clinical' as ChallengeType,
          difficulty: 'normal' as Difficulty,
          title: 'Test Challenge',
          description: 'A test challenge',
          currentStage: 'stage2' as ChallengeStage,
          stages: [],
          isCompleted: false,
          overallGrade: null,
          insightReward: 0,
          itemReward: null,
          timeRemaining: 300,
          challengeState: 'active'
        };
        
        const state = challengeReducer(initialState, failChallenge());
        
        expect(state.isCompleted).toBe(true);
        expect(state.overallGrade).toBe('F');
        expect(state.challengeState).toBe('failed');
        expect(state.insightReward).toBe(0);
        expect(state.itemReward).toBe(null);
      });
  
      it('should handle resetChallenge', () => {
        const initialState = {
          currentChallengeId: 'challenge-001',
          challengeType: 'clinical' as ChallengeType,
          difficulty: 'normal' as Difficulty,
          title: 'Test Challenge',
          description: 'A test challenge',
          currentStage: 'outcome' as ChallengeStage,
          stages: [],
          isCompleted: true,
          overallGrade: 'A' as ChallengeGrade,
          insightReward: 75,
          itemReward: 'item-001',
          timeRemaining: 150,
          challengeState: 'completed'
        };
        
        const state = challengeReducer(initialState, resetChallenge());
        
        // Should be reset to initial state
        expect(state.currentChallengeId).toBeNull();
        expect(state.challengeType).toBeNull();
        expect(state.title).toBe('');
        expect(state.currentStage).toBeNull();
        expect(state.isCompleted).toBe(false);
        expect(state.overallGrade).toBeNull();
        expect(state.insightReward).toBe(0);
        expect(state.itemReward).toBeNull();
        expect(state.timeRemaining).toBeNull();
        expect(state.challengeState).toBe('inactive');
      });
    });
  
    // Timer tests
    describe('challenge timer', () => {
      it('should handle decrementTimer when time remains', () => {
        const initialState = {
          currentChallengeId: 'challenge-001',
          challengeType: 'clinical' as ChallengeType,
          difficulty: 'normal' as Difficulty,
          title: 'Test Challenge',
          description: 'A test challenge',
          currentStage: 'stage1' as ChallengeStage,
          stages: [],
          isCompleted: false,
          overallGrade: null,
          insightReward: 0,
          itemReward: null,
          timeRemaining: 10,
          challengeState: 'active'
        };
        
        const state = challengeReducer(initialState, decrementTimer());
        
        expect(state.timeRemaining).toBe(9);
        expect(state.isCompleted).toBe(false);
        expect(state.challengeState).toBe('active');
      });
  
      it('should handle decrementTimer when time runs out', () => {
        const initialState = {
          currentChallengeId: 'challenge-001',
          challengeType: 'clinical' as ChallengeType,
          difficulty: 'normal' as Difficulty,
          title: 'Test Challenge',
          description: 'A test challenge',
          currentStage: 'stage1' as ChallengeStage,
          stages: [],
          isCompleted: false,
          overallGrade: null,
          insightReward: 0,
          itemReward: null,
          timeRemaining: 1,
          challengeState: 'active'
        };
        
        const state = challengeReducer(initialState, decrementTimer());
        
        expect(state.timeRemaining).toBe(0);
        expect(state.isCompleted).toBe(true);
        expect(state.overallGrade).toBe('F');
        expect(state.challengeState).toBe('failed');
      });
  
      it('should not change state when timer is null', () => {
        const initialState = {
          currentChallengeId: 'challenge-001',
          challengeType: 'clinical' as ChallengeType,
          difficulty: 'normal' as Difficulty,
          title: 'Test Challenge',
          description: 'A test challenge',
          currentStage: 'stage1' as ChallengeStage,
          stages: [],
          isCompleted: false,
          overallGrade: null,
          insightReward: 0,
          itemReward: null,
          timeRemaining: null, // No timer
          challengeState: 'active'
        };
        
        const state = challengeReducer(initialState, decrementTimer());
        
        // Should be unchanged
        expect(state).toEqual(initialState);
      });
    });
  
    // Complex scenario tests
    describe('challenge scenarios', () => {
      it('should handle a complete challenge flow', () => {
        let state = challengeReducer(undefined, startChallenge({
          id: 'challenge-001',
          type: 'clinical',
          totalStages: 3,
          title: 'Clinical Case',
          description: 'Evaluate a treatment plan',
          difficulty: 'normal'
        }));
        
        // Start at introduction
        expect(state.currentStage).toBe('introduction');
        
        // Advance to stage 1
        state = challengeReducer(state, advanceStage('stage1'));
        expect(state.currentStage).toBe('stage1');
        
        // Record response for stage 1
        state = challengeReducer(state, recordResponse({
          stage: 'stage1',
          response: { selection: 'option-a' }
        }));
        
        // Advance to stage 2
        state = challengeReducer(state, advanceStage('stage2'));
        expect(state.currentStage).toBe('stage2');
        
        // Record response for stage 2
        state = challengeReducer(state, recordResponse({
          stage: 'stage2',
          response: { value: 42 }
        }));
        
        // Advance to stage 3
        state = challengeReducer(state, advanceStage('stage3'));
        expect(state.currentStage).toBe('stage3');
        
        // Record response for stage 3
        state = challengeReducer(state, recordResponse({
          stage: 'stage3',
          response: { choices: ['a', 'c'] }
        }));
        
        // Advance to outcome
        state = challengeReducer(state, advanceStage('outcome'));
        expect(state.currentStage).toBe('outcome');
        
        // Complete the challenge
        state = challengeReducer(state, completeChallenge({
          grade: 'A',
          rewards: [
            { type: 'insight', value: 75 }
          ]
        }));
        
        // Verify final state
        expect(state.isCompleted).toBe(true);
        expect(state.overallGrade).toBe('A');
        expect(state.insightReward).toBe(75);
        expect(state.challengeState).toBe('completed');
      });
    });
  });