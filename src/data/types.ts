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
