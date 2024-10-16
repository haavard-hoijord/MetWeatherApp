import { Harbor } from "./Harbor";

export type TidalWater = {
  name: string;
  lastUpdated: Date;
  values: TidalWaterValue[];
};

export type TidalWaterValue = {
  timeUtc: Date;
  surge: number;
  tide: number;
  total: number;
  p0: number;
  p25: number;
  p50: number;
  p75: number;
  p100: number;
};

export type ChartData = {
  time: number;
  level: number;
};

export type BlockData = {
  id: number;
  enabled: boolean;
  type: "surge" | "tide" | "total";
  value: Harbor | undefined;
  data: ChartData[];
};
