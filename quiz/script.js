// ===== LONGUARD — WHAT KIND OF FIGHTER ARE YOU? =====
// Flow: attract (press start) -> title menu -> chapter card -> brief
//       -> 9 questions -> email gate -> fighter unlocked (full profile).
//
// Scoring is normalized per archetype: not every fighter has an answer in every
// question — Sleeper is absent from the snack and shirt-fit questions, and
// Cornerwoman from the hand-wrap and shirt-fit ones — so they get fewer chances
// to score. Comparing raw totals would bias against them, so each archetype
// scores as a share of its own maximum.

const MISSION_BRIEF = "You're in the middle of fight camp, training for your next big fight. It's another normal day of training.";

const QUESTIONS = [
  {
    bridge: "Alarm goes off. Camp doesn't care how you slept.",
    text: "You're about to head to training. Who're you inviting?",
    options: [
      { label: "The whole group", type: "joker" },
      { label: "One training partner I trust", type: "stoic" },
      { label: "Nobody, don't need anyone to push myself", type: "slasher" },
      { label: "Just me, I prefer to train alone", type: "sleeper" },
      { label: "Whoever wants to come, I'm going either way", type: "cornerwoman" },
    ],
  },
  {
    bridge: "First stop, the kitchen.",
    text: "What's your go-to pre-training snack?",
    options: [
      { label: "Fruits & protein shake", type: "slasher" },
      { label: "Whatever I can find", type: "joker" },
      { label: "Nothing", type: "stoic" },
      { label: "Yogurt and overnight oats", type: "cornerwoman" },
    ],
  },
  {
    bridge: "You get to the gym. Time to wrap up.",
    text: "How do you wrap your hands?",
    options: [
      { label: "Right hand first, always", type: "slasher" },
      { label: "Left hand first, always", type: "stoic" },
      { label: "Doesn't matter, whatever I feel like", type: "joker" },
      { label: "\"You use hand wraps?\"", type: "sleeper" },
    ],
  },
  {
    bridge: "You pull your gloves out of the bag.",
    text: "What color gloves are you rocking?",
    options: [
      { label: "Red", type: "slasher" },
      { label: "Gold", type: "joker" },
      { label: "White", type: "stoic" },
      { label: "Black", type: "sleeper" },
      { label: "Blue", type: "cornerwoman" },
    ],
  },
  {
    bridge: "Headphones in. Warm-up starts.",
    text: "What's your training playlist like?",
    options: [
      { label: "Hip-hop or trap", type: "slasher" },
      { label: "Classical", type: "stoic" },
      { label: "K-pop", type: "joker" },
      { label: "Silence, no music", type: "sleeper" },
      { label: "Other", type: "cornerwoman" },
    ],
  },
  {
    bridge: "Halfway through, it happens.",
    text: "When a setback happens, you:",
    options: [
      { label: "Get back up immediately and keep going, no time to dwell on it", type: "slasher" },
      { label: "Take a step back to analyze what went wrong first", type: "stoic" },
      { label: "Get frustrated for a second, then move on to something else entirely", type: "joker" },
      { label: "Laugh it off, it wasn't that deep anyway", type: "sleeper" },
      { label: "Say nothing, fix it quietly, and never bring it up again", type: "cornerwoman" },
    ],
  },
  {
    bridge: "You peel your shirt off. Soaked through.",
    text: "How do you like your training shirts to fit?",
    isDataQuestion: true, // also saved as its own raw field: fit_preference
    options: [
      { label: "Tight upper body, looser at the waist", type: "slasher" },
      { label: "True compression, like 2nd skin", type: "stoic" },
      { label: "Oversized", type: "joker" },
    ],
  },
  {
    bridge: "Sparring rounds. Coach is watching.",
    text: "In the ring, what's your style?",
    options: [
      { label: "Clinch and knees, overwhelm them, nonstop aggression, wear them down", type: "slasher" },
      { label: "Heavy hands, tank your opponent's shots", type: "stoic" },
      { label: "Kicks, the flashier the better", type: "joker" },
      { label: "Technical counter fighter, precise and accurate strikes with timing", type: "sleeper" },
      { label: "Control their hands and find the timing for sharp elbows", type: "cornerwoman" },
    ],
  },
  {
    bridge: "Session's done. Tomorrow's open.",
    text: "How do you spend your rest days?",
    options: [
      { label: "Ice bath & sauna", type: "stoic" },
      { label: "\"What's a rest day?\"", type: "slasher" },
      { label: "Spend time with friends and family", type: "joker" },
      { label: "Sleep the whole day", type: "sleeper" },
      { label: "Light jog and stretching", type: "cornerwoman" },
    ],
  },
];

// Matchups are named relationships between specific fighters, not a symmetric
// element wheel — who actually sharpens who, and who grates.
//
// Attribute and spectrum numbers are characterisation — a fighter's stat card,
// not measurement. They aren't derived from the answers and shouldn't be
// presented as data about real people.
const RESULTS = {
  slasher: {
    title: "The Slasher",
    style: "Muay Khao",
    cls: "Warrior",
    blurb: "Comes forward and does not stop. Wins by outlasting rather than out-thinking, and genuinely cannot tell the difference between resting and quitting.",
    accent: "#C1272D",
    tag: "Let the results speak.",
    intro: [
      "Gets things done, no matter what it costs. Chooses the hardest path on purpose because easy never felt like enough, and if he's honest, nothing ever quite feels like enough. Gets knocked down constantly and gets up every time.",
      "The engine underneath isn't ambition. Ambition has a finish line. What drives you is closer to a debt you can't pay off — every result buys you about a day of peace before the number resets.",
      "Most people read this as discipline and tell you they wish they had it. What it actually is, most days, is a fear of stopping long enough to find out how you'd feel.",
    ],
    attributes: [
      { label: "Pressure", value: 92 },
      { label: "Durability", value: 88 },
      { label: "Discipline", value: 85 },
      { label: "Instinct", value: 72 },
      { label: "Technique", value: 60 },
    ],
    radarNote: "Weighted hard toward pressure and durability. You win by outlasting, not out-thinking.",
    spectra: [
      { left: "Instinct", right: "Calculation", value: 22 },
      { left: "Aggression", right: "Patience", value: 12 },
      { left: "Solitary", right: "Social", value: 34 },
      { left: "Absorb", right: "Evade", value: 20 },
      { left: "Routine", right: "Improvise", value: 24 },
    ],
    gym: [
      "First in, last out, and you don't think of that as impressive — it's the baseline. Every round is a test you might fail, so you never coast through one.",
      "Coaches love you for about six months. Then they start telling you to go home, and you start hearing it as a challenge.",
    ],
    pressure: [
      "You go forward. Pressure is the one place you feel completely legible to yourself — no ambiguity, no decisions, just work that either gets done or doesn't.",
      "Which is why you keep creating it. A calm week makes you more anxious than a brutal one ever has.",
    ],
    people: [
      "You're the person everyone respects and nobody checks on. You've built a reputation for not needing anything, and it holds — right up until you do need something and realise you never built the muscle to ask.",
    ],
    strengths: [
      { title: "You don't stay down", body: "Getting knocked down isn't a story you tell, it's Tuesday. The gap between a setback and your next attempt is shorter than almost anyone's, and over years that compounds into something people can't catch." },
      { title: "Empathy you actually earned", body: "You've been through enough that you recognise it on someone else's face before they say a word. People bring you hard things because you don't flinch and you don't perform sympathy." },
      { title: "You pick the hard road on purpose", body: "Rarely for credit — you usually don't tell anyone. You do it because the easy version doesn't feel like it counts, and that instinct has taken you places comfort never would have." },
    ],
    weaknesses: [
      { title: "The finish line moves", body: "Every time you hit the mark, the mark relocates. You've probably never had a moment where the work felt like enough, and you've quietly concluded that feeling isn't available to people like you. It is. You've just never stopped long enough to be in the room when it arrives." },
      { title: "Rest reads as theft", body: "A rest day costs you more than a hard one, because you spend the whole day arguing with yourself. The guilt is the real fatigue, not the training." },
      { title: "Burnout arrives all at once", body: "You don't get gradual warnings, because you override them as they come. So it doesn't taper — it drops. Usually right after your best stretch, which is why it always feels like a betrayal." },
    ],
    work: [
      "Define what \"enough\" looks like for one session before you start, then stop there. You'll hate it. Do it anyway — you're practising the skill of finishing, not the skill of working.",
      "Put the rest day in the calendar like it's training. Unplanned rest turns into guilt; planned rest is just part of the block.",
      "Ask one person for something small this month. The muscle only builds by use, and you'll want it built before the week you actually need it.",
    ],
    matchups: {
      pairs: { type: "stoic", note: "The one person whose “that’s enough for today” you’ll actually hear. They pace you without ever making it sound like doubt, and you give them a reason to push past their own limit." },
      clashes: { type: "joker", note: "You think they don’t take any of it seriously. They think you’re so serious you’ve forgotten to have a life. You’re both describing the same gap from opposite sides." },
    },
    fit: "Tight upper body, looser at the waist",
  },

  stoic: {
    title: "The Stoic",
    style: "Muay Mat",
    cls: "Tank",
    blurb: "Takes the shot and keeps walking. Decides once, never revisits it, and carries whatever it costs without ever mentioning it.",
    accent: "#FFFFFF",
    tag: "Nothing gets through.",
    intro: [
      "Analytical to the core, runs the cost-benefit on everything before it happens. Never second-guesses a call once it's made, moves with total confidence. Doesn't talk much, but when he does, the room listens. That confidence is only on the outside.",
      "You're the tank. You take the shot, you keep coming, and the fight ends when the other person runs out of ideas. That works in the ring and it has quietly become how you handle everything else.",
      "People mistake your calm for the absence of feeling. It's the opposite — it's the cost of managing all of it privately, in real time, while looking like nothing's happening.",
    ],
    attributes: [
      { label: "Durability", value: 96 },
      { label: "Discipline", value: 92 },
      { label: "Pressure", value: 86 },
      { label: "Technique", value: 78 },
      { label: "Instinct", value: 55 },
    ],
    radarNote: "The widest base of the roster. Nothing spikes, nothing collapses — you just don't break.",
    spectra: [
      { left: "Instinct", right: "Calculation", value: 88 },
      { left: "Aggression", right: "Patience", value: 68 },
      { left: "Solitary", right: "Social", value: 42 },
      { left: "Absorb", right: "Evade", value: 14 },
      { left: "Routine", right: "Improvise", value: 12 },
    ],
    gym: [
      "You don't waste movement and you don't waste words. You watch a technique twice, run it once in your head, then execute it clean.",
      "Newer people copy you without knowing why. You've never offered to explain, and nobody's quite comfortable enough to ask.",
    ],
    pressure: [
      "You get quieter and more precise. Decisions that freeze other people take you seconds, because you already ran the numbers days ago.",
      "The catch is that you ran them alone, and you'll carry the outcome alone too, whichever way it goes.",
    ],
    people: [
      "You're the one people bring their problems to. It's rare that anyone brings you theirs and then asks about yours.",
      "Partly that's them. Mostly it's that you've made it very hard to — every time someone gets close to the question, you have a better one about them.",
    ],
    strengths: [
      { title: "When you speak, it lands", body: "You don't spend words, so they carry weight nobody else's do. A single sentence from you resets a room that's been arguing for twenty minutes." },
      { title: "You make hard calls without flinching", body: "Not because you're cold — because you did the thinking in advance. By the time it's difficult, you've already been living with the answer." },
      { title: "You don't second-guess", body: "Once it's made, it's made, and you move. Most people burn enormous energy relitigating decisions. You've never paid that tax." },
    ],
    weaknesses: [
      { title: "Nothing actually gets processed", body: "You're managing feeling, not resolving it — and managed feeling doesn't expire. It sits there accruing, and it comes out sideways, usually months later, usually at someone who didn't earn it." },
      { title: "Confidence is a wall, not a floor", body: "Nobody knows when you're struggling because you've made struggling illegible. That's a real skill. It also means help can't find you, even when people would give it gladly." },
      { title: "You give until there's nothing left", body: "You'll cover for everyone and ask no one to cover for you. You call it responsibility. From the outside it looks a lot like refusing to be a person anyone can help." },
    ],
    work: [
      "Tell one person one true thing this week, unprompted, before they ask. Not a crisis — just a real answer to \"how's it going.\"",
      "Learn the difference between \"I've handled it\" and \"I've buried it.\" They feel identical from the inside and they don't age the same way.",
      "Let someone do something for you and don't repay it immediately. Sit in the debt for a week. That discomfort is the whole problem.",
    ],
    matchups: {
      pairs: { type: "slasher", note: "They drag you out of your own head and into the work. You give them a brake they’ll actually respect, which is something almost nobody else manages." },
      clashes: { type: "joker", note: "They want to fill every silence and you have no interest in filling any of them. To them you’re a closed door; to you they’re noise where a decision should be." },
    },
    fit: "True compression, like 2nd skin",
  },

  joker: {
    title: "The Joker",
    style: "Muay Tae",
    cls: "Bard",
    blurb: "Plays to the room and usually wins it. Enormous natural talent, and allergic to the boring work that would make it count.",
    accent: "#D4AF37",
    tag: "Go big or go home.",
    intro: [
      "Naturally charismatic, effortless, his own style. Incredible social skills, always good for a laugh, always has people around him. Underneath it, he's never really found anyone who gets him.",
      "Being liked has never been the hard part for you. Being known is. Those are different currencies and you've only ever been rich in one.",
      "You're generous with energy and stingy with the truth about how you're doing — usually because the room is having a good time and you'd rather not be the one who ends it.",
    ],
    attributes: [
      { label: "Instinct", value: 94 },
      { label: "Technique", value: 76 },
      { label: "Pressure", value: 72 },
      { label: "Durability", value: 58 },
      { label: "Discipline", value: 45 },
    ],
    radarNote: "A spike, not a base. Enormous instinct carrying a thin floor — brilliant on your day, unreliable on the rest.",
    spectra: [
      { left: "Instinct", right: "Calculation", value: 24 },
      { left: "Aggression", right: "Patience", value: 30 },
      { left: "Solitary", right: "Social", value: 92 },
      { left: "Absorb", right: "Evade", value: 78 },
      { left: "Routine", right: "Improvise", value: 88 },
    ],
    gym: [
      "You learn fast and you learn by feel. You'll try the flashy version before the fundamental one, and you'll often land it — which is exactly why your fundamentals lag.",
      "Nobody's ever had to convince you to show up. Convincing you to do the boring block is a different conversation.",
    ],
    pressure: [
      "You get louder and looser. A joke buys you three seconds, and three seconds is usually all you need to find the shot.",
      "It works so reliably that you've never had to build a second strategy. That's fine until you meet pressure a joke can't move.",
    ],
    people: [
      "You're the reason the group exists. You know everyone's name, everyone's situation, who's been quiet lately.",
      "And there's a very specific loneliness in being the most popular person in the room while not being certain that anyone in it actually knows you.",
    ],
    strengths: [
      { title: "Effortless charisma", body: "You change the temperature of a room by walking into it. That isn't a personality trait, it's a capability, and most people will never have it at any price." },
      { title: "Real talent, not just charm", body: "People underestimate the skill because the delivery is so easy. You've been quietly good at things your whole life while everyone was busy enjoying your company." },
      { title: "You bring the energy", body: "Every gym needs the person who makes turning up feel good. Half the people around you are still training because of you, and none of them have told you that." },
    ],
    weaknesses: [
      { title: "Alone is unbearable", body: "It isn't that you hate solitude — it's that you can't hear yourself in it. Without a room reflecting you back you're not sure what's there, and that's frightening enough that you've arranged a life where you never have to check." },
      { title: "The joke arrives before the answer", body: "The reflex that protects you also cancels the conversation you actually needed. You've deflected so smoothly, so often, that people have stopped asking twice." },
      { title: "Consistency is your ceiling", body: "Talent got you this far and it will not get you the next part. The gap between you and the people ahead of you isn't ability — it's the number of unglamorous sessions they've stacked." },
    ],
    work: [
      "Do one boring block a week alone. No music, no audience, no one to perform for. It'll feel pointless. That feeling is the thing you're training.",
      "When someone asks how you are, answer once before you reach for the joke. One sentence. Then joke.",
      "Pick one unsexy fundamental and get genuinely, boringly good at it. You need one piece of evidence that you can do it the slow way.",
    ],
    matchups: {
      pairs: { type: "sleeper", note: "An odd pairing that works, because you’re handling the same thing from opposite ends — they’re alone by choice, you’re surrounded and still lonely. Neither of you has to explain it." },
      clashes: { type: "slasher", note: "They read your lightness as not caring. You read their intensity as someone who forgot to have a life outside the gym. Both of you are half right and neither will say it." },
    },
    fit: "Oversized",
  },

  sleeper: {
    title: "The Sleeper",
    style: "Muay Femur",
    cls: "Assassin",
    blurb: "Waits, reads, and takes the opening you handed him. Trusts almost nobody, and does not mind being underestimated at all.",
    accent: "#4A90D9",
    tag: "Wait for the opening.",
    intro: [
      "Doesn't need anyone's validation, a lone wolf, tunnel-visioned on his own growth. Most people don't notice he's there until it's too late. Been burned before, so trust doesn't come easy or fast.",
      "You're a Muay Femur — the technician. You don't chase the fight, you let it come to you and take it apart on the counter. Underestimated exactly once.",
      "You've built a life that requires nobody's permission, and it genuinely works. It also means the door only opens from the inside, and you're the only one holding a key.",
    ],
    attributes: [
      { label: "Technique", value: 94 },
      { label: "Discipline", value: 80 },
      { label: "Pressure", value: 60 },
      { label: "Instinct", value: 54 },
      { label: "Durability", value: 40 },
    ],
    radarNote: "The most lopsided card on the roster. Technique carries everything and the rest is thin — you don't survive a war, you make sure it never becomes one.",
    spectra: [
      { left: "Instinct", right: "Calculation", value: 74 },
      { left: "Aggression", right: "Patience", value: 88 },
      { left: "Solitary", right: "Social", value: 12 },
      { left: "Absorb", right: "Evade", value: 80 },
      { left: "Routine", right: "Improvise", value: 38 },
    ],
    gym: [
      "You watch first. You'll spend three sessions quietly getting a technique right before you let anyone see you attempt it.",
      "You'd rather be underestimated than corrected in public, and you've organised most of your training life around that preference.",
    ],
    pressure: [
      "You go internal and you get sharper. Timing is your weapon — you wait for the opening other people try to force.",
      "The risk is that waiting is also your default, and some openings close while you're still confirming they're real.",
    ],
    people: [
      "You have a very short list, and being on it means something close to permanent. You don't do maintenance friendships and you don't pretend.",
      "But the vetting period is long, and most people give up before they clear it — which you read as proof they were never serious.",
    ],
    strengths: [
      { title: "Completely self-sufficient", body: "You don't need momentum from anyone. When the group falls off in January you don't notice, because you were never running on their energy." },
      { title: "Dangerous because nobody's watching", body: "Being written off is a tactical advantage and you've learned to use it. By the time people update their opinion of you, it's already too late to matter." },
      { title: "Your trust is real", body: "It takes a long time and then it doesn't waver. The people who have it know exactly what they have, because you've never given it cheaply." },
    ],
    weaknesses: [
      { title: "The vetting outlasts the applicant", body: "The bar isn't high, it's long. Good people who'd have stayed for years leave in month three because nothing you did told them they were getting anywhere. You experience that as confirmation. It's actually just the timer." },
      { title: "Self-sufficiency is also a wall", body: "Needing no one means being known by no one. You've optimised so hard for not being let down that you've made being close to you a full-time job with no feedback." },
      { title: "You get misread constantly", body: "Quiet reads as disinterest, patience reads as passivity. People write you off — and rather than correct them, you let it happen, because being underestimated is comfortable and being seen isn't." },
    ],
    work: [
      "Give someone the benefit of the doubt one step earlier than feels safe. Not blind trust — one step. You have enormous margin for error here and you never spend it.",
      "Say one thing you're working on out loud to one person before it's finished. The point isn't their input, it's proving that being visible mid-process doesn't kill you.",
      "Learn to tell when \"I don't need anyone\" is true and when it's armour. Both happen. They feel exactly the same from inside.",
    ],
    matchups: {
      pairs: { type: "joker", note: "They get past your vetting by ignoring it completely, which is the only method that has ever worked on you. And under the volume they’re carrying the same loneliness you are." },
      clashes: { type: "stoic", note: "Mutual respect, permanent distance. Two people waiting for the other to go first, indefinitely." },
    },
    fit: "Standard athletic fit",
  },
  cornerwoman: {
    title: "The Cornerwoman",
    style: "Muay Sok",
    cls: "Support",
    blurb: "Reads a room before she says anything, and needs nobody's permission for any of it. Cold to most people on purpose — the warmth is real, it's just reserved.",
    accent: "#3FA88C",
    tag: "I don't need saving.",
    intro: [
      "Thoughtful, quiet, and completely self-governing. She listens more than she talks, decides for herself, and has never once needed a man in the gym to tell her what she's capable of — she stopped hearing that particular voice a long time ago.",
      "The distance most people feel from her isn't coldness, it's a filter. She's not managing an image, she's managing who gets access, and she's comfortable being misread by everyone who hasn't earned the other side of it.",
      "The people who do get through find someone soft, funny and fiercely protective — a version of her almost nobody else has met, and one she'd never perform for a room.",
    ],
    attributes: [
      { label: "Discipline", value: 88 },
      { label: "Technique", value: 86 },
      { label: "Instinct", value: 84 },
      { label: "Pressure", value: 70 },
      { label: "Durability", value: 52 },
    ],
    radarNote: "Three tall pillars and one deliberate gap. You settle things with reads and precision long before anything becomes a war of attrition.",
    spectra: [
      { left: "Instinct", right: "Calculation", value: 64 },
      { left: "Aggression", right: "Patience", value: 76 },
      { left: "Solitary", right: "Social", value: 28 },
      { left: "Absorb", right: "Evade", value: 68 },
      { left: "Routine", right: "Improvise", value: 40 },
    ],
    gym: [
      "You train on your own schedule, to your own plan, and you're unbothered by whether anyone rates it. You've been the only woman on the mats often enough that it stopped registering as a thing.",
      "You'll take coaching from someone who's actually watching you and ignore it entirely from someone who's performing. Most people can't tell which one they are; you can, within a round.",
    ],
    pressure: [
      "You go still. Where other people speed up, you slow down and start reading — and by the time you commit, the decision was made three exchanges ago.",
      "The elbow is the honest version of you: nothing telegraphed, nothing wasted, and the exchange is over before anyone realised it had started.",
    ],
    people: [
      "Your circle is small on purpose and permanent by default. Getting in takes time and consistency, not charm — and charm is the fastest way to be moved further out.",
      "The cost is that people decide who you are from the outside and are usually confident about it. You've stopped correcting them, which is efficient, and also how the misread hardens.",
    ],
    strengths: [
      { title: "You actually listen", body: "Not waiting-to-speak listening — the kind where people hear their own thinking back, clearer. It's why the few who know you bring you the things they haven't told anyone else." },
      { title: "Nobody's approval is load-bearing", body: "You built your standards yourself, so they can't be revoked by someone who doesn't rate you. Being underestimated costs you nothing because you were never spending their currency." },
      { title: "You handle it", body: "Whatever it is. You don't outsource your problems or wait for someone to step in, and that self-sufficiency is completely genuine — it just isn't the whole story." },
    ],
    weaknesses: [
      { title: "The filter runs on people who'd have passed", body: "It's calibrated for the ones who look down on you, and it catches good people too. You'll never know which ones, because they don't announce themselves on the way out." },
      { title: "Independence became identity", body: "Not needing anyone started as protection and turned into something you'd defend on principle. There's a difference between not needing help and not being able to accept it, and from the inside they feel identical." },
      { title: "You let the misread stand", body: "Correcting people feels like asking to be understood, which feels like needing something. So you let them be wrong about you — for years — and then quietly resent that nobody knows you." },
    ],
    work: [
      "Say the warm thing out loud once, to someone who's already in. Not a gesture — the sentence. You do the caring quietly and assume it registers; often it doesn't.",
      "Notice when you're filtering for real disrespect versus filtering for anyone who got close too fast. The second one is fear wearing the first one's clothes.",
      "Accept one piece of help this month without immediately balancing the ledger. Let it sit unreturned. That discomfort is the whole exercise.",
    ],
    matchups: {
      pairs: { type: "sleeper", note: "Neither of you mistakes the other's quiet for coldness, and neither needs filling. You give trust on the same slow schedule, so for once nobody's early." },
      clashes: { type: "slasher", note: "He solves everything by pushing harder and will tell you what you can handle. That is the precise thing you stopped listening to, and he'll read your silence as agreement." },
    },
    fit: "True compression, cut to show the figure",
  },
};

const PRIORITY = ["slasher", "stoic", "joker", "sleeper", "cornerwoman"]; // also the tie-break order

const MAX_SCORES = PRIORITY.reduce((acc, type) => {
  acc[type] = QUESTIONS.filter((q) => q.options.some((o) => o.type === type)).length;
  return acc;
}, {});

const TIMING = {
  screenOut: 280,
  hold: 620,
  questionOut: 240,
  chapter: 2100,
  type: 26,
  scanCycle: 130,
  scanTotal: 1700,
  scanLand: 700,
  progress: 850,
};

// ===== State =====
let currentQuestion = 0;
const scores = { slasher: 0, stoic: 0, joker: 0, sleeper: 0, cornerwoman: 0 };
const rawAnswers = [];
let fitPreference = null;
let finalArchetype = null;
let chapterTimer = null;
let typeTimer = null;
let scanTimer = null;
let activeScreen = "attract";

const screens = {
  attract: document.getElementById("screen-attract"),
  title: document.getElementById("screen-title"),
  roster: document.getElementById("screen-roster"),
  briefing: document.getElementById("screen-briefing"),
  chapter: document.getElementById("screen-chapter"),
  brief: document.getElementById("screen-brief"),
  quiz: document.getElementById("screen-quiz"),
  gate: document.getElementById("screen-gate"),
  reveal: document.getElementById("screen-reveal"),
  result: document.getElementById("screen-result"),
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const isTouch = window.matchMedia("(hover: none)").matches;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ===== Backdrop =====
// The attract screen holds a still — key art, the way a title screen opens on a
// single frame. From the menu onward it swaps to the video if one exists.

const heroVideo = document.getElementById("hero-video");
const portrait = window.matchMedia("(max-width: 759px)").matches;

// Image files arrive as .jpg, .jpeg, .png or .webp depending on how they were
// exported, so probe rather than hard-coding one extension. Each candidate is
// loaded off-screen and the first that decodes wins; if none do, the CSS
// gradient carries the screen.
const IMAGE_EXTS = ["jpg", "jpeg", "png", "webp"];

function resolveImage(base, onFound, onMissing) {
  let i = 0;
  const tryNext = () => {
    if (i >= IMAGE_EXTS.length) return onMissing && onMissing();
    const url = `${base}.${IMAGE_EXTS[i++]}`;
    const probe = new Image();
    probe.onload = () => onFound(url);
    probe.onerror = tryNext;
    probe.src = url;
  };
  tryNext();
}

resolveImage(`../assets/hero/${portrait ? "hero-mobile" : "hero-desktop"}`, (url) => {
  document.documentElement.style.setProperty("--hero-img", `url("${url}")`);
});
document.body.classList.add("stage-still");

// The video is only ever seen from the menu onward, and it's a heavy file, so
// nothing is fetched until the visitor presses start. The attract screen stays
// instant and the video streams in while they're reading the menu.
let videoReady = false;
let videoRequested = false;

// Several events can be the one that means "there's a frame to show", and which
// one fires depends on cache state and connection, so react to all of them.
["loadeddata", "canplay", "canplaythrough"].forEach((evt) => {
  heroVideo.addEventListener(evt, () => {
    videoReady = true;
    const busy = document.body.classList.contains("stage-none") || document.body.classList.contains("stage-photo");
    if (activeScreen !== "attract" && !busy) setBackdrop("video");
  });
});

function requestHeroVideo() {
  if (videoRequested || reducedMotion) return;
  videoRequested = true;

  // Only formats that actually ship — listing a .webm we don't have just buys a
  // 404 on every page load before the browser falls through to the mp4.
  const sources = portrait
    ? ["../assets/hero/hero-mobile.mp4", "../assets/hero/hero.mp4"]
    : ["../assets/hero/hero.mp4"];

  sources.forEach((src) => {
    const el = document.createElement("source");
    el.src = src;
    el.type = src.endsWith(".webm") ? "video/webm" : "video/mp4";
    heroVideo.appendChild(el);
  });
  heroVideo.preload = "auto";
  heroVideo.load();
}

// The still stays up on the attract beat; everything after it prefers the video
// and silently keeps the still if there isn't one.
// mode: "still" | "video" | "none" | "photo" — exactly one is ever active.
// "photo" is the cover image held completely still, for the long read.
function setBackdrop(mode) {
  const wantVideo = mode === "video" && videoReady && !reducedMotion;
  const none = mode === "none";
  const photo = mode === "photo";
  document.body.classList.toggle("stage-none", none);
  document.body.classList.toggle("stage-photo", photo);
  document.body.classList.toggle("stage-video", !none && !photo && wantVideo);
  document.body.classList.toggle("stage-still", !none && !photo && !wantVideo);

  // Not gated on .paused: a play() that overlaps a load() rejects with
  // AbortError and leaves the element paused, so it's worth asking every time.
  if (wantVideo) {
    const attempt = heroVideo.play();
    if (attempt && attempt.catch) attempt.catch(() => { /* the still carries it */ });
  }
}

// ===== Screens =====

// Transitions await their exit animation, so two can overlap if something fires
// mid-transition. The token makes the newest call win.
let screenToken = 0;

async function showScreen(name, { animateOut = true } = {}) {
  const token = ++screenToken;
  const current = screens[activeScreen];

  if (current && animateOut && current !== screens[name]) {
    current.classList.add("leaving");
    await wait(TIMING.screenOut);
    current.classList.remove("leaving");
    if (token !== screenToken) return; // a newer transition took over
  }

  Object.values(screens).forEach((s) => s.classList.remove("on", "leaving"));
  screens[name].classList.add("on");
  document.body.classList.toggle("in-mission", name === "quiz" || name === "gate");
  // questions and the gate run on a clean ground so nothing moves while
  // someone is reading and choosing
  const backdrop = name === "attract" ? "still"
    : (name === "quiz" || name === "gate" || name === "reveal") ? "none"
    : name === "result" ? "photo"   // static cover art behind the long read
    : "video";
  setBackdrop(backdrop);
  activeScreen = name;
  window.scrollTo(0, 0);
}

function bloom(color) {
  const el = document.getElementById("bloom");
  el.style.background = `radial-gradient(60% 45% at 30% 55%, ${color}, transparent 72%)`;
  el.classList.remove("fire");
  void el.offsetWidth;
  el.classList.add("fire");
}

function haptic(pattern = 12) {
  if (navigator.vibrate && !reducedMotion) navigator.vibrate(pattern);
}

// ===== Audio =====
// Two independent channels, the way Hound Archives does it: the toggle governs
// the hero video's audio track only. UI sounds are never muted — they're
// feedback, not ambience.
//
// Browsers won't let anything be audible before a gesture, so the video starts
// muted and unmutes on the first interaction. The attract screen is a still, so
// there's deliberately no soundtrack until the menu.

const audio = { music: true, volume: 0.5, ctx: null };

function audioCtx() {
  if (!audio.ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) audio.ctx = new AC();
  }
  if (audio.ctx && audio.ctx.state === "suspended") audio.ctx.resume();
  return audio.ctx;
}

// A short synthesised voice: oscillator -> lowpass -> gain. The filter is what
// keeps these from sounding like beeps — it rounds the attack into a tick.
function tone({ freq = 440, dur = 0.08, type = "triangle", gain = 0.2, slideTo = null, cutoff = 2600, delay = 0 }) {
  if (reducedMotion) return;
  const ctx = audioCtx();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const amp = ctx.createGain();
  const t0 = ctx.currentTime + delay;

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(cutoff, t0);

  amp.gain.setValueAtTime(0.0001, t0);
  amp.gain.exponentialRampToValueAtTime(Math.max(0.0001, gain * audio.volume), t0 + 0.006);
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

  osc.connect(filter).connect(amp).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.03);
}

// The recorded click. Pooled <audio> clones so rapid presses overlap cleanly
// instead of cutting each other off.
const clickPool = [];
let clickIndex = 0;
let clickReady = false;

(function buildClickPool() {
  for (let i = 0; i < 4; i += 1) {
    const a = new Audio("../assets/audio/select.mp3");
    a.preload = "auto";
    a.addEventListener("canplaythrough", () => { clickReady = true; }, { once: true });
    a.addEventListener("error", () => { clickReady = false; }, { once: true });
    clickPool.push(a);
  }
})();

function playClick(vol = 1) {
  if (!clickReady || !clickPool.length) return false;
  const a = clickPool[clickIndex = (clickIndex + 1) % clickPool.length];
  try {
    a.currentTime = 0;
    a.volume = Math.min(1, vol * audio.volume * 2); // UI sits above the music
    const attempt = a.play();
    if (attempt && attempt.catch) attempt.catch(() => {});
    return true;
  } catch (err) {
    return false;
  }
}

const sfx = {
  // cursor moving between items: one dry tick
  move: () => tone({ freq: 880, dur: 0.045, type: "triangle", gain: 0.14, cutoff: 3200 }),

  // PRESS TO START only — the recorded sample, saved for the one moment that
  // opens the game. Everything else is synthesised so it stays distinct.
  start: () => {
    if (playClick(1)) return;
    tone({ freq: 330, dur: 0.12, type: "square", gain: 0.16, cutoff: 2400 });
    tone({ freq: 660, dur: 0.3, type: "sine", gain: 0.14, delay: 0.08 });
  },

  // choosing a main-menu item: a hard, dry console click — square wave clipped
  // short with a low thud under it, no tail
  menu: () => {
    tone({ freq: 1400, dur: 0.028, type: "square", gain: 0.12, cutoff: 5200 });
    tone({ freq: 520, dur: 0.05, type: "square", gain: 0.14, cutoff: 3000, delay: 0.012 });
    tone({ freq: 180, dur: 0.09, type: "sine", gain: 0.16, slideTo: 120, delay: 0.012 });
  },

  // going deeper — begin, submit, advance. Rises.
  forward: () => {
    tone({ freq: 300, dur: 0.1, type: "triangle", gain: 0.16, cutoff: 2800 });
    tone({ freq: 450, dur: 0.14, type: "triangle", gain: 0.14, slideTo: 600, cutoff: 3200, delay: 0.06 });
    tone({ freq: 140, dur: 0.18, type: "sine", gain: 0.14 });
  },

  // coming back out — back, return to menu. The same shape inverted.
  back: () => {
    tone({ freq: 520, dur: 0.09, type: "triangle", gain: 0.14, cutoff: 2800 });
    tone({ freq: 330, dur: 0.16, type: "triangle", gain: 0.13, slideTo: 220, cutoff: 2200, delay: 0.05 });
  },

  // answering a question: lower and blunter
  select: () => {
    tone({ freq: 330, dur: 0.08, type: "triangle", gain: 0.15, cutoff: 2200 });
    tone({ freq: 120, dur: 0.22, type: "sine", gain: 0.18, slideTo: 80 });
  },

  // the reveal: sub drop under a rising shimmer
  reveal: () => {
    tone({ freq: 150, dur: 0.7, type: "sine", gain: 0.24, slideTo: 65 });
    tone({ freq: 440, dur: 0.5, type: "triangle", gain: 0.12, slideTo: 880, cutoff: 4000, delay: 0.1 });
    tone({ freq: 660, dur: 0.6, type: "sine", gain: 0.08, slideTo: 990, cutoff: 5000, delay: 0.18 });
  },

  // the toggle's own voice: rising on, falling off
  musicOn: () => {
    tone({ freq: 392, dur: 0.1, type: "sine", gain: 0.2, cutoff: 2400 });
    tone({ freq: 587, dur: 0.26, type: "sine", gain: 0.16, cutoff: 2800, delay: 0.09 });
  },
  musicOff: () => {
    tone({ freq: 587, dur: 0.1, type: "sine", gain: 0.16, cutoff: 2400 });
    tone({ freq: 330, dur: 0.26, type: "sine", gain: 0.18, cutoff: 2000, delay: 0.09 });
  },
};

const audioBtn = document.getElementById("audio-btn");
const audioRange = document.getElementById("audio-range");
function applyAudio() {
  document.body.classList.toggle("audio-on", audio.music);
  audioBtn.setAttribute("aria-pressed", String(audio.music));
  audioBtn.setAttribute("aria-label", audio.music ? "Mute" : "Unmute");

  heroVideo.muted = !audio.music;
  heroVideo.volume = audio.volume;
}

// The first gesture is what makes any of it audible. Everything is already
// running by then, so this just lifts the mute and wakes the synth.
let audioUnlocked = false;
function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  audioCtx();
  applyAudio();
}
["pointerdown", "keydown", "touchstart"].forEach((evt) =>
  document.addEventListener(evt, unlockAudio, { once: true, capture: true }));

audioBtn.addEventListener("click", (e) => {
  e.stopPropagation(); // the attract screen listens on document
  audio.music = !audio.music;
  applyAudio();
  (audio.music ? sfx.musicOn : sfx.musicOff)();
});

const audioCtl = document.getElementById("audio-ctl");
let dialTimer = null;

function showDial() {
  audioCtl.classList.add("open");
  clearTimeout(dialTimer);
  dialTimer = setTimeout(() => audioCtl.classList.remove("open"), 3200);
}

audioCtl.addEventListener("pointerenter", showDial);
audioCtl.addEventListener("pointerleave", showDial); // restarts the countdown
audioBtn.addEventListener("click", showDial);

audioRange.addEventListener("input", (e) => {
  e.stopPropagation();
  showDial();
  audio.volume = Number(audioRange.value) / 100;
  heroVideo.volume = audio.volume;
});
// step is 25, so every change is a notch — one tick per detent
audioRange.addEventListener("change", () => { showDial(); sfx.move(); });
audioRange.addEventListener("click", (e) => e.stopPropagation());

applyAudio();

// ===== Hard cut =====
// A beat of full black between narrative beats, the way a film cuts rather than
// dissolves. Fires, holds, and the new screen is already up when it lifts.

function hardCut() {
  const el = document.getElementById("cut");
  el.classList.remove("firing");
  void el.offsetWidth;
  el.classList.add("firing");
}

async function cutTo(name) {
  if (reducedMotion) return showScreen(name);
  hardCut();
  await wait(520); // hold until the dissolve reaches full black
  await showScreen(name, { animateOut: false });
}

// ===== Attract =====

document.getElementById("press-start").textContent = isTouch ? "Tap to Start" : "Press to Start";

function leaveAttract() {
  if (activeScreen !== "attract") return;
  haptic();
  sfx.start();
  requestHeroVideo(); // start fetching now; the menu is where it's needed
  showScreen("title");
}

document.addEventListener("click", (e) => {
  if (activeScreen === "attract") { leaveAttract(); e.preventDefault(); }
});

// ===== Art =====

// Same extension probe as the hero: the fighter art can land as .jpg or .png.
function wireArt(frame, archetype) {
  const img = frame.querySelector("img");
  if (!img) return;
  const fail = () => frame.classList.add("placeholder");

  resolveImage(
    `../assets/fighters/${archetype}`,
    (url) => { frame.classList.remove("placeholder"); img.src = url; },
    fail,
  );
}

document.querySelectorAll("#roster .record").forEach((record) => {
  wireArt(record.querySelector(".record-art"), record.dataset.archetype);
  record.addEventListener("click", (e) => {
    e.stopPropagation();
    openRosterCard(record.dataset.archetype);
  });
});

// Clicking a card lifts it and opens a short read alongside — enough to place
// the fighter, not enough to replace finishing the game.
let openCard = null;

function openRosterCard(type) {
  const panel = document.getElementById("roster-panel");
  const r = RESULTS[type];

  if (openCard === type) { closeRosterCard(); return; }
  openCard = type;
  sfx.menu();

  document.querySelectorAll("#roster .record").forEach((rec) =>
    rec.classList.toggle("picked", rec.dataset.archetype === type));

  panel.innerHTML = "";
  panel.dataset.archetype = type;

  const art = el("div", "panel-art");
  const img = document.createElement("img");
  img.alt = `${r.title} illustration`;
  // Same fallback the roster cards get — without it a missing file renders as a
  // broken-image icon with the alt text showing through.
  resolveImage(
    `../assets/fighters/${type}`,
    (url) => { img.src = url; art.classList.remove("placeholder"); },
    () => art.classList.add("placeholder"),
  );
  art.appendChild(img);

  const name = el("h3", "panel-name", r.title);
  name.style.color = r.accent;

  panel.append(
    art,
    name,
    el("p", "panel-meta", `${r.style} · ${r.cls}`),
    el("p", "panel-tag", `“${r.tag}”`),
    el("p", "panel-blurb", r.blurb),
    el("p", "panel-cta", "For the full character breakdown, complete the game."),
  );

  panel.classList.add("open");
}

function closeRosterCard() {
  openCard = null;
  document.getElementById("roster-panel").classList.remove("open");
  document.querySelectorAll("#roster .record").forEach((rec) => rec.classList.remove("picked"));
}

// ===== Title menu =====

const menuItems = [...document.querySelectorAll("#title-menu .menu-item")];
let menuIndex = 0;

function paintMenu() {
  const changed = !menuItems[menuIndex].classList.contains("cursor");
  menuItems.forEach((el, i) => el.classList.toggle("cursor", i === menuIndex));
  if (changed) sfx.move();
}
paintMenu();

menuItems.forEach((el, i) => {
  el.addEventListener("mouseenter", () => { menuIndex = i; paintMenu(); });
});

document.querySelectorAll("[data-action]").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.stopPropagation();
    runAction(el.dataset.action);
  });
});

function runAction(action) {
  haptic();
  // the sound tells you which way you're moving: in, across, or back out
  switch (action) {
    case "start": sfx.menu(); startRun(); break;
    case "briefing": sfx.menu(); showScreen("briefing"); break;
    case "roster": sfx.menu(); showScreen("roster"); break;
    case "back-to-title": sfx.back(); closeRosterCard(); showScreen("title"); break;
    case "begin": sfx.forward(); enterQuestions(); break;
  }
}

// ===== Run start =====

function startRun() {
  currentQuestion = 0;
  Object.keys(scores).forEach((k) => (scores[k] = 0));
  rawAnswers.length = 0;
  fitPreference = null;
  finalArchetype = null;
  PRIORITY.forEach((t) => document.body.classList.remove(`result-${t}`));
  resetRoster();
  setProgress(0, { animate: false });
  playChapterCard();
}

async function playChapterCard() {
  const rule = document.getElementById("chapter-rule");
  rule.style.transition = "none";
  rule.style.width = "0%";

  await showScreen("chapter");

  requestAnimationFrame(() => {
    rule.style.transition = `width ${TIMING.chapter}ms linear`;
    rule.style.width = "100%";
  });

  clearTimeout(chapterTimer);
  chapterTimer = setTimeout(enterBrief, TIMING.chapter);
}

let inBrief = false;

async function enterBrief() {
  if (inBrief) return;
  inBrief = true;
  clearTimeout(chapterTimer);

  const body = document.getElementById("brief-body");
  body.textContent = "";
  body.classList.remove("done");

  await cutTo("brief");
  typeOut(body, MISSION_BRIEF);
  inBrief = false;
}

function typeOut(el, text) {
  clearInterval(typeTimer);
  if (reducedMotion) { el.textContent = text; el.classList.add("done"); return; }
  let i = 0;
  typeTimer = setInterval(() => {
    el.textContent = text.slice(0, (i += 1));
    if (i >= text.length) {
      clearInterval(typeTimer);
      el.classList.add("done");
    }
  }, TIMING.type);
}

// ===== Progress =====

let shownPct = 0;
let pctFrame = null;

function setProgress(answered, { animate = true } = {}) {
  const pct = Math.round((answered / QUESTIONS.length) * 100);
  const fill = document.getElementById("progress-fill");

  if (!animate) fill.style.transition = "none";
  fill.style.width = `${pct}%`;
  if (!animate) requestAnimationFrame(() => { fill.style.transition = ""; });

  if (animate) {
    tweenPercent(shownPct, pct, TIMING.progress);
  } else {
    shownPct = pct;
    document.getElementById("q-pct").textContent = pct;
  }
}

function tweenPercent(from, to, duration) {
  const label = document.getElementById("q-pct");
  const start = performance.now();
  if (pctFrame) cancelAnimationFrame(pctFrame);

  const step = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic, same shape as the bar
    shownPct = Math.round(from + (to - from) * eased);
    label.textContent = shownPct;
    if (t < 1) pctFrame = requestAnimationFrame(step);
  };

  pctFrame = requestAnimationFrame(step);
}

// ===== Questions =====

let optionIndex = 0;

async function enterQuestions() {
  clearInterval(typeTimer);
  await cutTo("quiz");
  renderQuestion();
}

function renderQuestion() {
  const q = QUESTIONS[currentQuestion];
  document.getElementById("q-bridge").textContent = q.bridge || "";
  document.getElementById("q-text").textContent = q.text;

  const wrap = document.getElementById("q-options");
  wrap.className = "options";
  wrap.innerHTML = "";
  optionIndex = 0;

  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerHTML = '<span class="cursor-mark">▸</span>';
    btn.appendChild(document.createTextNode(opt.label));
    btn.addEventListener("mouseenter", () => { optionIndex = i; paintOptions(); });
    btn.addEventListener("click", () => selectAnswer(opt, btn));
    wrap.appendChild(btn);
  });

  paintOptions();
}

function paintOptions() {
  const opts = [...document.querySelectorAll("#q-options .option-btn")];
  const changed = opts[optionIndex] && !opts[optionIndex].classList.contains("cursor");
  opts.forEach((el, i) => el.classList.toggle("cursor", i === optionIndex));
  if (changed) sfx.move();
}

let locked = false;

async function selectAnswer(opt, btn) {
  if (locked) return;
  locked = true;
  haptic(16);
  sfx.select();

  btn.classList.add("selected");
  document.getElementById("q-options").classList.add("resolved");

  scores[opt.type] += 1;
  rawAnswers.push(opt.label);
  if (QUESTIONS[currentQuestion].isDataQuestion) fitPreference = opt.label;

  currentQuestion += 1;
  setProgress(currentQuestion);

  await wait(TIMING.hold);

  if (currentQuestion < QUESTIONS.length) {
    await transitionToNextQuestion();
  } else {
    finalArchetype = calculateResult();
    await showScreen("gate");
  }
  locked = false;
}

async function transitionToNextQuestion() {
  const body = document.getElementById("q-body");
  body.classList.add("leaving");
  await wait(TIMING.questionOut);
  renderQuestion();
  body.classList.remove("leaving");
  void body.offsetWidth;
}

function calculateResult() {
  // An archetype with no answers pointing at it yet (a new fighter added before
  // the questions catch up) has a ceiling of zero. Dividing by that gives NaN,
  // which silently loses every comparison — so skip them explicitly instead.
  const eligible = PRIORITY.filter((type) => MAX_SCORES[type] > 0);
  if (!eligible.length) return PRIORITY[0];

  let best = eligible[0];
  let bestShare = scores[best] / MAX_SCORES[best];

  eligible.forEach((type) => {
    const share = scores[type] / MAX_SCORES[type];
    if (share > bestShare + 1e-9) {
      best = type;
      bestShare = share;
    }
  });

  return best;
}

// ===== Keyboard =====

const isDown = (e) => e.key === "ArrowDown" || e.key === "Down";
const isUp = (e) => e.key === "ArrowUp" || e.key === "Up";

document.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT") return;

  if (activeScreen === "attract") { leaveAttract(); e.preventDefault(); return; }

  if (activeScreen === "title") {
    if (isDown(e)) { menuIndex = (menuIndex + 1) % menuItems.length; paintMenu(); e.preventDefault(); }
    if (isUp(e)) { menuIndex = (menuIndex - 1 + menuItems.length) % menuItems.length; paintMenu(); e.preventDefault(); }
    if (e.key === "Enter") { runAction(menuItems[menuIndex].dataset.action); e.preventDefault(); }
    return;
  }

  if (activeScreen === "quiz") {
    const opts = [...document.querySelectorAll("#q-options .option-btn")];
    if (!opts.length || locked) return;
    if (isDown(e)) { optionIndex = (optionIndex + 1) % opts.length; paintOptions(); e.preventDefault(); }
    if (isUp(e)) { optionIndex = (optionIndex - 1 + opts.length) % opts.length; paintOptions(); e.preventDefault(); }
    if (e.key === "Enter") { opts[optionIndex].click(); e.preventDefault(); }
    if (/^[1-4]$/.test(e.key) && opts[Number(e.key) - 1]) { opts[Number(e.key) - 1].click(); e.preventDefault(); }
    return;
  }

  if (e.key === "Escape" && (activeScreen === "briefing" || activeScreen === "roster")) runAction("back-to-title");
  if (e.key === "Enter" && activeScreen === "brief") runAction("begin");
  if (e.key === "Enter" && activeScreen === "chapter") enterBrief();
});

screens.chapter.addEventListener("click", (e) => { e.stopPropagation(); enterBrief(); });

// ===== Email gate =====

document.getElementById("email-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name-input").value.trim();
  const email = document.getElementById("email-input").value;
  const submitBtn = e.target.querySelector("button");
  submitBtn.disabled = true;
  submitBtn.textContent = "Unlocking...";
  sfx.forward();
  document.activeElement?.blur(); // drop the mobile keyboard

  // Remember locally too. This doesn't stop anyone determined — a new browser or
  // incognito resets it — but it stops the honest case of someone replaying and
  // re-submitting the same address. The server is what actually enforces it.
  try { localStorage.setItem("longuard_fighter", finalArchetype); } catch (err) { /* private mode */ }

  const submission = fetch("/api/submit-quiz", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      email,
      archetype: RESULTS[finalArchetype].title,
      fitPreference,
      answers: rawAnswers,
    }),
  }).catch((err) => {
    // fail silently on the frontend, don't block the user from their result
    console.error("Submission error:", err);
  });

  await revealResult(submission);

  submitBtn.disabled = false;
  submitBtn.textContent = "Unlock my fighter";
});

// ===== Reveal =====

async function revealResult(submission) {
  const r = RESULTS[finalArchetype];
  const bodyEl = document.getElementById("result-body");
  const record = document.getElementById("result-record");

  populateResult(r);
  bodyEl.classList.remove("revealed");

  // the portrait starts sealed — the reveal is what opens it
  record.classList.add("locked");
  record.classList.remove("unlocked");

  await showScreen("reveal");
  const flyer = await runCardReveal(r, submission);

  document.body.classList.add(`result-${finalArchetype}`);
  await showScreen("result", { animateOut: false });

  // the card is already mid-flight, so the profile builds in underneath it
  bodyEl.classList.add("revealed");
  record.classList.remove("locked");
  record.classList.add("unlocked");
  landFlyer(flyer);

  setTimeout(() => {
    document.querySelector(".radar-shape")?.classList.add("drawn");
    document.querySelectorAll(".spectrum-dot").forEach((dot, i) => {
      setTimeout(() => { dot.style.left = `${dot.dataset.value}%`; }, i * 110);
    });
  }, 700);

  unlockRoster(r);
}

// Every sealed card centre stage. A cursor runs across them, slowing as it goes,
// lands on yours, opens it, then the card itself flies to where the profile
// portrait will be — so the two screens share one continuous object.
function runCardReveal(r, submission) {
  const wrap = document.getElementById("reveal-cards");
  const caption = document.getElementById("reveal-caption");
  wrap.innerHTML = "";
  caption.textContent = "Thinking...";
  caption.classList.remove("gone");

  const cards = PRIORITY.map((type) => {
    const card = el("div", "rcard");
    card.dataset.archetype = type;
    const img = document.createElement("img");
    img.alt = "";
    resolveImage(`../assets/fighters/${type}`, (url) => { img.src = url; });
    card.appendChild(img);
    wrap.appendChild(card);
    return card;
  });

  const winner = cards[PRIORITY.indexOf(finalArchetype)];

  if (reducedMotion) {
    winner.classList.add("chosen", "opened");
    return Promise.all([submission, wait(400)]).then(() => winner);
  }

  return new Promise((resolve) => {
    // A slot machine: seven full laps, blurring at the start and dragging by the
    // end. The final tick lands on the matched fighter.
    const order = [];
    for (let lap = 0; lap < 7; lap += 1) order.push(...cards);
    order.push(...cards.slice(0, PRIORITY.indexOf(finalArchetype) + 1));

    let i = 0;
    const step = () => {
      cards.forEach((c) => c.classList.remove("hot"));
      const card = order[i];
      card.classList.add("hot");
      sfx.move();

      i += 1;
      if (i < order.length) {
        // quartic ease-out: 55ms a card at full speed, ~700ms on the last few
        const progress = i / order.length;
        setTimeout(step, 55 + Math.pow(progress, 4) * 650);
        return;
      }

      // landed
      caption.classList.add("gone");
      cards.forEach((c) => { if (c !== winner) c.classList.add("out"); });
      winner.classList.remove("hot");
      winner.classList.add("chosen");
      haptic(30);

      setTimeout(() => {
        winner.classList.add("opened");
        sfx.reveal();
        haptic([18, 60, 30]);
        caption.textContent = r.title;
        caption.classList.remove("gone");
      }, 620);

      // hold on the open card, then hand it to the profile
      Promise.all([submission, wait(2600)]).then(() => resolve(winner));
    };

    setTimeout(step, 400);
  });
}

// FLIP: measure where the profile portrait will sit, then move the revealed card
// there. Same element, one motion, no cut between the two screens.
function landFlyer(card) {
  if (!card) return;
  const target = document.querySelector("#result-record .record-art");
  if (!target) return;

  const from = card.getBoundingClientRect();
  const to = target.getBoundingClientRect();

  card.classList.remove("chosen", "opened");
  card.classList.add("flying");
  card.style.left = `${from.left}px`;
  card.style.top = `${from.top}px`;
  card.style.width = `${from.width}px`;
  card.style.height = `${from.height}px`;
  document.body.appendChild(card);

  requestAnimationFrame(() => {
    const scale = to.width / from.width;
    card.style.transform =
      `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${scale})`;
    card.style.opacity = "0";
  });

  setTimeout(() => card.remove(), 1200);
}

function populateResult(r) {
  const record = document.getElementById("result-record");
  const art = record.querySelector(".record-art");
  const img = document.getElementById("result-avatar-img");
  const video = document.getElementById("result-video");

  record.dataset.archetype = finalArchetype;
  art.classList.remove("placeholder", "has-video");
  art.dataset.glyph = r.title;
  img.alt = `${r.title} illustration`;
  wireArt(art, finalArchetype);

  if (!reducedMotion) {
    video.src = `../assets/fighters/${finalArchetype}.mp4`;
    video.load();
    video.addEventListener("loadeddata", () => {
      art.classList.add("has-video");
      video.play().catch(() => art.classList.remove("has-video"));
    }, { once: true });
  }

  document.getElementById("result-title").textContent = r.title;
  document.getElementById("result-tag").textContent = `“${r.tag}”`;
  document.getElementById("result-element").textContent = `${r.style} · ${r.cls}`;
  document.getElementById("result-fit").textContent = `Your fit — ${r.fit}`;

  renderBio(r);
  renderRadar(r);
  renderSpectra(r);
  renderSplit(r);
  renderSections(r);
  renderMatchups(r);
  stageRevealSequence();
}

// ===== Result rendering =====

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function renderBio(r) {
  const wrap = document.getElementById("result-bio");
  wrap.innerHTML = "";
  wrap.appendChild(el("h3", "kicker reveal-item", "Who you are"));
  r.intro.forEach((p) => wrap.appendChild(el("p", "reveal-item", p)));
}

// Pentagon radar: five axes from the centre, the shape drawn over the grid.
function renderRadar(r) {
  const cx = 100, cy = 100, max = 78;
  const n = r.attributes.length;
  const point = (i, radius) => {
    const angle = -Math.PI / 2 + i * ((2 * Math.PI) / n);
    return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius];
  };
  const poly = (radiusFor) =>
    r.attributes.map((a, i) => point(i, radiusFor(a)).map((v) => v.toFixed(1)).join(",")).join(" ");

  // Wide enough for the longest label ("DURABILITY") at whichever axis it lands
  // on — the box is sized to the type, not the other way round.
  let svg = `<svg viewBox="-72 -30 344 260" role="img" aria-label="${r.title} attribute chart">`;

  [0.25, 0.5, 0.75, 1].forEach((f) => {
    svg += `<polygon class="radar-grid" points="${poly(() => max * f)}"/>`;
  });

  r.attributes.forEach((_, i) => {
    const [x, y] = point(i, max);
    svg += `<line class="radar-axis" x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`;
  });

  svg += `<polygon class="radar-shape" points="${poly((a) => max * (a.value / 100))}"/>`;

  r.attributes.forEach((a, i) => {
    const [x, y] = point(i, max * (a.value / 100));
    svg += `<circle class="radar-dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6"/>`;
  });

  r.attributes.forEach((a, i) => {
    const [x, y] = point(i, max + 17);
    const anchor = Math.abs(x - cx) < 2 ? "middle" : x > cx ? "start" : "end";
    svg += `<text class="radar-label" x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anchor}">${a.label}</text>`;
    svg += `<text class="radar-value" x="${x.toFixed(1)}" y="${(y + 12).toFixed(1)}" text-anchor="${anchor}">${a.value}</text>`;
  });

  svg += "</svg>";

  document.getElementById("radar").innerHTML = svg;
  document.getElementById("radar-note").textContent = r.radarNote;
}

// Where you sit between two poles — the part that tells you something the
// attribute numbers can't.
function renderSpectra(r) {
  const wrap = document.getElementById("spectra");
  wrap.innerHTML = "";

  r.spectra.forEach((s) => {
    const row = el("div", "spectrum");
    const head = el("div", "spectrum-head");
    const left = el("span", s.value < 50 ? "lit" : null, s.left);
    const right = el("span", s.value >= 50 ? "lit" : null, s.right);
    head.append(left, right);

    const track = el("div", "spectrum-track");
    const dot = el("span", "spectrum-dot");
    dot.dataset.value = s.value;
    dot.style.left = "50%"; // animates out to its real position on reveal
    track.appendChild(dot);

    row.append(head, track);
    wrap.appendChild(row);
  });
}

function section(label, build) {
  const node = el("section", "section");
  node.appendChild(el("h3", "kicker reveal-item", label));
  build(node);
  return node;
}

function renderSplit(r) {
  const wrap = document.getElementById("result-split");
  wrap.innerHTML = "";
  wrap.append(
    section("In the gym", (node) => r.gym.forEach((p) => node.appendChild(el("p", "reveal-item", p)))),
    section("Under pressure", (node) => r.pressure.forEach((p) => node.appendChild(el("p", "reveal-item", p)))),
  );
}

function renderSections(r) {
  const wrap = document.getElementById("result-sections");
  wrap.innerHTML = "";

  wrap.appendChild(section("Your people", (node) => {
    r.people.forEach((p) => node.appendChild(el("p", "reveal-item", p)));
  }));

  const traits = (list) => (node) => {
    list.forEach((t) => {
      const item = el("div", "trait reveal-item");
      item.append(el("h4", null, t.title), el("p", null, t.body));
      node.appendChild(item);
    });
  };

  wrap.appendChild(section("Strengths", traits(r.strengths)));
  wrap.appendChild(section("Weaknesses", traits(r.weaknesses)));

  wrap.appendChild(section("What to work on", (node) => {
    const list = el("ul", "work-list");
    r.work.forEach((line) => list.appendChild(el("li", "reveal-item", line)));
    node.appendChild(list);
  }));
}

// Two boxes: who sharpens you, and who grates. Each carries that fighter's card.
function renderMatchups(r) {
  const wrap = document.getElementById("result-matchups");
  wrap.innerHTML = "";

  const card = (label, entry) => {
    const other = RESULTS[entry.type];
    const node = el("div", "matchup reveal-item");

    const art = el("div", "matchup-art");
    const img = document.createElement("img");
    img.alt = "";
    resolveImage(`../assets/fighters/${entry.type}`, (url) => { img.src = url; });
    art.appendChild(img);

    const body = el("div", "matchup-body");
    const name = el("p", "matchup-name", other.title + " \u00b7 " + other.cls);
    name.style.color = other.accent;
    body.append(el("p", "kicker", label), name, el("p", null, entry.note));

    node.append(art, body);
    return node;
  };

  wrap.append(card("Trains best with", r.matchups.pairs));
  wrap.append(card("Clashes with", r.matchups.clashes));
}

function stageRevealSequence() {
  document.getElementById("result-body")
    .querySelectorAll(".reveal-item")
    .forEach((node, i) => { node.style.animationDelay = `${0.3 + Math.min(i, 14) * 0.07}s`; });
}

function unlockRoster(r) {
  const record = document.querySelector(`#roster .record[data-archetype="${finalArchetype}"]`);
  if (!record) return;
  record.classList.remove("locked");
  record.classList.add("unlocked");
  record.querySelector(".record-art").dataset.glyph = r.title;
}

function resetRoster() {
  document.querySelectorAll("#roster .record").forEach((record) => {
    record.classList.add("locked");
    record.classList.remove("unlocked");
  });
}

// ===== Share =====

document.getElementById("share-btn").addEventListener("click", async (e) => {
  e.stopPropagation();
  sfx.menu();
  const r = RESULTS[finalArchetype];
  const shareText = `I'm ${r.title} — ${r.cls}. What's your fighter type? Take the Longuard quiz:`;
  const shareUrl = window.location.href;
  const btn = document.getElementById("share-btn");

  if (navigator.share) {
    try {
      await navigator.share({ title: "What Kind of Fighter Are You?", text: shareText, url: shareUrl });
      return;
    } catch (err) {
      if (err.name === "AbortError") return; // sheet dismissed, not a failure
    }
  }

  try {
    await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    const original = btn.textContent;
    btn.textContent = "Copied to clipboard";
    setTimeout(() => { btn.textContent = original; }, 2000);
  } catch (err) {
    console.error("Clipboard error:", err);
  }
});

// ===== Retake =====

document.getElementById("retake-btn").addEventListener("click", (e) => {
  e.stopPropagation();
  sfx.back();
  PRIORITY.forEach((t) => document.body.classList.remove(`result-${t}`));
  document.body.classList.remove("in-mission");
  document.getElementById("result-body").classList.remove("revealed");
  document.getElementById("email-input").value = "";
  document.getElementById("name-input").value = "";
  showScreen("title");
});

// ===== Boot =====

showScreen("attract", { animateOut: false });
