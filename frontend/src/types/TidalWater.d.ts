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
};
