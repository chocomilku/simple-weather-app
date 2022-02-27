export interface owmStruct {
	lat: number;
	lon: number;
	timezone: string;
	timezone_offset: number;
	current: topCurrentData;
	hourly: hourCurrentData[];
	daily: dailyCurrentData[];
}

interface currentData {
	dt: number;
	temp: number | {};
	feels_like: number | {};
	pressure: number;
	humidity: number;
	dew_point: number;
	uvi: number;
	clouds: number;
	visibility: number;
	wind_speed: number;
	wind_deg: number;
	weather: simpleData[];
}

interface simpleData {
	id: number;
	main: string;
	description: string;
	icon: string;
}

interface topCurrentData extends currentData {
	sunrise: number;
	sunset: number;
}

interface dailyCurrentData extends topCurrentData {
	moonrise: number;
	moonset: number;
	moon_phase: number;
	temp: {
		day: number;
		min: number;
		max: number;
		night: number;
		eve: number;
		morn: number;
	};
	feels_like: {
		day: number;
		night: number;
		eve: number;
		morn: number;
	};
	pop: number;
	wind_gust: number;
	rain: number;
}

interface hourCurrentData extends currentData {
	pop: number;
	wind_gust: number;
}
