export type DictionaryTerm = {
  term: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  definition: string;
};

export const dictionaryTerms: DictionaryTerm[] = [
  {
    term: 'Trust',
    level: 'Beginner',
    definition:
      'Trust is the foundation of every financial interaction in the Atlantis ecosystem.',
  },
  {
    term: 'AFIP',
    level: 'Beginner',
    definition:
      'Asset Financial Interaction Protocol. AFIP helps people, wallets and organizations interact safely with digital assets.',
  },
  {
    term: 'Participant',
    level: 'Beginner',
    definition:
      'Any person, wallet, merchant or organization interacting with AFIP.',
  },
  {
    term: 'Trustline',
    level: 'Beginner',
    definition:
      'A wallet permission that allows a participant to hold a specific digital asset.',
  },
  {
    term: 'Claim',
    level: 'Beginner',
    definition:
      'A safe way to receive an asset after the participant completes onboarding.',
  },
  {
    term: 'Evidence',
    level: 'Beginner',
    definition:
      'A verifiable record proving that an action or interaction happened.',
  },
  {
    term: 'Settlement',
    level: 'Intermediate',
    definition:
      'The final completion of a financial transfer or asset delivery.',
  },
  {
    term: 'Merchant',
    level: 'Beginner',
    definition:
      'A business or service provider that accepts digital settlement assets such as SUSDC.',
  },
  {
    term: 'Onboarding',
    level: 'Beginner',
    definition:
      'The process of helping a participant become ready to receive, hold or use an asset.',
  },
  {
    term: 'Treasury',
    level: 'Intermediate',
    definition:
      'The infrastructure responsible for issuing, holding, allocating and settling assets.',
  },
  {
    term: 'SUSDC',
    level: 'Beginner',
    definition:
      'Atlantis Synthetic USD Coin, a Stellar-based settlement asset used in the Atlantis ecosystem.',
  },
  {
    term: 'Transparency',
    level: 'Beginner',
    definition:
      'The principle that important information should be understandable and verifiable.',
  },
];