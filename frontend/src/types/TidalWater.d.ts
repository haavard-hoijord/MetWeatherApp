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
