// DATA MOCK TRANSJAKARTA

// PAGE 1: BERANDA
export const initialRoutes = [
	{
		id: "1",
		koridor: "1",
		rute: "Blok M - Kota",
		etaBase: 40,
		status: "Sedang",
		firstHalteDeparture: "11:00",
	},
	{
		id: "2",
		koridor: "1",
		rute: "Blok M - Kota",
		etaBase: 50,
		status: "Kosong",
		firstHalteDeparture: "11:07",
	},
];

// PAGE 2: RENCANA PERJALANAN
export const journeySteps = [
	{
		id: "w1",
		type: "walk",
		label: "Berjalan Ke Halte Harmoni",
		sub: "(120 m)",
	},
	{
		id: "b1",
		type: "bus",
		startStation: "Harmoni",
		exitStation: "Kampung Melayu",
		koridor: "5C",
		rute: "Harmoni - PGC 1",
		durationBase: 38,
		dist: "8.2 km",
		baseDeparture: "11:45",
		status: "Sedang",
	},
	{
		id: "w2",
		type: "walk",
		label: "Transit di Halte Kampung Melayu",
		sub: "(Jalur Transfer Dalam Halte)",
	},
	{
		id: "b2",
		type: "bus",
		startStation: "Kampung Melayu",
		exitStation: "Ancol",
		koridor: "5",
		rute: "Kampung Melayu - Ancol",
		durationBase: 45,
		dist: "11.5 km",
		baseDeparture: "12:35",
		status: "Kosong",
	},
];

// PAGE 3: DETAIL HALTE
export const halteArrivals = [
	{
		id: "h1",
		koridor: "1",
		rute: "Kota",
		plat: "TJ-307",
		tipe: "Bus Gandeng Scania",
		etaBase: 2,
		jarakBase: 0.8,
		status: "Sedang",
	},
	{
		id: "h2",
		koridor: "3",
		rute: "Kalideres",
		plat: "DMR-250158",
		tipe: "Bus Maxi Hino",
		etaBase: 6,
		jarakBase: 2.5,
		status: "Kosong",
	},
	{
		id: "h3",
		koridor: "8",
		rute: "Lebak Bulus",
		plat: "SAF-035",
		tipe: "Bus Gandeng Volvo",
		etaBase: 14,
		jarakBase: 4.8,
		status: "Kosong",
	},
];

// PAGE 3: INFO BRT
export const halteLayanan = [
	{ koridor: "1", rute: "Blok M - Kota", bg: "#D0021B" },
	{ koridor: "2", rute: "Pulogadung - Monas", bg: "#00529B" },
	{ koridor: "3", rute: "Kalideres - Monas", bg: "#F5A623" },
	{ koridor: "8", rute: "Lebak Bulus - Pasar Baru", bg: "#D1106A" },
];

// PAGE 4: TELEMETRI BUS
export const detailBusData = {
	koridor: "1",
	rute: "Kota",
	plat: "TJ-307",
	tipe: "Bus Gandeng Scania",
	jarakBase: 0.8,
	status: "Sedang",
	fixedRecommendation: "11:15",
	speed: "35 km/h",
	temp: "22°C",
	stops: [
		{ name: "Blok M", passed: true, time: "11:00" },
		{ name: "Bundaran Senayan", passed: true, time: "11:12" },
		{ name: "Karet Sudirman", passed: true, time: "11:21" },
		{ name: "Monas", passed: false, time: "11:28", isCurrent: true },
		{ name: "Harmoni", passed: false, time: "11:34" },
		{ name: "Kota", passed: false, time: "11:45" },
	],
};
