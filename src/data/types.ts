export type NodeType = 'holding' | 'brand';

export interface HoldingNode {
  id: string;
  type: 'holding';
  name: string;
  country: string;
  description: string;
  tags?: string[];
  seo_slug: string;
}

export interface BrandNode {
  id: string;
  type: 'brand';
  parentId?: string;
  name: string;
  origin: string;
  segment: string;
  history: string;
  factories_pl?: string[];
  founded_year?: number;
  business_structure?: string;
  acquisition_history?: string;
  product_range?: string;
  product_categories?: string[];
  seo_slug: string;
  monetization?: {
    ceneo?: string;
    media_expert?: string;
    rtv_euro?: string;
  };
}

export type GraphNodeData = HoldingNode | BrandNode;

export interface EdgeData {
  id: string;
  source: string;
  target: string;
  label: string;
}

export interface GraphDataset {
  lastUpdate: string;
  nodes: GraphNodeData[];
  edges: EdgeData[];
}
