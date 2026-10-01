export type SentenceContext = 
  | 'Client / Customer Sync' 
  | 'Internal Team Standup' 
  | 'Stakeholder / Executive Update';

export interface ExampleSentence {
  id: string;
  context: SentenceContext;
  sentence: string;
  explanation?: string;
}

export interface PhraseItem {
  id: string;
  phrase: string;
  meaning: string;
  businessTip?: string;
  examples: ExampleSentence[];
  createdAt: string;
}

export interface GenerateRequest {
  phrase: string;
}

export interface GenerateResponse {
  success: boolean;
  item?: PhraseItem;
  error?: string;
}
