export interface ParsedCsv {
  name: string;  // Name of sheet
  headerRow: string[]; // Array of header names
  contentRows: string[][]; // Two dimensional array of content
}
