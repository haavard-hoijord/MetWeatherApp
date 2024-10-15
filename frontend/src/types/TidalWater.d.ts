import { Harbor } from "./Harbor";

export type TidalWater = {
  name: string;
  lastUpdated: Date;
  values: TidalWaterValue[];
};

export type TidalWaterValue = {
  timeUTC: Date;
  surge: number;
  total: number;
  p0: number;
  p25: number;
  p50: number;
  p75: number;
  p100: number;
};

export type ChartData = {
  time: string;
  level: number;
};

export type BlockData = {
  id: string;
  value: Harbor | undefined;
  data: ChartData[];
};
