interface TextItem {
  self_ref: string;
  parent: { $ref: string };
  children: unknown[];
  content_layer: string;
  label: string;
  prov: {
    page_no: number;
    bbox: { l: number; t: number; r: number; b: number; coord_origin: string };
    charspan: number[];
  }[];
  orig: string;
  text: string;
  level?: number;
  enumerated?: boolean;
  marker?: string;
}

interface TableItem {
  self_ref: string;
  parent: { $ref: string };
  children: unknown[];
  content_layer: string;
  label: string;
  prov: unknown[];
  captions: unknown[];
  references: unknown[];
  footnotes: unknown[];
  data: {
    table_cells: unknown[];
    num_rows: number;
    num_cols: number;
    grid: unknown[][];
  };
}

interface PictureItem {
  self_ref: string;
  parent: { $ref: string };
  children: unknown[];
  content_layer: string;
  label: string;
  prov: unknown[];
  captions: unknown[];
  references: unknown[];
  footnotes: unknown[];
  image: {
    mimetype: string;
    dpi: number;
    size: { width: number; height: number };
    uri: string;
  };
}

interface GroupItem {
  self_ref: string;
  parent: { $ref: string };
  children: { $ref: string }[];
  content_layer: string;
  name: string;
  label: string;
}

export interface ReportData {
  schema_name: string;
  version: string;
  name: string;
  origin: {
    mimetype: string;
    binary_hash: number;
    filename: string;
  };
  body: {
    self_ref: string;
    children: { $ref: string }[];
    content_layer: string;
    name: string;
    label: string;
  };
  texts: TextItem[];
  tables: TableItem[];
  pictures: PictureItem[];
  groups: GroupItem[];
}
