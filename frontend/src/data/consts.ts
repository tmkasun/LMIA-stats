export const DRAW_ENDPOINT =
  "https://www.canada.ca/en/immigration-refugees-citizenship/corporate/mandate/policies-operational-instructions-agreements/ministerial-instructions/express-entry-rounds/invitations.html?q=";

export const SUPPORTED_PARAMS = [
  "drawNumber",
  "drawSize",
  "drawCRS",
  "dd1",
  "dd2",
  "dd3",
  "dd4",
  "dd5",
  "dd6",
  "dd7",
  "dd8",
  "dd9",
  "dd10",
  "dd11",
  "dd12",
  "dd13",
  "dd14",
  "dd15",
  "dd16",
  "dd17",
  "dd18",
];

export const PROGRAMS = [
  "Federal Skilled Trades",
  "No Program Specified",
  "Provincial Nominee Program",
  "Federal Skilled Worker",
  "Canadian Experience Class",
];

export interface IRound {
  drawNumber: string;
  drawNumberURL: string;
  drawDate: string;
  drawDateFull: string;
  drawName: string;
  drawSize: number;
  drawCRS: number;
  mitext: string;
  DrawText1: string;
  drawText2: string;
  drawDateTime: string;
  drawCutOff: string;
  drawDistributionAsOn: string;
  dd1: string;
  dd2: string;
  dd3: string;
  dd4: string;
  dd5: string;
  dd6: string;
  dd7: string;
  dd8: string;
  dd9: string;
  dd10: string;
  dd11: string;
  dd12: string;
  dd13: string;
  dd14: string;
  dd15: string;
  dd16: string;
  dd17: string;
  dd18: string;
}
export interface IIRCCData {
  classes: string;
  rounds: IRound[];
}
