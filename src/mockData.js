// ============================================================
// DATA RIIL TRANSJAKARTA (MOCK DATA UPDATE)
// ============================================================

// HALAMAN 1: Beranda (Tujuan: Kota dari Monas)
export const initialRoutes = [
	{
		id: "1",
		koridor: "1",
		rute: "Blok M - Kota",
		etaBase: 4, // Tiba di Monas 4 menit lagi
		status: "Sedang",
		firstHalteDeparture: "11:00", // Logika: Bus berangkat dari Blok M 30 menit lalu
	},
	{
		id: "2",
		koridor: "1",
		rute: "Blok M - Kota",
		etaBase: 11, // Headway riil 7 menit
		status: "Kosong",
		firstHalteDeparture: "11:07",
	},
];

// HALAMAN 2: Rencana Perjalanan (Harmoni ke Ancol via transit)
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
		exitStation: "Kampung Melayu", // Turun untuk transit ke Koridor 5
		koridor: "5C",
		rute: "Harmoni - PGC 1",
		durationBase: 38, // Waktu tempuh riil Harmoni - Kp Melayu
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
		durationBase: 45, // Waktu tempuh riil Kp Melayu - Ancol
		dist: "11.5 km",
		baseDeparture: "12:35",
		status: "Kosong",
	},
];

// HALAMAN 3: Detail Halte (Kedatangan Live di Halte Harmoni)
export const halteArrivals = [
	{
		id: "h1",
		koridor: "1",
		rute: "Kota",
		plat: "B 7001 SGA",
		tipe: "Bus Gandeng Scania", // Tipe armada nyata
		etaBase: 2,
		jarakBase: 0.8,
		status: "Sedang",
	},
	{
		id: "h2",
		koridor: "3", // Melewati Harmoni
		rute: "Kalideres",
		plat: "B 7455 TGB",
		tipe: "Bus Maxi Hino",
		etaBase: 6,
		jarakBase: 2.5,
		status: "Kosong",
	},
	{
		id: "h3",
		koridor: "8", // Melewati Harmoni
		rute: "Lebak Bulus",
		plat: "B 7022 SGA",
		tipe: "Bus Gandeng Volvo",
		etaBase: 14,
		jarakBase: 4.8,
		status: "Kosong",
	},
];

// HALAMAN 3: Info Layanan BRT di Halte Harmoni (Warna asli Transjakarta)
export const halteLayanan = [
	{ koridor: "1", rute: "Blok M - Kota", bg: "#D0021B" }, // Merah
	{ koridor: "2", rute: "Pulogadung - Monas", bg: "#00529B" }, // Biru
	{ koridor: "3", rute: "Kalideres - Monas", bg: "#F5A623" }, // Kuning
	{ koridor: "8", rute: "Lebak Bulus - Pasar Baru", bg: "#D1106A" }, // Magenta
];

// HALAMAN 4: Telemetri Detail Bus Spesifik (Perjalanan Koridor 1)
export const detailBusData = {
	koridor: "1",
	rute: "Kota",
	plat: "B 7001 SGA",
	tipe: "Bus Gandeng Scania",
	jarakBase: 0.8,
	status: "Sedang",
	fixedRecommendation: "11:15",
	speed: "35 km/h", // Kecepatan aman di jalur khusus
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
