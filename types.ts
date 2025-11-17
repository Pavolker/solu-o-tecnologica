export interface TechnologyCategory {
  title: string;
  content: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface SearchResult {
  categories: TechnologyCategory[];
  sources: GroundingChunk[];
  megatrends: string;
  futureVision: string;
}