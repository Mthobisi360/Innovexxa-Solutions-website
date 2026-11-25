export type LearningMode = 'read' | 'listen' | 'prerecorded' | 'live';

export type PhaseId = 'foundation' | 'intermediate' | 'fet';

export interface BilingualTerm {
  term: string;
  english: string;
  siswati: string;
  isizulu: string;
  sepedi: string;
  xitsonga: string;
}

export interface ModuleCheckQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CurriculumModule {
  id: string;
  phase: PhaseId;
  phaseLabel: string;
  grade: string;
  subject: 'Coding and Robotics' | 'Physical Sciences';
  strand: string;
  weeklyHours: string;
  summary: string;
  topics: string[];
  visualKind: 'pattern' | 'coding' | 'robotics' | 'network' | 'apps' | 'circuit' | 'mechanics' | 'chemistry' | 'waves';
  definitions: { term: string; meaning: string }[];
  workedExample: {
    title: string;
    steps: string[];
    codeOrFormula?: string;
  };
  practicalTask: string;
  vocabulary: BilingualTerm[];
  checkQuestion: ModuleCheckQuestion;
  videoChapters: { time: string; title: string; narration: string }[];
  liveSession: {
    facilitator: string;
    schedule: string;
    focusTopic: string;
    roomCode: string;
  };
}

interface RawModuleSpec {
  id: string;
  phase: PhaseId;
  grade: string;
  strand: string;
  summary: string;
  topics: string[];
  visualKind: CurriculumModule['visualKind'];
  codeOrFormula?: string;
  workedTitle?: string;
  workedSteps?: string[];
  practicalTask?: string;
  checkQuestion?: ModuleCheckQuestion;
}

const PHASE_META: Record<
  PhaseId,
  {
    phaseLabel: string;
    subject: 'Coding and Robotics' | 'Physical Sciences';
    defaultVocab: BilingualTerm[];
  }
> = {
  foundation: {
    phaseLabel: 'Foundation Phase (Grades R–3)',
    subject: 'Coding and Robotics',
    defaultVocab: [
      {
        term: 'Algorithm',
        english: 'A clear step-by-step set of instructions to solve a task.',
        siswati: 'Tinhlelo tetinyatselo leticacile tekucedza umsebenti.',
        isizulu: 'Uhlelo lwezinyathelo ezicacile zokuqeda umsebenzi.',
        sepedi: 'Tatelano ya dikgato tše di kwagalago go rarolla mošomo.',
        xitsonga: 'Ndzandzelelano wa magoza yo olova ku hetisisa ntirho.',
      },
      {
        term: 'Debug',
        english: 'Finding and fixing a mistake in a sequence or pattern.',
        siswati: 'Kutfola nekucungulula liphutsa kulandzelana kwemiyalo.',
        isizulu: 'Ukuthola nokulungisa iphutha kulandelano lwemiyalo.',
        sepedi: 'Go hwetša le go lokiša phošo mo tatelanong ya ditaelo.',
        xitsonga: 'Ku kuma ni ku lulamisa xihoxo eka ndzandzelelano wa swileriso.',
      },
      {
        term: 'Circuit',
        english: 'A closed path where electricity flows from a battery to a bulb or buzzer.',
        siswati: 'Indlela levalekile lapho gezi uhamba khona kusuka ebhathri kuya kulambu.',
        isizulu: 'Indlela evalekile lapho ugesi uhamba khona usuka ebhethri uya esibani.',
        sepedi: 'Tsela ye e tswaletšwego moo mohlagase o elago go tšwa go beteri.',
        xitsonga: 'Ndlela leyi pfariweke laha gezi yi fambaka kona ku suka eka betiri.',
      },
    ],
  },
  intermediate: {
    phaseLabel: 'Intermediate Phase (Grades 4–6)',
    subject: 'Coding and Robotics',
    defaultVocab: [
      {
        term: 'Microcontroller',
        english: 'A compact programmable computer chip that reads sensors and controls outputs.',
        siswati: 'Lichibi lelincane lelikhombisa tikhombisi bese lilawula imiphumela.',
        isizulu: 'Ubuchopho obuncane obufunda izinzwa bese bulawula imiphumela.',
        sepedi: 'Tšhipi ye nnyane ya khomphutha yeo e balago disensara le go laola dipoelo.',
        xitsonga: 'Xitirhisiwa xitsongo lexi hlayaka tisensa ni ku lawula mbuyelo.',
      },
      {
        term: 'Variable',
        english: 'A named container in memory that stores a changing number or text value.',
        siswati: 'Sigcini lesineligama lesigcina linani noma emagama lashintjako.',
        isizulu: 'Isikhundla esinegama esigcina inombolo noma umbhalo oshintshayo.',
        sepedi: 'Sebjana seo se nago le leina sa go boloka palo goba mongwalo wo o fetogago.',
        xitsonga: 'Xihlayisi lexi nga ni vito xo hlayisa nhlayo kumbe marito lama cincaka.',
      },
      {
        term: 'Conditional (If/Else)',
        english: 'A decision rule that runs one block when true and another when false.',
        siswati: 'Umtsetfo wesincumo losebenta nangabe liciniso noma liphambene.',
        isizulu: 'Umthetho wesinqumo osebenza uma kuyiqiniso noma kungamanga.',
        sepedi: 'Molao wa sephetho wo o šomago ge eba ke nnete goba maaka.',
        xitsonga: 'Nawu wa xiboho lowu tirhaka loko swi ri ntiyiso kumbe swi nga ri ntiyiso.',
      },
    ],
  },
  fet: {
    phaseLabel: 'FET Phase (Grades 10–12)',
    subject: 'Physical Sciences',
    defaultVocab: [
      {
        term: 'Potential Difference (V)',
        english: 'Work done per unit positive charge moving between two points in a circuit.',
        siswati: 'Umsebenti lowentiwa ngelishaja linye lelihle emkhatsini wemaphuzu lamabili.',
        isizulu: 'Umsebenzi owenziwa yishaja eyodwa ehamba phakathi kwamaphuzu amabili.',
        sepedi: 'Mošomo wo o dirwago ka yuniti e tee ya tšhatšhe gare ga dintlha tše pedi.',
        xitsonga: 'Ntirho lowu endliwaka hi tshaji yinwe exikarhi ka tinhla timbirhi.',
      },
      {
        term: 'Conservation of Momentum',
        english: 'Total linear momentum in an isolated system remains constant in magnitude and direction.',
        siswati: 'Lizinga lekuhamba leliphelele endzaweni levalekile lihlala lingashintji.',
        isizulu: 'Umfutho ophelele ohlelweni oluzimele uhlala ungashintshi.',
        sepedi: 'Momentamo ka moka mo tshepedišong ye e ikemetšego e dula e sa fetoge.',
        xitsonga: 'Momentamu hinkwayo eka sisiteme leyi tiyimeleke yi tshama yi nga cinci.',
      },
      {
        term: 'Equilibrium (Kc)',
        english: 'State in a reversible reaction where forward and reverse rates are equal.',
        siswati: 'Simo lapho lizinga lekuya phambili nelibuyako lilingana khona.',
        isizulu: 'Isimo lapho ijubane lokuya phambili nelokubuya elingana ngaso.',
        sepedi: 'Maemo moo lebelo la go ya pele le la go boela morago di lekanago.',
        xitsonga: 'Xiyimo laha rivilo ra ku ya emahlweni ni ku tlhela swi ringanaka.',
      },
    ],
  },
};

function weeklyHoursFor(phase: PhaseId, grade: string): string {
  if (phase === 'fet') return '4 hrs/week';
  if (phase === 'intermediate') return '2 hrs/week';
  return grade === 'Grade 3' ? '2 hrs/week' : '1 hr/week';
}

function buildModule(spec: RawModuleSpec): CurriculumModule {
  const meta = PHASE_META[spec.phase];
  const weeklyHours = weeklyHoursFor(spec.phase, spec.grade);
  const firstTopic = spec.topics[0] ?? spec.strand;
  const secondTopic = spec.topics[1] ?? spec.summary;

  const defaultDefinitions = [
    {
      term: `${spec.strand} Focus`,
      meaning: spec.summary,
    },
    {
      term: 'Core Classroom Concept',
      meaning: `Learners investigate ${firstTopic} and apply ${secondTopic} in guided practical activities.`,
    },
    {
      term: 'CAPS Time Allocation',
      meaning: `Scheduled for ${weeklyHours} within the ${meta.phaseLabel} timetable.`,
    },
  ];

  const defaultWorkedSteps =
    spec.workedSteps ??
    [
      `1. Introduce the core concept: ${firstTopic}.`,
      `2. Model the practical steps using familiar classroom materials and ${secondTopic}.`,
      `3. Test, observe results, and verify outcomes against CAPS criteria for ${spec.grade}.`,
    ];

  const defaultQuestion: ModuleCheckQuestion = spec.checkQuestion ?? {
    question: `Which core focus area belongs to ${spec.grade} — ${spec.strand}?`,
    options: [
      firstTopic.charAt(0).toUpperCase() + firstTopic.slice(1),
      'Unrelated university-only elective theory',
      'Memorising answers without practical testing',
    ],
    correctIndex: 0,
    explanation: `${spec.grade} ${spec.strand} centres directly on ${firstTopic} through hands-on inquiry.`,
  };

  return {
    id: spec.id,
    phase: spec.phase,
    phaseLabel: meta.phaseLabel,
    grade: spec.grade,
    subject: meta.subject,
    strand: spec.strand,
    weeklyHours,
    summary: spec.summary,
    topics: spec.topics,
    visualKind: spec.visualKind,
    definitions: defaultDefinitions,
    workedExample: {
      title: spec.workedTitle ?? `${spec.grade} Guided Walkthrough: ${spec.strand}`,
      steps: defaultWorkedSteps,
      codeOrFormula: spec.codeOrFormula,
    },
    practicalTask:
      spec.practicalTask ??
      `Complete a hands-on ${spec.grade} portfolio activity demonstrating ${firstTopic} and explain your reasoning in your home language and English.`,
    vocabulary: meta.defaultVocab,
    checkQuestion: defaultQuestion,
    videoChapters: [
      {
        time: '00:00',
        title: `1. Orientation & ${spec.strand} Overview`,
        narration: `Welcome to ${spec.grade} ${meta.subject}. Today we explore ${spec.summary}`,
      },
      {
        time: '02:15',
        title: '2. Concept Demonstration & Visual Model',
        narration: `Watch how ${firstTopic} connects directly to ${secondTopic} in real-world South African classrooms.`,
      },
      {
        time: '05:40',
        title: '3. Guided Practice & Assessment Check',
        narration: `Follow along with your mobile lab kit or notebook to verify each step and avoid common errors.`,
      },
    ],
    liveSession: {
      facilitator:
        spec.phase === 'fet'
          ? 'Thabo Mokoena (FET Physical Sciences Lead)'
          : 'Nomsa Dlamini (CAPS Coding & Robotics Mentor)',
      schedule:
        spec.phase === 'foundation'
          ? 'Tuesdays & Thursdays · 14:30 SAST'
          : spec.phase === 'intermediate'
            ? 'Mondays & Wednesdays · 15:00 SAST'
            : 'Mondays to Thursdays · 16:00 SAST',
      focusTopic: `${spec.grade}: ${spec.strand} Live Clinic & Q&A`,
      roomCode: `INV-${spec.id.toUpperCase().slice(0, 8)}`,
    },
  };
}

const RAW_MODULES: RawModuleSpec[] = [
  // ==========================================================
  // 1. FOUNDATION PHASE (GRADES R–3): CODING AND ROBOTICS
  // ==========================================================
  // Grade R
  {
    id: 'gr-r-pattern',
    phase: 'foundation',
    grade: 'Grade R',
    strand: 'Pattern Recognition & Problem Solving',
    summary: 'Repeating patterns up to 2–3 times, movement patterns, completing sequences, and peer replication.',
    topics: [
      'repeating patterns up to 2–3 times',
      'movement and rhythm patterns',
      'completing missing items in sequences',
      'peer pattern replication using physical objects',
    ],
    visualKind: 'pattern',
    workedTitle: 'Clap-Step-Turn Pattern Replication',
    workedSteps: [
      '1. Arrange 3 physical blocks: Red, Blue, Red, Blue.',
      '2. Ask learners to identify the repeating unit (Red -> Blue).',
      '3. Replicate the pattern as body movement: Clap -> Jump -> Clap -> Jump.',
    ],
  },
  {
    id: 'gr-r-algorithms',
    phase: 'foundation',
    grade: 'Grade R',
    strand: 'Algorithms & Coding',
    summary: 'Computers and computing devices, decomposition, sequences, directional code cards, item swapping, and debugging mazes.',
    topics: [
      'identifying computers and everyday computing devices',
      'decomposition of daily routines into small steps',
      'directional code cards (forward, left, right)',
      'item swapping and debugging simple floor mazes',
    ],
    visualKind: 'coding',
    codeOrFormula: '[START] -> [FORWARD] -> [FORWARD] -> [TURN RIGHT] -> [GOAL]',
  },
  {
    id: 'gr-r-robotics',
    phase: 'foundation',
    grade: 'Grade R',
    strand: 'Robotics Skills',
    summary: 'Input/output robot control, 4-step to 8-step instruction sequences, and pick-and-drop tasks.',
    topics: [
      'basic input buttons and output movement on a robot',
      '4-step to 8-step instruction sequences',
      'pick-and-drop classroom grid tasks',
    ],
    visualKind: 'robotics',
  },
  {
    id: 'gr-r-internet',
    phase: 'foundation',
    grade: 'Grade R',
    strand: 'Internet & E-Communications',
    summary: 'Privacy, personal details, ID cards, pattern passwords, digital security, and good password habits.',
    topics: [
      'privacy and protecting personal details',
      'understanding ID cards and trusted adults',
      'pattern passwords and digital security basics',
      'good password habits (never sharing secret codes)',
    ],
    visualKind: 'network',
  },
  {
    id: 'gr-r-apps',
    phase: 'foundation',
    grade: 'Grade R',
    strand: 'Application Skills',
    summary: 'Switching devices on/off, UI navigation, mouse and touch gestures, sorting by size/colour/roll-or-slide, and virtual/physical keyboards.',
    topics: [
      'safely switching devices on and off',
      'UI navigation with mouse and touch gestures (tap, drag)',
      'sorting objects by size, colour, or roll-or-slide',
      'exploring virtual and physical keyboards',
    ],
    visualKind: 'apps',
  },

  // Grade 1
  {
    id: 'gr-1-pattern',
    phase: 'foundation',
    grade: 'Grade 1',
    strand: 'Pattern Recognition & Problem Solving',
    summary: 'Patterns of 3–5 shapes/objects with 2–3 repetitions, debugging sequences, and real-world/cultural patterns.',
    topics: [
      'patterns of 3–5 shapes/objects with 2–3 repetitions',
      'debugging broken visual sequences',
      'real-world and South African cultural beadwork/geometric patterns',
    ],
    visualKind: 'pattern',
  },
  {
    id: 'gr-1-algorithms',
    phase: 'foundation',
    grade: 'Grade 1',
    strand: 'Algorithms & Coding',
    summary: 'Block-based movement (forward, back, left, right), loop blocks, input events, debugging, and pair programming.',
    topics: [
      'block-based movement (forward, back, left, right)',
      'repeat loop blocks to shorten code',
      'input events (when button clicked)',
      'debugging and pair programming roles (Driver & Navigator)',
    ],
    visualKind: 'coding',
    codeOrFormula: 'REPEAT 3 TIMES { MOVE_FORWARD(1); TURN_LEFT(90); }',
  },
  {
    id: 'gr-1-robotics',
    phase: 'foundation',
    grade: 'Grade 1',
    strand: 'Robotics Skills',
    summary: 'Robot mask/body construction, colour and shape sorting robots, basic circuits (battery, wires, switch, buzzer/bulb), and on/off states.',
    topics: [
      'robot mask and recycled body construction',
      'colour and shape sorting logic',
      'basic circuits (battery, wires, switch, buzzer/bulb)',
      'open vs closed switch on/off states',
    ],
    visualKind: 'robotics',
  },
  {
    id: 'gr-1-internet',
    phase: 'foundation',
    grade: 'Grade 1',
    strand: 'Internet & E-Communications',
    summary: 'Connectivity, online vs. offline, logging in, websites, digital safety, online identity/avatars, and digital footprints.',
    topics: [
      'connectivity: online vs. offline devices',
      'logging in safely and visiting trusted websites',
      'digital safety, avatars, and online identity',
      'introductory digital footprints',
    ],
    visualKind: 'network',
  },
  {
    id: 'gr-1-apps',
    phase: 'foundation',
    grade: 'Grade 1',
    strand: 'Application Skills',
    summary: 'Drawing/graphics UI, brush/pencil/line/shape tools, creating/saving/loading files, and combined 2D shapes.',
    topics: [
      'drawing/graphics user interface tools',
      'brush, pencil, line, and 2D shape tools',
      'creating, saving, and loading files',
      'combining 2D shapes into pictures',
    ],
    visualKind: 'apps',
  },

  // Grade 2
  {
    id: 'gr-2-pattern',
    phase: 'foundation',
    grade: 'Grade 2',
    strand: 'Pattern Recognition & Problem Solving',
    summary: 'Creating/analysing/debugging patterns, algorithmic thinking, number patterns, and encoding/decoding 3–4 letter words.',
    topics: [
      'creating, analysing, and debugging multi-step patterns',
      'algorithmic thinking and number skip-counting patterns',
      'encoding and decoding 3–4 letter words with symbol ciphers',
    ],
    visualKind: 'pattern',
    codeOrFormula: 'Cipher: A=1, B=2, C=3 ... -> "CODE" = [3, 15, 4, 5]',
  },
  {
    id: 'gr-2-algorithms',
    phase: 'foundation',
    grade: 'Grade 2',
    strand: 'Algorithms & Coding',
    summary: 'Programming interface features, character/agent selection and customisation, sequences, backgrounds, event triggers, loops, pen/stamp, sound, and broadcasting.',
    topics: [
      'programming interface features & stage coordinates',
      'character/agent selection, customisation, and backgrounds',
      'event triggers, loops, pen/stamp drawing, and sound blocks',
      'message broadcasting between two sprites',
    ],
    visualKind: 'coding',
  },
  {
    id: 'gr-2-robotics',
    phase: 'foundation',
    grade: 'Grade 2',
    strand: 'Robotics Skills',
    summary: 'Recycled chassis with fasteners, axles, and wheels; elastic-band and DC-motor fan propulsion.',
    topics: [
      'building a recycled chassis with fasteners, axles, and wheels',
      'elastic-band stored energy propulsion',
      'DC-motor fan propulsion and friction testing',
    ],
    visualKind: 'robotics',
  },
  {
    id: 'gr-2-internet',
    phase: 'foundation',
    grade: 'Grade 2',
    strand: 'Internet & E-Communications',
    summary: 'Digital communication methods across text, voice, and video.',
    topics: [
      'comparing text, voice, and video communication methods',
      'choosing respectful communication etiquette',
      'recognising sender and receiver roles',
    ],
    visualKind: 'network',
  },
  {
    id: 'gr-2-apps',
    phase: 'foundation',
    grade: 'Grade 2',
    strand: 'Application Skills',
    summary: 'Directional keys, pointing devices, text editor basics, punctuation keys, crosswords, numeric keys, and cut/copy/paste.',
    topics: [
      'directional arrow keys and pointing devices',
      'text editor basics and punctuation/numeric keys',
      'solving digital crosswords and using cut/copy/paste',
    ],
    visualKind: 'apps',
  },

  // Grade 3
  {
    id: 'gr-3-pattern',
    phase: 'foundation',
    grade: 'Grade 3',
    strand: 'Pattern Recognition & Problem Solving',
    summary: 'Encoding/decoding 7-word sentences, plan-implement-reflect algorithmic problem solving, 4x4 grid symbol sequences, and debugging.',
    topics: [
      'encoding and decoding 7-word sentences',
      'plan–implement–reflect algorithmic problem-solving cycle',
      '4x4 grid symbol sequences and step-by-step debugging',
    ],
    visualKind: 'pattern',
  },
  {
    id: 'gr-3-algorithms',
    phase: 'foundation',
    grade: 'Grade 3',
    strand: 'Algorithms & Coding',
    summary: 'Coding terms, custom objects, motion/looks blocks, repeat/repeat-forever loops, costumes, pen/stamp patterns, and sensory/keyboard/mouse/broadcast event triggers.',
    topics: [
      'core coding terms and custom sprite objects',
      'motion/looks blocks, costumes, and repeat-forever loops',
      'pen/stamp geometric patterns',
      'sensory, keyboard, mouse, and broadcast event triggers',
    ],
    visualKind: 'coding',
  },
  {
    id: 'gr-3-robotics',
    phase: 'foundation',
    grade: 'Grade 3',
    strand: 'Robotics Skills',
    summary: 'Breadboards (buzzer, bulb, DC motor, LED, resistor, switch), 2D/3D structures and cross-bracing, pulleys/linkages, series/parallel circuits, motor polarity, gears, and multi-motor sound structures.',
    topics: [
      'breadboards with buzzer, bulb, DC motor, LED, resistor, and switch',
      '2D/3D structures with triangular cross-bracing',
      'pulleys, linkages, and gear trains',
      'series vs parallel circuits and motor polarity reversal',
    ],
    visualKind: 'robotics',
  },
  {
    id: 'gr-3-internet',
    phase: 'foundation',
    grade: 'Grade 3',
    strand: 'Internet & E-Communications',
    summary: 'Networks (sender, receiver, switch, cables), network hardware and wired/wireless networks, Internet/WWW/websites, online safety, and child-friendly search engines.',
    topics: [
      'network topology: sender, receiver, switch, and cables',
      'wired vs wireless network hardware',
      'distinguishing the Internet, World Wide Web, and websites',
      'online safety and child-friendly search engines',
    ],
    visualKind: 'network',
  },
  {
    id: 'gr-3-apps',
    phase: 'foundation',
    grade: 'Grade 3',
    strand: 'Application Skills',
    summary: 'Spreadsheet UI, cell references, rows/columns, formatting, grid data capture, converting pictograms to bar graphs, and pasting charts into a text editor.',
    topics: [
      'spreadsheet UI: rows, columns, and cell references (e.g., A1, B3)',
      'formatting cells and capturing classroom survey data',
      'converting pictograms to bar graphs',
      'copying and pasting charts into a text editor report',
    ],
    visualKind: 'apps',
  },

  // ==========================================================
  // 2. INTERMEDIATE PHASE (GRADES 4–6): CODING AND ROBOTICS
  // ==========================================================
  // Grade 4
  {
    id: 'gr-4-algorithms',
    phase: 'intermediate',
    grade: 'Grade 4',
    strand: 'Algorithms & Coding',
    summary: 'Text and number variables (Join, Ask), arithmetic and comparison operators (+, -, ×, ÷, >, <), If then, Go to (x,y), Touching, Repeat, and event triggers.',
    topics: [
      'text and number variables using Join and Ask blocks',
      'arithmetic (+, -, ×, ÷) and comparison (>, <) operators',
      'If-then conditionals, Go to (x, y), Touching sensor, and Repeat loops',
    ],
    visualKind: 'coding',
    codeOrFormula: 'score = 0\nif touching_goal:\n    score = score + 1',
  },
  {
    id: 'gr-4-robotics',
    phase: 'intermediate',
    grade: 'Grade 4',
    strand: 'Robotics Skills',
    summary: 'Microcontrollers and IPO, block-based microcontroller coding, single/multiple LEDs and buzzers, structures, and mechanical fastening methods.',
    topics: [
      'microcontrollers and Input-Processing-Output (IPO) model',
      'block-based microcontroller coding (ESP32 / micro:bit)',
      'wiring single and multiple LEDs with resistors and buzzers',
      'rigid frame structures and mechanical fastening methods',
    ],
    visualKind: 'robotics',
    codeOrFormula: 'GPIO_OUT(pin=2, HIGH) -> WAIT(1s) -> GPIO_OUT(pin=2, LOW)',
  },
  {
    id: 'gr-4-internet',
    phase: 'intermediate',
    grade: 'Grade 4',
    strand: 'Internet & E-Communications',
    summary: 'Smartphone/tablet vs. laptop/desktop components (input, processing, storage, output), communication evolution and Indigenous Knowledge Systems (IKS), and internet benefits/risks.',
    topics: [
      'smartphone/tablet vs laptop/desktop hardware components',
      'input, processing, storage, and output functions',
      'communication evolution and South African Indigenous Knowledge Systems (IKS)',
      'internet benefits, cyber safety, and digital risks',
    ],
    visualKind: 'network',
  },
  {
    id: 'gr-4-apps',
    phase: 'intermediate',
    grade: 'Grade 4',
    strand: 'Application Skills',
    summary: 'Text formatting and illustrations, CAD basics (line, circle, rectangle, dimension tools), spreadsheet formulas (+, -) and bar charts, slide presentations, and video editing.',
    topics: [
      'word processing text formatting and illustrations',
      '2D CAD basics: line, circle, rectangle, and dimension tools',
      'spreadsheet addition/subtraction formulas and bar charts',
      'slide presentations and introductory video trimming',
    ],
    visualKind: 'apps',
  },
  {
    id: 'gr-4-pat',
    phase: 'intermediate',
    grade: 'Grade 4',
    strand: 'PAT & Formal Assessment',
    summary: 'Term 1–4 PAT phases (Intersection Robot / Traffic Light LED project) plus Term 1 & 3 tests and Term 2 & 4 exams.',
    topics: [
      'Term 1–4 Practical Assessment Task (Intersection Robot / Traffic Light LED)',
      'circuit wiring diagram + timing flowchart',
      'Term 1 & 3 theory tests and Term 2 & 4 examinations',
    ],
    visualKind: 'robotics',
    practicalTask:
      'Design, wire, and program a 3-LED Traffic Light Intersection Robot (Red 4s -> Green 4s -> Amber 1.5s) using an ESP32/microcontroller.',
  },

  // Grade 5
  {
    id: 'gr-5-algorithms',
    phase: 'intermediate',
    grade: 'Grade 5',
    strand: 'Algorithms & Coding',
    summary: 'If then else, variable show/hide, Set x/y, Random, Repeat until, Broadcasting, Wait block, and multi-character games/animations.',
    topics: [
      'If-then-else branching logic',
      'variable show/hide, Set x/y, and Random number generators',
      'Repeat-until loops, Broadcasting, and Wait blocks',
      'multi-character interactive games and animations',
    ],
    visualKind: 'coding',
  },
  {
    id: 'gr-5-robotics',
    phase: 'intermediate',
    grade: 'Grade 5',
    strand: 'Robotics Skills',
    summary: 'Digital inputs (buttons, keypads/keyboards), multiple LEDs/buzzers, multi-input sequences, DC motor on/off and direction control, and 2- to 3-pulley systems.',
    topics: [
      'digital inputs: push buttons and keypads',
      'coordinating multiple LEDs, buzzers, and multi-input sequences',
      'DC motor on/off and H-bridge direction control',
      '2-pulley and 3-pulley mechanical advantage systems',
    ],
    visualKind: 'robotics',
  },
  {
    id: 'gr-5-internet',
    phase: 'intermediate',
    grade: 'Grade 5',
    strand: 'Internet & E-Communications',
    summary: 'Responsible internet use, online crimes (piracy, plagiarism, copyright, identity theft), web browser UI and image search, and digital citizenship.',
    topics: [
      'responsible internet use and digital citizenship',
      'identifying online crimes: piracy, plagiarism, copyright infringement, identity theft',
      'web browser UI navigation and safe image attribution search',
    ],
    visualKind: 'network',
  },
  {
    id: 'gr-5-apps',
    phase: 'intermediate',
    grade: 'Grade 5',
    strand: 'Application Skills',
    summary: 'Bulleted/numbered lists and flow diagrams, CAD tools (Round, Curve, Trim, Offset), spreadsheet multiplication/division/Autosum/pie charts, slide animations/video, and video titles/transitions/sound.',
    topics: [
      'bulleted/numbered lists and structured flow diagrams',
      'CAD modification tools: Round, Curve, Trim, and Offset',
      'spreadsheet multiplication, division, AUTOSUM, and pie charts',
      'slide transitions and video editing with titles and audio',
    ],
    visualKind: 'apps',
  },
  {
    id: 'gr-5-pat',
    phase: 'intermediate',
    grade: 'Grade 5',
    strand: 'PAT & Formal Assessment',
    summary: 'Term 1–4 PAT phases (DC motor frame robot / Tower Crane project) plus Term 1 & 3 tests and Term 2 & 4 exams.',
    topics: [
      'Term 1–4 PAT: DC Motor Frame Robot / Tower Crane with pulley hoist',
      'push-button direction control (raise / lower load)',
      'Term 1 & 3 tests and Term 2 & 4 examinations',
    ],
    visualKind: 'robotics',
  },

  // Grade 6
  {
    id: 'gr-6-algorithms',
    phase: 'intermediate',
    grade: 'Grade 6',
    strand: 'Algorithms & Coding',
    summary: 'If then / If then else, AND/OR operators, nested if statements, nested repeat loops, lists (add, insert, delete, lookup, length, item retrieval), and timer sensing.',
    topics: [
      'compound boolean logic using AND / OR operators',
      'nested If statements and nested Repeat loops',
      'lists/arrays: add, insert, delete, lookup, length, and item retrieval',
      'timer sensing and reaction-time games',
    ],
    visualKind: 'coding',
    codeOrFormula: 'if temp > 28 and light_level < 300:\n    activate_cooling_fan()',
  },
  {
    id: 'gr-6-robotics',
    phase: 'intermediate',
    grade: 'Grade 6',
    strand: 'Robotics Skills',
    summary: 'Thermal, light (LDR), humidity, and motion sensors; variable- and sensor-driven DC motor speed; and structures with 2 gears and 2 linkages.',
    topics: [
      'analog & digital sensors: thermal, light (LDR), humidity, and PIR motion',
      'PWM variable-speed and sensor-driven DC motor control',
      'mechanical structures combining 2 gears and 2 linkages',
    ],
    visualKind: 'robotics',
  },
  {
    id: 'gr-6-internet',
    phase: 'intermediate',
    grade: 'Grade 6',
    strand: 'Internet & E-Communications',
    summary: 'Internet of Things (IoT) connections (wired, wireless, Bluetooth, Wi-Fi), IoT data generation, cloud computing, and IoT-enabled automation.',
    topics: [
      'IoT connectivity protocols: wired, Bluetooth, and Wi-Fi',
      'sensor telemetry data generation and logging',
      'cloud computing concepts vs local edge automation',
    ],
    visualKind: 'network',
  },
  {
    id: 'gr-6-apps',
    phase: 'intermediate',
    grade: 'Grade 6',
    strand: 'Application Skills',
    summary: 'Tables, column widths, cell shading, and line spacing; 3D CAD (Extrude, 3D Round, 3D Cut, 3D Revolve); spreadsheet SUM/AVERAGE/MAX/MIN/ROUND/filtering/line charts; and presentations with flowcharts/charts/video.',
    topics: [
      'formatted tables, column widths, cell shading, and line spacing',
      '3D CAD modelling: Extrude, 3D Round, 3D Cut, and 3D Revolve',
      'spreadsheet SUM, AVERAGE, MAX, MIN, ROUND, filtering, and line charts',
      'multimedia presentations integrating flowcharts, charts, and video',
    ],
    visualKind: 'apps',
  },
  {
    id: 'gr-6-pat',
    phase: 'intermediate',
    grade: 'Grade 6',
    strand: 'PAT & Formal Assessment',
    summary: 'Term 1–4 PAT phases (Aquaponics or Smart Home sensor robot project) plus Term 1 & 3 tests and Term 2 & 4 exams.',
    topics: [
      'Term 1–4 PAT: Automated Aquaponics or Smart Home sensor controller',
      'multi-sensor thresholds driving pump/fan/LED actuators',
      'Term 1 & 3 tests and Term 2 & 4 examinations',
    ],
    visualKind: 'robotics',
  },

  // ==========================================================
  // 3. FET PHASE (GRADES 10–12): PHYSICAL SCIENCES
  // ==========================================================
  // Grade 10
  {
    id: 'gr-10-matter',
    phase: 'fet',
    grade: 'Grade 10',
    strand: 'Matter & Materials',
    summary: 'Matter classification, pure substances and mixtures, names/formulae, conductors/semiconductors/insulators, magnetic materials, states of matter and KMT, atomic structure/isotopes/electron configuration, periodic table, chemical bonding, and particles.',
    topics: [
      'classification of matter: pure substances vs mixtures and chemical formulae',
      'electrical conductors, semiconductors, insulators, and magnetic materials',
      'states of matter & Kinetic Molecular Theory (KMT)',
      'atomic structure, isotopes, Aufbau electron configuration, periodic table trends, and bonding',
    ],
    visualKind: 'chemistry',
    codeOrFormula: 'Na (2,8,1) + Cl (2,8,7) -> Na⁺ + Cl⁻  (Ionic Crystal Lattice)',
  },
  {
    id: 'gr-10-chem-change',
    phase: 'fet',
    grade: 'Grade 10',
    strand: 'Chemical Change',
    summary: 'Physical vs. chemical change, conservation of atoms/mass, constant composition, balanced equations, aqueous solutions/ions/electrolytes/precipitation/reaction types, and mole/stoichiometry calculations.',
    topics: [
      'physical vs chemical change and conservation of mass/atoms',
      'writing and balancing chemical equations',
      'aqueous solutions, electrolytes, precipitation, and reaction types',
      'the mole concept (n = m / M) and basic stoichiometry',
    ],
    visualKind: 'chemistry',
    codeOrFormula: 'n = m / M   |   2H₂(g) + O₂(g) -> 2H₂O(l)',
  },
  {
    id: 'gr-10-chem-sys',
    phase: 'fet',
    grade: 'Grade 10',
    strand: 'Chemical Systems',
    summary: 'The hydrosphere—composition, interaction with global systems, water quality, and environmental/community impact.',
    topics: [
      'composition of the hydrosphere and the water cycle',
      'interactions between hydrosphere, lithosphere, atmosphere, and biosphere',
      'water quality testing, eutrophication, and community dam impacts',
    ],
    visualKind: 'chemistry',
  },
  {
    id: 'gr-10-mechanics',
    phase: 'fet',
    grade: 'Grade 10',
    strand: 'Mechanics',
    summary: 'Vectors and scalars, 1D motion (position, displacement, velocity, acceleration, graphs, equations of motion), and gravitational potential, kinetic, and mechanical energy conservation.',
    topics: [
      'vectors vs scalars and 1D reference frames',
      'position, displacement, average/instantaneous velocity, and acceleration',
      'motion graphs (x-t, v-t, a-t) and kinematics equations',
      'conservation of mechanical energy (Ep + Ek = constant)',
    ],
    visualKind: 'mechanics',
    codeOrFormula: 'vf = vi + aΔt   |   Δx = viΔt + ½aΔt²   |   Em = mgh + ½mv²',
  },
  {
    id: 'gr-10-waves',
    phase: 'fet',
    grade: 'Grade 10',
    strand: 'Waves, Sound & Light',
    summary: 'Transverse pulses and superposition, transverse and longitudinal waves, sound waves/pitch/loudness/ultrasound, EM radiation and photon energy, and disaster-related wave legends/science.',
    topics: [
      'transverse pulses, constructive/destructive superposition',
      'transverse & longitudinal wave properties (v = fλ)',
      'sound pitch, loudness, echoes, and medical ultrasound',
      'electromagnetic spectrum, photon energy (E = hf), and tsunami wave science',
    ],
    visualKind: 'waves',
    codeOrFormula: 'v = f · λ   |   E = h · f = (h · c) / λ',
  },
  {
    id: 'gr-10-electricity',
    phase: 'fet',
    grade: 'Grade 10',
    strand: 'Electricity & Magnetism',
    summary: 'Permanent magnets and Earth\'s magnetic field, electrostatics (charge conservation, quantization, polarization), and electric circuits (emf, pd, current, resistance, series/parallel resistors).',
    topics: [
      'magnetic poles, field lines, and Earth\'s magnetic field',
      'electrostatics: charge conservation, quantization (Q = nqe), polarization',
      'electric circuits: emf, potential difference, current (I = Q/Δt), and resistance',
      'series and parallel resistor networks',
    ],
    visualKind: 'circuit',
    codeOrFormula: 'Rs = R₁ + R₂   |   1/Rp = 1/R₁ + 1/R₂   |   I = Q / Δt',
  },

  // Grade 11
  {
    id: 'gr-11-matter',
    phase: 'fet',
    grade: 'Grade 11',
    strand: 'Matter & Materials',
    summary: 'Molecular structure (Lewis diagrams, VSEPR shapes, electronegativity/polarity, bond energy and length), intermolecular forces and water\'s unique properties, and ideal gases/gas laws.',
    topics: [
      'Lewis dot diagrams and VSEPR molecular geometry',
      'electronegativity differences, polar covalent bonds, and bond energy/length',
      'intermolecular forces (London, dipole-dipole, hydrogen bonding) & water properties',
      'ideal gas equation (pV = nRT) and Boyle\'s / Charles\' / Gay-Lussac\'s laws',
    ],
    visualKind: 'chemistry',
    codeOrFormula: 'pV = nRT   |   (p₁V₁)/T₁ = (p₂V₂)/T₂',
  },
  {
    id: 'gr-11-chem-change',
    phase: 'fet',
    grade: 'Grade 11',
    strand: 'Chemical Change',
    summary: 'Stoichiometry (molar volume, concentration, limiting reagents, gas volumes), energy and chemical change (bond energy, exothermic/endothermic, activation energy), and acid-base/redox reactions and oxidation numbers.',
    topics: [
      'quantitative stoichiometry: molar volume (22.4 dm³), concentration, limiting reagents',
      'enthalpy changes (ΔH), activation energy, and reaction coordinate profiles',
      'Brønsted-Lowry acid-base reactions and conjugate pairs',
      'oxidation numbers and balancing redox half-reactions',
    ],
    visualKind: 'chemistry',
  },
  {
    id: 'gr-11-chem-sys',
    phase: 'fet',
    grade: 'Grade 11',
    strand: 'Chemical Systems',
    summary: 'The lithosphere—mining and energy resources.',
    topics: [
      'crustal composition and South African mineral wealth (gold, iron, platinum, coal)',
      'extraction processes: froth flotation, reduction, and refining',
      'environmental and socio-economic impacts of mining & energy resources',
    ],
    visualKind: 'chemistry',
  },
  {
    id: 'gr-11-mechanics',
    phase: 'fet',
    grade: 'Grade 11',
    strand: 'Mechanics',
    summary: '2D vectors (resultants and components), Newton\'s first, second, and third laws, force/free-body diagrams, and Newton\'s law of universal gravitation.',
    topics: [
      '2D vector resolution (Rx, Ry) and vector addition',
      'free-body diagrams on horizontal and inclined planes',
      'Newton\'s 1st, 2nd (Fnet = ma), and 3rd laws of motion',
      'Newton\'s Law of Universal Gravitation (F = Gm₁m₂ / r²)',
    ],
    visualKind: 'mechanics',
    codeOrFormula: 'Fnet = m · a   |   Fg = G · (m₁ · m₂) / r²',
  },
  {
    id: 'gr-11-waves',
    phase: 'fet',
    grade: 'Grade 11',
    strand: 'Waves, Sound & Light',
    summary: 'Geometrical optics (refraction, refractive index, Snell\'s law, critical angles, total internal reflection, optical fibres) and 2D/3D wavefronts and diffraction.',
    topics: [
      'refraction of light and optical density (n = c / v)',
      'Snell\'s Law (n₁ sinθ₁ = n₂ sinθ₂)',
      'critical angle, total internal reflection, and fibre-optic communication',
      'Huygens\' principle, 2D/3D wavefronts, and single-slit diffraction',
    ],
    visualKind: 'waves',
    codeOrFormula: 'n₁ · sin(θ₁) = n₂ · sin(θ₂)   |   sin(θc) = n₂ / n₁',
  },
  {
    id: 'gr-11-electricity',
    phase: 'fet',
    grade: 'Grade 11',
    strand: 'Electricity & Magnetism',
    summary: 'Electrostatics (Coulomb\'s law, electric fields), electromagnetism (current-carrying conductors, Faraday\'s law), and electric circuit energy and power.',
    topics: [
      'Coulomb\'s Law (F = kQ₁Q₂ / r²) and electric field strength (E = F / q)',
      'magnetic fields around current-carrying conductors & solenoids',
      'Faraday\'s Law of Electromagnetic Induction (ε = -N ΔΦ/Δt)',
      'Ohm\'s Law (V = IR), electrical power (P = VI), and electricity cost calculations',
    ],
    visualKind: 'circuit',
    codeOrFormula: 'V = I · R   |   P = V · I = I²R = V²/R',
  },

  // Grade 12
  {
    id: 'gr-12-matter',
    phase: 'fet',
    grade: 'Grade 12',
    strand: 'Matter & Materials',
    summary: 'Optical phenomena and properties of materials (photoelectric effect, emission/absorption spectra), organic chemistry (functional groups, isomers, naming, reactions), and organic macromolecules (plastics and polymers).',
    topics: [
      'photoelectric effect (hf = W₀ + Ek_max) and atomic line spectra',
      'organic functional groups, IUPAC nomenclature, and structural isomers',
      'organic reactions: combustion, substitution, addition, elimination, esterification',
      'organic macromolecules: addition and condensation polymers',
    ],
    visualKind: 'chemistry',
    codeOrFormula: 'E = W₀ + ½m·v_max²   |   h·f₀ = W₀',
  },
  {
    id: 'gr-12-chem-change',
    phase: 'fet',
    grade: 'Grade 12',
    strand: 'Chemical Change',
    summary: 'Reaction rates, chemical equilibrium, acids and bases (titrations, pH, salt hydrolysis), and electrochemical reactions (galvanic and electrolytic cells).',
    topics: [
      'collision theory and factors affecting reaction rate',
      'chemical equilibrium, Le Chatelier\'s principle, and Kc calculations',
      'acid-base titrations, Ka/Kb, pH = -log[H₃O⁺], and salt hydrolysis',
      'galvanic vs electrolytic cells, standard electrode potentials (E°cell)',
    ],
    visualKind: 'chemistry',
    codeOrFormula: 'E°cell = E°cathode - E°anode   |   pH = -log₁₀[H₃O⁺]',
  },
  {
    id: 'gr-12-chem-sys',
    phase: 'fet',
    grade: 'Grade 12',
    strand: 'Chemical Systems',
    summary: 'The chemical industry, focusing on the fertilizer industry.',
    topics: [
      'N-P-K primary plant nutrients and soil chemistry',
      'Haber process (NH₃), Ostwald process (HNO₃), and Contact process (H₂SO₄)',
      'industrial production of ammonium nitrate and ammonium sulphate fertilizers',
      'eutrophication and sustainable fertilizer management',
    ],
    visualKind: 'chemistry',
  },
  {
    id: 'gr-12-mechanics',
    phase: 'fet',
    grade: 'Grade 12',
    strand: 'Mechanics',
    summary: 'Momentum, impulse, and collisions; vertical projectile motion in 1D; and work, energy, and power.',
    topics: [
      'linear momentum (p = mv), impulse (FnetΔt = Δp), and elastic/inelastic collisions',
      'vertical projectile motion in 1D under constant gravitational acceleration (g = 9.8 m/s²)',
      'work-energy theorem (Wnet = ΔEk), conservative vs non-conservative forces, and power (P = Fv)',
    ],
    visualKind: 'mechanics',
    codeOrFormula: 'Σp_i = Σp_f   |   W_net = ΔE_k   |   P_avg = W / Δt',
  },
  {
    id: 'gr-12-waves',
    phase: 'fet',
    grade: 'Grade 12',
    strand: 'Waves, Sound & Light',
    summary: 'The Doppler effect for sound, ultrasound, and light (red shift).',
    topics: [
      'Doppler effect equation for moving source or listener',
      'medical applications: Doppler ultrasound blood-flow measurement',
      'light red shift and evidence for an expanding universe',
    ],
    visualKind: 'waves',
    codeOrFormula: 'f_L = ((v ± v_L) / (v ± v_S)) · f_S',
  },
  {
    id: 'gr-12-electricity',
    phase: 'fet',
    grade: 'Grade 12',
    strand: 'Electricity & Magnetism',
    summary: 'Electric circuits (internal resistance and series-parallel networks) and electrodynamics (generators, motors, alternating current).',
    topics: [
      'emf, terminal potential difference, and internal resistance (ε = I(R + r))',
      'complex series-parallel circuit analysis with lost volts',
      'AC vs DC generators and electric motors (Fleming\'s rules)',
      'alternating current RMS voltage, current, and average power',
    ],
    visualKind: 'circuit',
    codeOrFormula: 'ε = I(R + r)   |   V_rms = V_max / √2   |   P_avg = V_rms · I_rms',
  },
  {
    id: 'gr-12-practical',
    phase: 'fet',
    grade: 'Grade 12',
    strand: 'Practical Investigation Skills',
    summary: 'Core practical investigation skills across physics and chemistry.',
    topics: [
      'formulating investigative hypotheses and identifying independent/dependent/controlled variables',
      'experimental error analysis, uncertainty, and significant figures',
      'graph plotting, gradient calculation, and linearisation of data',
      'scientific report writing for Chemistry titrations and Physics internal resistance labs',
    ],
    visualKind: 'mechanics',
  },
];

export const CURRICULUM_MODULES: CurriculumModule[] = RAW_MODULES.map(buildModule);

export const ALL_GRADES_BY_PHASE: Record<PhaseId, string[]> = {
  foundation: ['Grade R', 'Grade 1', 'Grade 2', 'Grade 3'],
  intermediate: ['Grade 4', 'Grade 5', 'Grade 6'],
  fet: ['Grade 10', 'Grade 11', 'Grade 12'],
};
