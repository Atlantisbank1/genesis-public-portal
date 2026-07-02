export type AcademyLesson = {
  slug: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readingTime: string;
  summary: string;
  content: string[];
};

export const academyLessons: AcademyLesson[] = [
  {
    slug: 'trust',
    title: 'What is Trust?',
    difficulty: 'Beginner',
    readingTime: '3 min',
    summary: 'Trust is the foundation of every financial interaction.',
    content: [
      'Trust is not a feature. Trust is the foundation.',
      'In Genesis and Atlantis, every action should be understandable, verifiable and explainable.',
      'A trusted system does not ask people to blindly believe it. It provides evidence, clarity and consistency.',
    ],
  },
  {
    slug: 'afip',
    title: 'What is AFIP?',
    difficulty: 'Beginner',
    readingTime: '4 min',
    summary: 'AFIP helps people interact safely with digital assets.',
    content: [
      'AFIP means Asset Financial Interaction Protocol.',
      'AFIP allows a financial interaction to begin before every technical requirement is complete.',
      'If a participant is not ready yet, AFIP can prepare the delivery, preserve the evidence and guide the participant through onboarding.',
    ],
  },
  {
    slug: 'trustline',
    title: 'What is a Trustline?',
    difficulty: 'Beginner',
    readingTime: '3 min',
    summary: 'A trustline allows a wallet to hold a specific Stellar asset.',
    content: [
      'A trustline is a permission inside a Stellar wallet.',
      'Without a trustline, the wallet cannot hold a specific issued asset.',
      'AFIP uses this concept to help participants receive assets safely after onboarding.',
    ],
  },
  {
    slug: 'claim',
    title: 'What is a Claim?',
    difficulty: 'Beginner',
    readingTime: '3 min',
    summary: 'A claim is a safe way to receive an asset after onboarding.',
    content: [
      'A claim allows an asset to wait until the participant is ready.',
      'This prevents failed delivery when a wallet does not yet support the asset.',
      'In AFIP, claim-based delivery helps turn a new wallet into an active participant.',
    ],
  },
  {
    slug: 'settlement',
    title: 'What is Settlement?',
    difficulty: 'Intermediate',
    readingTime: '4 min',
    summary: 'Settlement is the final completion of a financial operation.',
    content: [
      'Settlement means that a financial operation is completed.',
      'In digital asset systems, settlement should be visible, traceable and verifiable.',
      'Atlantis uses settlement evidence to strengthen trust between participants.',
    ],
  },
];