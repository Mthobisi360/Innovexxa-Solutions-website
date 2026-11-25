export type LanguageKey = 'english' | 'siswati' | 'isizulu' | 'sepedi' | 'xitsonga';

export const LANGUAGE_LABELS: Record<LanguageKey, string> = {
  english: 'English',
  siswati: 'siSwati',
  isizulu: 'isiZulu',
  sepedi: 'Sepedi',
  xitsonga: 'Xitsonga',
};

export interface CodingLesson {
  id: string;
  title: string;
  gradeTag: string;
  description: string;
  starterCode: string;
  simulatedOutput: (code: string) => string[];
  innovabotExplanations: Record<LanguageKey, string>;
  sentenceStarter: {
    subjectOptions: string[];
    conditionOptions: string[];
    actionOptions: string[];
    targetFeedback: string;
  };
}

export const CODING_LESSONS: CodingLesson[] = [
  {
    id: 'esp32-traffic-led',
    title: '01. Traffic Light LED Sequencer (GPIO Output)',
    gradeTag: 'Grade 4–6 · ESP32 MicroPython',
    description:
      'Control Red, Amber, and Green LEDs on an ESP32 mobile lab board using digital output pins and timed loops.',
    starterCode: `from machine import Pin
import time

red = Pin(12, Pin.OUT)
amber = Pin(14, Pin.OUT)
green = Pin(27, Pin.OUT)

for cycle in range(2):
    green.on()
    print("GO: Green LED ON (3s)")
    time.sleep(1)
    green.off()
    amber.on()
    print("WAIT: Amber LED ON (1s)")
    time.sleep(1)
    amber.off()
    red.on()
    print("STOP: Red LED ON (3s)")
    time.sleep(1)
    red.off()`,
    simulatedOutput: (code: string) => {
      const hasLoop = code.includes('for ') || code.includes('while ');
      const hasPin = code.includes('Pin(');
      if (!hasPin) {
        return [
          '>>> MicroPython ESP32 REPL v1.23',
          'NameError: Pin hardware interface not configured. Import machine.Pin first.',
        ];
      }
      const lines = [
        '>>> MicroPython ESP32 REPL v1.23 (Offline Mobile Pod)',
        '>>> Flashing main.py to GPIO 12, 14, 27...',
        'Cycle 1: GO -> Green LED ON (GPIO 27 = HIGH)',
        'Cycle 1: WAIT -> Amber LED ON (GPIO 14 = HIGH)',
        'Cycle 1: STOP -> Red LED ON (GPIO 12 = HIGH)',
      ];
      if (hasLoop) {
        lines.push('Cycle 2: GO -> Green LED ON (GPIO 27 = HIGH)');
        lines.push('Cycle 2: Sequence completed cleanly with 0 errors.');
      }
      return lines;
    },
    innovabotExplanations: {
      english:
        'Each Pin(number, Pin.OUT) maps directly to a physical pin on the ESP32 breadboard. Calling .on() sets 3.3V HIGH so current flows through the 220 Ω resistor and lights the LED.',
      siswati:
        'Pin(inamba, Pin.OUT) ikhomba inamba ye-GPIO ebhodini le-ESP32. Uma sibita .on(), sigcwalisa 3.3V bese i-LED iyakhanya nge-loop ye-for.',
      isizulu:
        'I-Pin(inombolo, Pin.OUT) ikhomba indawo ye-GPIO ebhodini le-ESP32. Uma sisebenzisa .on(), ugesi ongu-3.3V uhamba ukhanyise i-LED ngokulandelana kwe-loop.',
      sepedi:
        'Pin(nomoro, Pin.OUT) e supa phini ya ESP32 mo bredibotong. Ge re bitša .on(), mohlagase wa 3.3V o tšhumela LED ka tatelano ya for-loop.',
      xitsonga:
        'Pin(nomboro, Pin.OUT) yi komba phini ya ESP32. Loko hi vitana .on(), gezi ya 3.3V yi khulukela eka LED yi yi voningisa hi ndzandzelelano.',
    },
    sentenceStarter: {
      subjectOptions: ['When the for-loop runs', 'When GPIO pin 27 is set HIGH', 'When time.sleep completes'],
      conditionOptions: ['current flows through the 220 Ω resistor', 'the ESP32 updates the output pin', 'the active state transitions'],
      actionOptions: ['and illuminates the target LED safely.', 'to cycle from Green to Amber and Red.', 'before resetting the pin voltage to 0V.'],
      targetFeedback: 'Clear scientific causality: trigger -> physical circuit mechanism -> observable output.',
    },
  },
  {
    id: 'esp32-ldr-smart-lamp',
    title: '02. Smart Solar Streetlamp (LDR Analog Sensor)',
    gradeTag: 'Grade 6–10 · IoT & Sensors',
    description:
      'Read ambient light levels with an ADC pin and switch a classroom solar lamp automatically when dusk arrives.',
    starterCode: `from machine import ADC, Pin

ldr = ADC(Pin(34))
lamp = Pin(2, Pin.OUT)

readings = [820, 510, 240]
for lux in readings:
    if lux < 350:
        lamp.on()
        print("Dusk detected:", lux, "-> Lamp ON")
    else:
        lamp.off()
        print("Daylight:", lux, "-> Lamp OFF")`,
    simulatedOutput: (code: string) => {
      const hasIf = code.includes('if ');
      if (!hasIf) {
        return ['>>> ESP32 ADC Monitor: Warning — no conditional threshold check found.'];
      }
      return [
        '>>> ESP32 ADC1 Channel 6 (GPIO 34) Ready',
        'Daylight: 820 -> Lamp OFF (0 mA)',
        'Daylight: 510 -> Lamp OFF (0 mA)',
        'Dusk detected: 240 -> Lamp ON (GPIO 2 = HIGH)',
        '>>> Autonomous solar conservation loop active.',
      ];
    },
    innovabotExplanations: {
      english:
        'An Analog-to-Digital Converter (ADC) turns continuous voltage from the Light Dependent Resistor (LDR) into a number. Our if/else threshold decides automatically when night begins.',
      siswati:
        'I-ADC igucula emandla agezi lasuka ku-LDR abe linani. Umtsetfo we-if/else uncuma ngekutsi kukhanya kungaphansi kwa-350 kute kukhanyiswe lilambu.',
      isizulu:
        'I-ADC iguqula ugesi osuka ku-LDR ube inombolo. Umthetho we-if/else unquma ngokuzenzakalelayo uma ukukhanya kwehla ngaphansi kuka-350.',
      sepedi:
        'ADC e fetola maatla a mohlagase go tšwa go LDR go ba palo. Molao wa if/else o kgetha ge seetša se le ka fase ga 350 go tšhuma lebone.',
      xitsonga:
        'ADC yi cinca matimba ya gezi ku suka eka LDR ma va nhlayo. Nawu wa if/else wu languta loko ku voninga ku ri ehansi ka 350 ku lumeka rivoni.',
    },
    sentenceStarter: {
      subjectOptions: ['When ambient light drops', 'As the LDR resistance rises', 'If the ADC reading falls below 350'],
      conditionOptions: ['the conditional statement evaluates to True', 'the microcontroller triggers GPIO 2', 'the voltage divider signal shifts'],
      actionOptions: ['and switches the solar streetlamp ON.', 'conserving battery energy during daylight.', 'without needing manual human switching.'],
      targetFeedback: 'Strong IoT reasoning linking sensor transduction to automated actuation.',
    },
  },
  {
    id: 'esp32-ohms-logger',
    title: '03. Ohm’s Law Telemetry Logger (FET Physics + Code)',
    gradeTag: 'Grade 10–12 · Physical Sciences Bridge',
    description:
      'Compute circuit current (I = V / R) and electrical power (P = V × I) across load resistors for Grade 10–12 practicals.',
    starterCode: `voltage = 9.0  # Volts
resistors = [30, 60, 120]  # Ohms

for r in resistors:
    current = voltage / r
    power = voltage * current
    print(f"R={r} ohm -> I={current:.3f} A | P={power:.2f} W")`,
    simulatedOutput: () => [
      '>>> Innovexa Physics Telemetry Console',
      'R=30 ohm -> I=0.300 A | P=2.70 W',
      'R=60 ohm -> I=0.150 A | P=1.35 W',
      'R=120 ohm -> I=0.075 A | P=0.68 W',
      '>>> Inverse proportionality verified: doubling R halves I.',
    ],
    innovabotExplanations: {
      english:
        'Notice how doubling resistance from 30 Ω to 60 Ω cuts the current exactly in half (0.300 A to 0.150 A) while voltage stays constant at 9.0 V.',
      siswati:
        'Bona kutsi kuphindzaphindza i-resistance kusuka ku-30 Ω kuya ku-60 Ω kunciphisa i-current ngesigamu (0.300 A kuya ku-0.150 A) ngaphandle kwekushintja i-voltage.',
      isizulu:
        'Bheka ukuthi ukuphindaphinda i-resistance kusuka ku-30 Ω kuya ku-60 Ω kwehlisa i-current ngesigamu (0.300 A kuya ku-0.150 A) uma i-voltage ihlala ingu-9.0 V.',
      sepedi:
        'Lemoga gore ge re atiša resistance go tšwa go 30 Ω go ya go 60 Ω, current e fokotšega ka seripa (0.300 A go ya go 0.150 A) ge voltage e dula e le 9.0 V.',
      xitsonga:
        'Vona leswaku loko hi andzisa resistance ku suka eka 30 Ω ku ya eka 60 Ω, current yi hunguteka hi hafu (0.300 A ku ya eka 0.150 A) loko voltage yi tshama yi ri 9.0 V.',
    },
    sentenceStarter: {
      subjectOptions: ['When potential difference remains constant', 'As circuit resistance doubles', 'In an ohmic conductor at constant temperature'],
      conditionOptions: ['electric current is inversely proportional to resistance', 'power dissipation decreases proportionally', 'charge flow rate drops by half'],
      actionOptions: ['confirming V = I × R across all trials.', 'matching the plotted V-I straight-line gradient.', 'preventing excessive thermal heating in the resistor.'],
      targetFeedback: 'Exam-ready Grade 11/12 CAPS phrasing for Ohm’s Law.',
    },
  },
];

export interface MediaCaption {
  atSeconds: number;
  english: string;
  translations: Record<Exclude<LanguageKey, 'english'>, string>;
}

export interface ClassroomTrack {
  id: string;
  title: string;
  gradeAndSubject: string;
  durationSeconds: number;
  baseFreqs: number[];
  waveform: OscillatorType;
  captions: MediaCaption[];
}

export const CLASSROOM_TRACKS: ClassroomTrack[] = [
  {
    id: 'track-ohms-law',
    title: 'Ohm’s Law & Potential Difference Walkthrough',
    gradeAndSubject: 'Grade 10–11 Physical Sciences · Audio Lesson',
    durationSeconds: 32,
    baseFreqs: [261.63, 329.63, 392.0, 523.25],
    waveform: 'triangle',
    captions: [
      {
        atSeconds: 0,
        english: 'Welcome to the mobile science pod. Today we measure how voltage pushes charge through a resistor.',
        translations: {
          siswati: 'Siyakwemukela kulabhu yesayensi. Lamuhla silinganisa kutsi i-voltage iqhuba njani emashaja.',
          isizulu: 'Siyakwamukela kulabhu yesayensi. Namuhla silinganisa ukuthi i-voltage isunduza kanjani ishaja.',
          sepedi: 'Re a le amogela ka lapeng la saense. Lehono re ela ka moo voltage e kgorometšago tšhatšhe ka gona.',
          xitsonga: 'Mi amukeriwile eka labu ya sayense. Namuntlha hi pima ndlela leyi voltage yi susumetaka tshaji ha yona.',
        },
      },
      {
        atSeconds: 8,
        english: 'At constant temperature, current I is directly proportional to potential difference V.',
        translations: {
          siswati: 'Ekushiseni lokungashintji, i-current I ihambisana ngco ne-potential difference V.',
          isizulu: 'Ezingeni lokushisa elingashintshi, i-current I ihambisana ngqo ne-potential difference V.',
          sepedi: 'Mo thempereitšheng ye e sa fetogego, current I e sepela thwii le potential difference V.',
          xitsonga: 'Eka mahiselo lama nga cinciki, current I yi fambelana hi ku kongoma na potential difference V.',
        },
      },
      {
        atSeconds: 16,
        english: 'Doubling resistance R halves the current—observe the glowing filament dim gently.',
        translations: {
          siswati: 'Kuphindzaphindza i-resistance R kunciphisa i-current ngesigamu.',
          isizulu: 'Ukuphindaphinda i-resistance R kwehlisa i-current ngesigamu.',
          sepedi: 'Go atiša resistance R gabedi go fokotša current ka seripa.',
          xitsonga: 'Ku andzisa resistance R kambirhi swi hunguta current hi hafu.',
        },
      },
      {
        atSeconds: 24,
        english: 'Record three V and I pairs in your notebook and calculate the gradient R = ΔV / ΔI.',
        translations: {
          siswati: 'Bhala emabhanga lamatsatfu e-V ne-I ebhukwini lakho bese ubala R = ΔV / ΔI.',
          isizulu: 'Bhala izibalo ezintathu ze-V ne-I encwadini yakho bese ubala u-R = ΔV / ΔI.',
          sepedi: 'Ngwala dipara tše tharo tša V le I ka pukwaneng ya gago gomme o bale R = ΔV / ΔI.',
          xitsonga: 'Tsala swivumbeko swinharhu swa V na I ebukwini ya wena kutani u hlayela R = ΔV / ΔI.',
        },
      },
    ],
  },
  {
    id: 'track-traffic-robot',
    title: 'Intersection Traffic Light Logic (PAT Guide)',
    gradeAndSubject: 'Grade 4 Coding & Robotics · Audio Lesson',
    durationSeconds: 32,
    baseFreqs: [293.66, 369.99, 440.0, 587.33],
    waveform: 'sine',
    captions: [
      {
        atSeconds: 0,
        english: 'In Grade 4 PAT, your microcontroller acts as the brain of a road intersection.',
        translations: {
          siswati: 'Ku-PAT yeLibanga 4, i-microcontroller yakho isebenta njengengcondvo yemgwaqo.',
          isizulu: 'Ku-PAT yeBanga 4, i-microcontroller yakho isebenza njengobuchopho bempambanamgwaqo.',
          sepedi: 'Go PAT ya Kreiti ya 4, microcontroller ya gago e šoma bjalo ka bjoko bja marakanelo a tsela.',
          xitsonga: 'Eka PAT ya Giredi 4, microcontroller ya wena yi tirha tanihi byongo bya mahlangano ya pato.',
        },
      },
      {
        atSeconds: 8,
        english: 'Connect Green, Amber, and Red LEDs through protective 220-ohm resistors to ground.',
        translations: {
          siswati: 'Xhuma ema-LED lahlaza, laphuzi nalabovu ngema-resistor a-220 ohm.',
          isizulu: 'Xhuma ama-LED aluhlaza, aphuzi nabomvu ngama-resistor angu-220 ohm.',
          sepedi: 'Kgomaretša di-LED tše tala, tša serolwane le tše khubedu ka di-resistor tša 220 ohm.',
          xitsonga: 'Hlanganisa ti-LED ta rihlaza, xitshopana ni tshuka hi tirhesista ta 220 ohm.',
        },
      },
      {
        atSeconds: 16,
        english: 'Sequence your loop carefully: Green on first, then Amber warning, then Red stop.',
        translations: {
          siswati: 'Hlela i-loop yakho kahle: Luhlaza kucala, kulandzele luphuzi, bese kuba lubovu.',
          isizulu: 'Hlela i-loop yakho kahle: Oluhlaza kuqala, kulandele ophuzi, bese kuba obomvu.',
          sepedi: 'Rulaganya loop ya gago gabotse: Tala pele, gwa latela serolwane, gwa latela khubedu.',
          xitsonga: 'Lulamisa loop ya wena kahle: Rihlaza ku sungula, ku landzela xitshopana, kutani tshuka.',
        },
      },
      {
        atSeconds: 24,
        english: 'Test each transition on the breadboard and verify timing with a stopwatch.',
        translations: {
          siswati: 'Hlola lushintjo ngalunye ebhodini bese uhlola sikhatsi ngesitophuwashi.',
          isizulu: 'Hlola ushintsho ngalunye ebhodini bese uhlola isikhathi ngesitophuwashi.',
          sepedi: 'Leka phetogo ye nngwe le ye nngwe mo bredibotong gomme o lebelele nako.',
          xitsonga: 'Ringeta ku cinca kunwana ni kunwana eka breadboard u pima nkarhi.',
        },
      },
    ],
  },
  {
    id: 'track-galvanic-cell',
    title: 'Galvanic Cells & Spontaneous Redox',
    gradeAndSubject: 'Grade 12 Physical Sciences · Audio Lesson',
    durationSeconds: 32,
    baseFreqs: [220.0, 277.18, 329.63, 440.0],
    waveform: 'triangle',
    captions: [
      {
        atSeconds: 0,
        english: 'A galvanic cell converts chemical potential energy directly into electrical energy.',
        translations: {
          siswati: 'I-galvanic cell igucula emandla emakhemikhali ibe ngemandla agezi.',
          isizulu: 'I-galvanic cell iguqula amandla amakhemikhali abe amandla kagesi.',
          sepedi: 'Sele ya galvanic e fetola maatla a khemikhale go ba maatla a mohlagase.',
          xitsonga: 'Sele ya galvanic yi cinca matimba ya tikhemikhali ku va matimba ya gezi.',
        },
      },
      {
        atSeconds: 8,
        english: 'Oxidation always happens at the anode, where electrons are released into the external wire.',
        translations: {
          siswati: 'I-oxidation yenteka njalo e-anode, lapho ema-electron aphuma khona.',
          isizulu: 'I-oxidation yenzeka njalo ku-anode, lapho ama-electron ephuma khona.',
          sepedi: 'Oxidation e direga ka mehla go anode, moo dielektrone di tšwago gona.',
          xitsonga: 'Oxidation yi humelela nkarhi hinkwawo eka anode, laha tielektroni ti humaka kona.',
        },
      },
      {
        atSeconds: 16,
        english: 'Reduction occurs at the cathode, while the salt bridge maintains electrical neutrality.',
        translations: {
          siswati: 'I-reduction yenteka e-cathode, kantsi i-salt bridge igcina kulingana kwemashaja.',
          isizulu: 'I-reduction yenzeka ku-cathode, kanti i-salt bridge igcina ukulingana kwamashaja.',
          sepedi: 'Reduction e direga go cathode, mola salt bridge e boloka tekano ya mohlagase.',
          xitsonga: 'Reduction yi endleka eka cathode, kasi salt bridge yi hlayisa ku ringana ka tshaji.',
        },
      },
      {
        atSeconds: 24,
        english: 'Calculate E°cell = E°cathode − E°anode; a positive value confirms a spontaneous reaction.',
        translations: {
          siswati: 'Bala E°cell = E°cathode − E°anode; linani lelihle likhomba kutsi kuyatentekela.',
          isizulu: 'Bala u-E°cell = E°cathode − E°anode; inani elihle liqinisekisa ukuthi kuyazenzakalela.',
          sepedi: 'Bala E°cell = E°cathode − E°anode; palo ya positive e netefatša phetogo ye e itiragalelago.',
          xitsonga: 'Hlayela E°cell = E°cathode − E°anode; nhlayo ya positive yi tiyisisa leswaku swi tiendlekela.',
        },
      },
    ],
  },
  {
    id: 'track-smart-aquaponics',
    title: 'IoT Sensors & Smart Aquaponics Loop',
    gradeAndSubject: 'Grade 6 Coding & Robotics · Audio Lesson',
    durationSeconds: 32,
    baseFreqs: [349.23, 440.0, 523.25, 659.25],
    waveform: 'sine',
    captions: [
      {
        atSeconds: 0,
        english: 'Smart aquaponics combines thermal, moisture, and light sensors with automated water pumps.',
        translations: {
          siswati: 'I-aquaponics lehlakaniphile ihlanganisa ema-sensor ekushisa, emanti nekukhanya.',
          isizulu: 'I-aquaponics ehlakaniphile ihlanganisa izinzwa zokushisa, umswakama nokukhanya.',
          sepedi: 'Aquaponics ye bohlale e kopanya disensara tša borutho, monola le seetša.',
          xitsonga: 'Aquaponics yo tlhariha yi hlanganisa tisensa ta ku hisa, ndzhongo ni ku voninga.',
        },
      },
      {
        atSeconds: 8,
        english: 'Sensors send continuous readings into lists so your code can compute a rolling average.',
        translations: {
          siswati: 'Ema-sensor atfumela emanani eluhleni kute likhodi yakho ibale i-average.',
          isizulu: 'Izinzwa zithumela izibalo ohlwini ukuze ikhodi yakho ibale i-average.',
          sepedi: 'Disensara di romela dipalo mo lenaneong gore khoutu ya gago e bale palogare.',
          xitsonga: 'Tisensa ti rhumela tinhlayo eka nxaxamelo leswaku khodi ya wena yi hlayela avhareji.',
        },
      },
      {
        atSeconds: 16,
        english: 'Compound AND/OR conditions keep plant roots oxygenated without flooding the grow bed.',
        translations: {
          siswati: 'Imibandzela ye-AND/OR igcina timphandze titfola umoya kahle.',
          isizulu: 'Imibandela ye-AND/OR igcina izimpande zithola umoya kahle.',
          sepedi: 'Mabaka a AND/OR a boloka medu ya dimela e na le okosejene gabotse.',
          xitsonga: 'Swipimelo swa AND/OR swi hlayisa timitsu ta swimilana ti ri ni moya lowunene.',
        },
      },
      {
        atSeconds: 24,
        english: 'Local edge control guarantees crops stay healthy even when school Wi-Fi is offline.',
        translations: {
          siswati: 'Kulawula kwasekhaya kugcina titjalo tiphilile noma ngabe i-Wi-Fi ayikho.',
          isizulu: 'Ukulawula kwendawo kugcine izitshalo ziphilile noma i-Wi-Fi ingaxhunyiwe.',
          sepedi: 'Taolo ya mo gae e boloka dibjalo di phetše gabotse le ge Wi-Fi e se gona.',
          xitsonga: 'Vulawuri bya laha kaya byi hlayisa swimilana swi hanyile hambi Wi-Fi yi nga ri kona.',
        },
      },
    ],
  },
];
