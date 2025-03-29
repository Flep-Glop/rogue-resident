import { 
    Challenge, 
    ClinicalChallenge,
    QAChallenge, 
    EducationalChallenge,
    BossChallenge,
    ChallengeStageInfo
  } from '@/lib/types/challenge-types';
  import { generateSequentialId } from '@/lib/utils/id-generator';
  
  // Helper function for creating sequential IDs
  const createId = (type: string, index: number) => 
    generateSequentialId(type, index);
  
  // Clinical Challenges
  export const clinicalChallenges: ClinicalChallenge[] = [
    {
      id: createId('clinical', 1),
      type: 'clinical',
      subType: 'imaging-review',
      title: 'Breast Cancer Treatment Plan',
      description: 'Evaluate CT images and design an optimal treatment plan for a patient with breast cancer.',
      difficulty: 'normal',
      patientCase: {
        history: 'A 58-year-old female with Stage II left-sided breast cancer, post-lumpectomy.',
        prescription: '50 Gy in 25 fractions to the whole breast followed by a 10 Gy boost to the tumor bed.',
        imagingAvailable: ['CT', 'MRI']
      },
      stages: [
        {
          id: 'introduction',
          title: 'Patient Introduction',
          description: 'Review the patient history and understand the treatment goals.',
          type: 'information',
          content: {
            patientInfo: 'A 58-year-old female with Stage II left-sided breast cancer, post-lumpectomy.',
            clinicalNotes: 'Patient had a successful lumpectomy performed 4 weeks ago. Pathology confirmed invasive ductal carcinoma with clear margins. Sentinel lymph node biopsy negative.',
            prescription: '50 Gy in 25 fractions to the whole breast followed by a 10 Gy boost to the tumor bed.',
            treatmentGoals: [
              'Deliver prescribed dose to the target volume',
              'Minimize dose to heart and ipsilateral lung',
              'Ensure dose homogeneity throughout the breast'
            ]
          },
          grading: {
            criteria: {},
            points: 0
          }
        },
        {
          id: 'imaging-review',
          title: 'Imaging Review',
          description: 'Identify target volumes and organs at risk on the CT images.',
          type: 'imaging-review',
          content: {
            imageSeries: 'ct_breast_case1',
            structures: [
              'Whole Breast PTV',
              'Tumor Bed CTV',
              'Tumor Bed PTV',
              'Heart',
              'Left Lung',
              'Right Lung'
            ],
            task: 'Identify the following structures on the CT images.'
          },
          correctAnswer: {
            regionIdentification: {
              'Whole Breast PTV': [{ slice: 45, x: 230, y: 180, radius: 20 }],
              'Tumor Bed CTV': [{ slice: 45, x: 255, y: 172, radius: 10 }],
              'Heart': [{ slice: 45, x: 330, y: 220, radius: 15 }],
              'Left Lung': [{ slice: 45, x: 280, y: 200, radius: 25 }]
            }
          },
          grading: {
            criteria: {
              accuracy: 'Structures were correctly identified',
              completion: 'All required structures were identified'
            },
            points: 30
          }
        },
        {
          id: 'parameter-selection',
          title: 'Treatment Parameter Selection',
          description: 'Select appropriate treatment parameters for this case.',
          type: 'parameter-selection',
          content: {
            prompt: 'Select the appropriate treatment parameters for this breast cancer case.',
            options: {
              technique: ['3D Conformal', 'IMRT', 'VMAT', 'Electron Therapy'],
              energy: ['6 MV', '10 MV', '15 MV', 'Mixed 6/15 MV'],
              beamArrangement: ['Opposed Tangents', 'Partial Arc VMAT', 'Full Arc VMAT', 'Four-Field Box'],
              imageGuidance: ['Daily CBCT', 'Weekly CBCT', 'Daily kV Imaging', 'No image guidance']
            }
          },
          correctAnswer: {
            technique: ['3D Conformal', 'IMRT'],
            energy: ['6 MV'],
            beamArrangement: ['Opposed Tangents'],
            imageGuidance: ['Weekly CBCT', 'Daily kV Imaging']
          },
          grading: {
            criteria: {
              techniqueSelection: 'Appropriate technique was selected',
              energySelection: 'Appropriate energy was selected',
              beamArrangementSelection: 'Appropriate beam arrangement was selected',
              imageGuidanceSelection: 'Appropriate image guidance was selected'
            },
            points: 25
          }
        },
        {
          id: 'plan-evaluation',
          title: 'Plan Evaluation',
          description: 'Evaluate a treatment plan for this case and identify any issues.',
          type: 'plan-evaluation',
          content: {
            prompt: 'Review the following DVH and determine if the plan meets clinical criteria.',
            dvhData: {
              structures: [
                { name: 'Whole Breast PTV', color: '#FF0000' },
                { name: 'Heart', color: '#00FF00' },
                { name: 'Left Lung', color: '#0000FF' }
              ],
              data: 'breast_dvh_case1'
            },
            criteria: [
              'PTV: V95% > 95%',
              'PTV: V105% < 5%',
              'Heart: Mean dose < 3 Gy',
              'Heart: V25Gy < 5%',
              'Ipsilateral Lung: V20Gy < 20%'
            ],
            questions: [
              {
                id: 'q1',
                text: 'Does the plan meet the PTV coverage criterion?',
                type: 'boolean'
              },
              {
                id: 'q2',
                text: 'Does the plan meet the PTV hotspot criterion?',
                type: 'boolean'
              },
              {
                id: 'q3',
                text: 'Does the plan meet the heart dose criterion?',
                type: 'boolean'
              },
              {
                id: 'q4',
                text: 'Does the plan meet the lung dose criterion?',
                type: 'boolean'
              },
              {
                id: 'q5',
                text: 'What changes would you recommend to improve the plan?',
                type: 'multiselect',
                options: [
                  'Adjust tangent angles',
                  'Use mixed energy beams',
                  'Add heart block',
                  'Switch to VMAT',
                  'Plan is acceptable as is'
                ]
              }
            ]
          },
          correctAnswer: {
            q1: true,
            q2: false,
            q3: true,
            q4: true,
            q5: ['Adjust tangent angles', 'Add heart block']
          },
          grading: {
            criteria: {
              coverage: 'Correctly assessed PTV coverage',
              hotspot: 'Correctly assessed PTV hotspot',
              oarProtection: 'Correctly assessed OAR protection',
              improvement: 'Provided appropriate improvement recommendations'
            },
            points: 45
          }
        },
        {
          id: 'outcome',
          title: 'Treatment Outcome',
          description: 'Review the final treatment outcome and recommendations.',
          type: 'information',
          content: {
            summary: 'Your evaluation of this breast cancer case is complete.',
            feedback: 'You correctly identified the target volumes and organs at risk. Your treatment parameter selection was appropriate for this case, and you correctly identified the issues with the treatment plan.',
            patientOutcome: 'With the adjustments you recommended, the patient received a treatment plan that met all clinical criteria and completed her radiation therapy course without significant side effects.'
          },
          grading: {
            criteria: {},
            points: 0
          }
        }
      ],
      timeLimit: 300,
      rewards: [
        {
          insight: 75,
          itemId: 'knowledge_001'
        }
      ]
    },
    {
      id: createId('clinical', 2),
      type: 'clinical',
      subType: 'parameter-selection',
      title: 'Prostate IMRT Plan',
      description: 'Assess target volumes and evaluate DVH for a prostate IMRT case while addressing organ-at-risk sparing.',
      difficulty: 'hard',
      patientCase: {
        history: 'A 65-year-old male with intermediate-risk prostate cancer, Gleason score 3+4, PSA 8.2 ng/mL.',
        prescription: '78 Gy in 39 fractions to the prostate and proximal seminal vesicles.',
        imagingAvailable: ['CT', 'MRI']
      },
      stages: [
        // Stages would be filled in similarly to the breast cancer case
        {
          id: 'introduction',
          title: 'Patient Introduction',
          description: 'Review the patient history and understand the treatment goals.',
          type: 'information',
          content: {
            patientInfo: 'A 65-year-old male with intermediate-risk prostate cancer.',
            clinicalNotes: 'Patient has Gleason score 3+4, PSA 8.2 ng/mL. No distant metastases. Patient has moderate urinary symptoms at baseline.',
            prescription: '78 Gy in 39 fractions to the prostate and proximal seminal vesicles.',
            treatmentGoals: [
              'Deliver prescribed dose to the target volume',
              'Minimize dose to rectum and bladder',
              'Preserve erectile function by minimizing dose to penile bulb',
              'Keep femoral head doses below tolerance'
            ]
          },
          grading: {
            criteria: {},
            points: 0
          }
        },
        // Additional stages would be defined here
        {
          id: 'outcome',
          title: 'Treatment Outcome',
          description: 'Review the final treatment outcome and recommendations.',
          type: 'information',
          content: {
            summary: 'Your evaluation of this prostate cancer case is complete.',
            feedback: 'You demonstrated good understanding of prostate IMRT planning and dose constraints for critical structures.',
            patientOutcome: 'The treatment plan was successfully implemented and the patient completed the full course with minimal side effects.'
          },
          grading: {
            criteria: {},
            points: 0
          }
        }
      ],
      timeLimit: 360,
      rewards: [
        {
          insight: 100,
          itemId: 'technical_002'
        }
      ]
    }
  ];
  
  // QA Challenges
  export const qaChallenges: QAChallenge[] = [
    {
      id: createId('qa', 1),
      type: 'qa',
      subType: 'measurement-setup',
      title: 'Linear Accelerator Output Calibration',
      description: 'Set up ion chamber measurements, take readings, analyze stability, and make adjustments.',
      difficulty: 'normal',
      equipment: {
        type: 'Linear Accelerator',
        specifications: {
          model: 'TrueBeam',
          energies: ['6 MV', '10 MV', '15 MV', '6 MeV', '9 MeV', '12 MeV'],
          tolerances: {
            outputConstancy: '±2%',
            flatness: '±3%',
            symmetry: '±2%'
          }
        }
      },
      stages: [
        {
          id: 'introduction',
          title: 'Calibration Setup',
          description: 'Review the equipment and calibration requirements.',
          type: 'information',
          content: {
            equipmentInfo: 'TrueBeam linear accelerator with photon and electron energies.',
            testPurpose: 'Perform monthly output calibration to ensure stable and accurate dose delivery.',
            requiredEquipment: [
              'Farmer-type ionization chamber',
              'Electrometer',
              'Solid water phantom',
              'Thermometer and barometer',
              'Calibration certificates'
            ],
            testFrequency: 'Monthly and after any service affecting beam output.'
          },
          grading: {
            criteria: {},
            points: 0
          }
        },
        {
          id: 'measurement-setup',
          title: 'Measurement Setup',
          description: 'Configure the appropriate test equipment for output measurement.',
          type: 'measurement-setup',
          content: {
            prompt: 'Set up the equipment correctly for photon output measurements.',
            options: {
              chamberType: ['Farmer chamber', 'PinPoint chamber', 'Parallel plate chamber', 'Diamond detector'],
              phantomSetup: ['Solid water at 10cm depth', 'Water tank at dmax', 'Solid water at dmax', 'Solid water at 5cm depth'],
              fieldSize: ['10x10 cm', '5x5 cm', '20x20 cm', '3x3 cm'],
              ssd: ['100 cm', '90 cm', '110 cm', '85 cm'],
              energiesToTest: ['All photon energies', 'All electron energies', '6 MV only', 'Clinical energies only']
            }
          },
          correctAnswer: {
            chamberType: ['Farmer chamber'],
            phantomSetup: ['Solid water at 10cm depth'],
            fieldSize: ['10x10 cm'],
            ssd: ['100 cm'],
            energiesToTest: ['All photon energies']
          },
          grading: {
            criteria: {
              chamberSelection: 'Selected appropriate chamber',
              phantomSetup: 'Configured phantom correctly',
              fieldSize: 'Used standard field size',
              geometrySetup: 'Used correct SSD/measurement distance'
            },
            points: 30
          }
        },
        // Additional stages would be defined here
        {
          id: 'outcome',
          title: 'Calibration Results',
          description: 'Review the final results of your linear accelerator calibration.',
          type: 'information',
          content: {
            summary: 'Your calibration of the linear accelerator output is complete.',
            testStatus: 'PASS',
            outputStability: 'All energies within ±1% of expected values',
            recommendations: 'Continue with monthly QA schedule. No additional adjustments needed.'
          },
          grading: {
            criteria: {},
            points: 0
          }
        }
      ],
      timeLimit: 300,
      rewards: [
        {
          insight: 75,
          itemId: 'technical_001'
        }
      ]
    },
    // Additional QA challenges would be defined here
  ];
  
  // Educational Challenges
  export const educationalChallenges: EducationalChallenge[] = [
    {
      id: createId('educational', 1),
      type: 'educational',
      subType: 'concept-explanation',
      title: 'Teaching: Radiation Biology Basics',
      description: 'Prepare and deliver a lecture explaining DNA damage, comparing radiation types, and addressing student questions.',
      difficulty: 'normal',
      audience: 'students',
      topic: 'radiation biology',
      stages: [
        {
          id: 'introduction',
          title: 'Teaching Assignment',
          description: 'Review the teaching requirement and audience information.',
          type: 'information',
          content: {
            audienceInfo: 'First-year radiation therapy students with basic physics background.',
            teachingRequest: 'Prepare a 30-minute lecture on radiation biology fundamentals.',
            learningObjectives: [
              'Explain the direct and indirect mechanisms of radiation damage',
              'Compare the biological effects of different radiation types',
              'Describe the relationship between dose and biological effect',
              'Explain the importance of fractionation in radiation therapy'
            ],
            availableResources: [
              'Digital slides and presentation equipment',
              'Whiteboard and markers',
              'Anatomical models',
              'Access to online simulation tools'
            ]
          },
          grading: {
            criteria: {},
            points: 0
          }
        },
        // Additional stages would be defined here
        {
          id: 'outcome',
          title: 'Teaching Evaluation',
          description: 'Review the feedback on your radiation biology lecture.',
          type: 'information',
          content: {
            summary: 'Your radiation biology lecture has been evaluated.',
            studentFeedback: 'Students rated the lecture 4.8/5 for clarity and engagement.',
            positiveAspects: [
              'Clear explanations of complex concepts',
              'Effective use of visuals and analogies',
              'Good handling of student questions',
              'Appropriate level for the audience'
            ],
            areasForImprovement: 'Consider including more clinical examples to relate theory to practice.'
          },
          grading: {
            criteria: {},
            points: 0
          }
        }
      ],
      timeLimit: 360,
      rewards: [
        {
          insight: 75,
          itemId: 'teaching_001'
        }
      ]
    },
    // Additional educational challenges would be defined here
  ];
  
  // Boss Challenge (Ionix)
  export const bossChallenges: BossChallenge[] = [
    {
      id: createId('boss', 1),
      type: 'boss',
      subType: 'calibration',
      title: 'Ionix Containment Protocol',
      description: 'Address the emergent sentience of the Ionix chamber through a multi-phase scientific approach.',
      difficulty: 'hard',
      phase: 1,
      ionixState: {
        energy: 85,
        stability: 50,
        sentience: 70
      },
      stages: [
        {
          id: 'introduction',
          title: 'Ionix Anomaly Detection',
          description: 'Evaluate the unusual behavior of the Ionix ion chamber.',
          type: 'information',
          content: {
            situation: 'The Ionix ion chamber has been displaying unusual readings and appears to be responding to stimuli in ways that suggest emergent sentience.',
            observations: [
              'Chamber readings fluctuate without external radiation changes',
              'Response patterns correlate with nearby human activity',
              'Digital output occasionally displays non-calibration messages',
              'Energy signature shows mathematical patterns beyond normal background noise'
            ],
            taskOverview: 'You must investigate this phenomenon and determine the appropriate response to ensure safety and scientific understanding.'
          },
          grading: {
            criteria: {},
            points: 0
          }
        },
        // Additional stages would be defined here
        {
          id: 'outcome',
          title: 'Resolution Outcome',
          description: 'Review the outcome of your interaction with Ionix.',
          type: 'information',
          content: {
            summary: 'Your approach to the Ionix situation has been resolved.',
            outcome: 'You successfully established stable communication with Ionix while implementing appropriate safety protocols.',
            scientificImplications: 'This unprecedented phenomenon offers new research opportunities in quantum effects in calibration equipment.',
            recommendations: 'Continue monitored interaction with Ionix under controlled conditions with regular stability assessments.'
          },
          grading: {
            criteria: {},
            points: 0
          }
        }
      ],
      timeLimit: 480,
      rewards: [
        {
          insight: 150,
          itemId: 'special_004'
        }
      ]
    }
  ];
  
  // Combine all challenges
  export const allChallenges: Challenge[] = [
    ...clinicalChallenges,
    ...qaChallenges,
    ...educationalChallenges,
    ...bossChallenges
  ];
  
  /**
   * Get a challenge by ID
   * @param id Challenge ID
   * @returns Challenge object or undefined if not found
   */
  export function getChallengeById(id: string): Challenge | undefined {
    return allChallenges.find(challenge => challenge.id === id);
  }
  
  /**
   * Filter challenges by type
   * @param type Challenge type
   * @returns Filtered array of challenges
   */
  export function getChallengesByType(type: 'clinical' | 'qa' | 'educational' | 'boss'): Challenge[] {
    return allChallenges.filter(challenge => challenge.type === type);
  }
  
  /**
   * Get challenges by difficulty
   * @param difficulty Challenge difficulty
   * @returns Filtered array of challenges
   */
  export function getChallengesByDifficulty(difficulty: 'easy' | 'normal' | 'hard'): Challenge[] {
    return allChallenges.filter(challenge => challenge.difficulty === difficulty);
  }
  
  /**
   * Get a random challenge based on type and difficulty
   * @param type Challenge type
   * @param difficulty Optional difficulty filter
   * @returns Random challenge or undefined if none match criteria
   */
  export function getRandomChallenge(
    type: 'clinical' | 'qa' | 'educational' | 'boss',
    difficulty?: 'easy' | 'normal' | 'hard'
  ): Challenge | undefined {
    // Filter challenges by type and optional difficulty
    const filteredChallenges = allChallenges.filter(challenge => 
      challenge.type === type && 
      (difficulty ? challenge.difficulty === difficulty : true)
    );
    
    // Return a random challenge if any match the criteria
    if (filteredChallenges.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredChallenges.length);
      return filteredChallenges[randomIndex];
    }
    
    return undefined;
  }
  
  /**
   * Get a stage from a challenge by ID
   * @param challengeId Challenge ID
   * @param stageId Stage ID
   * @returns Stage object or undefined if not found
   */
  export function getChallengeStage(
    challengeId: string, 
    stageId: string
  ): ChallengeStageInfo | undefined {
    const challenge = getChallengeById(challengeId);
    return challenge?.stages.find(stage => stage.id === stageId);
  }