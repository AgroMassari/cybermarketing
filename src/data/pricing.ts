export type Currency = "ARS" | "USD" | "EUR" | "COP" | "MXN" | "UYU" | "BRL";

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  ARS: "$",
  USD: "US$",
  EUR: "€",
  COP: "COP$",
  MXN: "MX$",
  UYU: "UYU$",
  BRL: "R$",
};

export type PricingTable = {
  [tierIndex: number]: {
    [key in Currency]?: number;
  };
};

// IDs match exactly the SERVICE_GROUPS id field in App.tsx
export const PRICING_DATA: Record<string, PricingTable> = {

  // ──────────── INSTAGRAM ────────────

  "ig-seg-premium": {
    // 250 / 500 / 1.000 / 2.500 / 5.000 / 10.000 / 20.000
    0: { ARS: 8900,   USD: 6.38,  EUR: 5.51,  BRL: 34.90,  MXN: 130,  UYU: 239,  COP: 28200  },
    1: { ARS: 12300,  USD: 8.81,  EUR: 7.62,  BRL: 48.30,  MXN: 180,  UYU: 331,  COP: 38900  },
    2: { ARS: 22700,  USD: 16.26, EUR: 14.07, BRL: 89.20,  MXN: 332,  UYU: 611,  COP: 71900  },
    3: { ARS: 53500,  USD: 38.34, EUR: 33.16, BRL: 210.20, MXN: 782,  UYU: 1440, COP: 169400 },
    4: { ARS: 98500,  USD: 70.59, EUR: 61.06, BRL: 387.10, MXN: 1440, UYU: 2651, COP: 311900 },
    5: { ARS: 178500, USD: 127.93,EUR: 110.67,BRL: 701.50, MXN: 2610, UYU: 4805, COP: 565200 },
    6: { ARS: 338500, USD: 242.61,EUR: 209.90,BRL: 1330.00,MXN: 4950, UYU: 9113, COP: 1071800},
  },

  "ig-seg-globales": {
    // 500 / 1.000 / 2.500 / 5.000 / 10.000 / 20.000 / 50.000
    0: { ARS: 5900,   USD: 4.22,  EUR: 3.65,  BRL: 23.20,  MXN: 86,   UYU: 159,  COP: 18700  },
    1: { ARS: 11100,  USD: 7.95,  EUR: 6.87,  BRL: 43.60,  MXN: 162,  UYU: 299,  COP: 35100  },
    2: { ARS: 26500,  USD: 18.98, EUR: 16.40, BRL: 104.10, MXN: 387,  UYU: 714,  COP: 83900  },
    3: { ARS: 49000,  USD: 35.10, EUR: 30.33, BRL: 192.50, MXN: 716,  UYU: 1320, COP: 155100 },
    4: { ARS: 89000,  USD: 63.75, EUR: 55.09, BRL: 349.60, MXN: 1301, UYU: 2396, COP: 281800 },
    5: { ARS: 169000, USD: 121.06,EUR: 104.62,BRL: 664.00, MXN: 2471, UYU: 4545, COP: 535100 },
    6: { ARS: 390000, USD: 279.57,EUR: 241.44,BRL: 1532.00,MXN: 5702, UYU: 10481,COP: 1235000},
  },

  "ig-seg-latinos": {
    // 100 / 500 / 1.000 / 2.500 / 5.000 / 10.000
    0: { ARS: 8990,   USD: 6.20,  EUR: 5.35,  BRL: 34.10,  MXN: 110,  UYU: 250,  COP: 24200  },
    1: { ARS: 23990,  USD: 16.55, EUR: 14.25, BRL: 90.90,  MXN: 295,  UYU: 660,  COP: 64500  },
    2: { ARS: 40990,  USD: 28.25, EUR: 24.35, BRL: 155.35, MXN: 505,  UYU: 1130, COP: 110300 },
    3: { ARS: 84990,  USD: 58.60, EUR: 50.50, BRL: 322.10, MXN: 1045, UYU: 2350, COP: 228600 },
    4: { ARS: 90990,  USD: 62.75, EUR: 54.10, BRL: 344.85, MXN: 1120, UYU: 2510, COP: 244800 },
    5: { ARS: 169990, USD: 117.25,EUR: 101.05,BRL: 644.25, MXN: 2090, UYU: 4690, COP: 457300 },
  },

  "ig-likes-latinos": {
    // 250 / 500 / 1.000 / 2.500 / 5.000 / 10.000 / 20.000
    0: { ARS: 3500,  USD: 2.40,  EUR: 2.04,  BRL: 13.20,  MXN: 43,  UYU: 96,  COP: 9400   },
    1: { ARS: 5450,  USD: 3.75,  EUR: 3.18,  BRL: 20.60,  MXN: 67,  UYU: 150, COP: 14600  },
    2: { ARS: 8300,  USD: 5.70,  EUR: 4.85,  BRL: 31.40,  MXN: 102, UYU: 229, COP: 22200  },
    3: { ARS: 15500, USD: 10.65, EUR: 9.06,  BRL: 58.50,  MXN: 190, UYU: 427, COP: 41500  },
    4: { ARS: 28250, USD: 19.42, EUR: 16.51, BRL: 106.60, MXN: 347, UYU: 778, COP: 75600  },
    5: { ARS: 54650, USD: 37.56, EUR: 31.90, BRL: 206.40, MXN: 672, UYU: 1506,COP: 146300 },
    6: { ARS: 99400, USD: 68.32, EUR: 58.05, BRL: 375.50, MXN: 1222,UYU: 2738,COP: 266000 },
  },

  "ig-likes-globales": {
    // 500 / 1.000 / 2.500 / 5.000 / 10.000 / 20.000 / 50.000
    0: { ARS: 3700,   USD: 2.54,  EUR: 2.15,  BRL: 13.99,  MXN: 46,  UYU: 102, COP: 9905   },
    1: { ARS: 5600,   USD: 3.85,  EUR: 3.26,  BRL: 21.17,  MXN: 69,  UYU: 154, COP: 14991  },
    2: { ARS: 10400,  USD: 7.15,  EUR: 6.05,  BRL: 39.31,  MXN: 128, UYU: 287, COP: 27841  },
    3: { ARS: 18900,  USD: 12.99, EUR: 11.00, BRL: 71.44,  MXN: 232, UYU: 521, COP: 50595  },
    4: { ARS: 36500,  USD: 25.09, EUR: 21.24, BRL: 137.97, MXN: 449, UYU: 1006,COP: 97711  },
    5: { ARS: 66000,  USD: 45.36, EUR: 38.41, BRL: 249.48, MXN: 812, UYU: 1818,COP: 176682 },
    6: { ARS: 151000, USD: 103.78,EUR: 87.88, BRL: 570.78, MXN: 1857,UYU: 4160,COP: 404227 },
  },

  "ig-likes-mundiales": {
    // alias for globales
    0: { ARS: 3700,   USD: 2.54,  EUR: 2.15,  BRL: 13.99,  MXN: 46,  UYU: 102, COP: 9905   },
    1: { ARS: 5600,   USD: 3.85,  EUR: 3.26,  BRL: 21.17,  MXN: 69,  UYU: 154, COP: 14991  },
    2: { ARS: 10400,  USD: 7.15,  EUR: 6.05,  BRL: 39.31,  MXN: 128, UYU: 287, COP: 27841  },
    3: { ARS: 18900,  USD: 12.99, EUR: 11.00, BRL: 71.44,  MXN: 232, UYU: 521, COP: 50595  },
    4: { ARS: 36500,  USD: 25.09, EUR: 21.24, BRL: 137.97, MXN: 449, UYU: 1006,COP: 97711  },
    5: { ARS: 66000,  USD: 45.36, EUR: 38.41, BRL: 249.48, MXN: 812, UYU: 1818,COP: 176682 },
    6: { ARS: 151000, USD: 103.78,EUR: 87.88, BRL: 570.78, MXN: 1857,UYU: 4160,COP: 404227 },
  },

  "ig-likes-latinos-arg": {
    // alias for latinos
    0: { ARS: 3500,  USD: 2.40,  EUR: 2.04,  BRL: 13.20,  MXN: 43,  UYU: 96,  COP: 9400   },
    1: { ARS: 5450,  USD: 3.75,  EUR: 3.18,  BRL: 20.60,  MXN: 67,  UYU: 150, COP: 14600  },
    2: { ARS: 8300,  USD: 5.70,  EUR: 4.85,  BRL: 31.40,  MXN: 102, UYU: 229, COP: 22200  },
    3: { ARS: 15500, USD: 10.65, EUR: 9.06,  BRL: 58.50,  MXN: 190, UYU: 427, COP: 41500  },
    4: { ARS: 28250, USD: 19.42, EUR: 16.51, BRL: 106.60, MXN: 347, UYU: 778, COP: 75600  },
    5: { ARS: 54650, USD: 37.56, EUR: 31.90, BRL: 206.40, MXN: 672, UYU: 1506,COP: 146300 },
    6: { ARS: 99400, USD: 68.32, EUR: 58.05, BRL: 375.50, MXN: 1222,UYU: 2738,COP: 266000 },
  },

  "ig-vistas-reels": {
    // 2.000 / 5.000 / 10.000 / 20.000 / 50.000 / 150.000 / 300.000
    0: { ARS: 2500,  USD: 1.79,  EUR: 1.47,  BRL: 9.80,   MXN: 32,  UYU: 71,  COP: 7100   },
    1: { ARS: 4250,  USD: 3.04,  EUR: 2.50,  BRL: 16.70,  MXN: 55,  UYU: 121, COP: 12100  },
    2: { ARS: 6100,  USD: 4.36,  EUR: 3.59,  BRL: 24.00,  MXN: 78,  UYU: 174, COP: 17400  },
    3: { ARS: 8500,  USD: 6.07,  EUR: 5.00,  BRL: 33.40,  MXN: 109, UYU: 243, COP: 24300  },
    4: { ARS: 13100, USD: 9.36,  EUR: 7.70,  BRL: 51.40,  MXN: 168, UYU: 374, COP: 37400  },
    5: { ARS: 27600, USD: 19.71, EUR: 16.23, BRL: 108.20, MXN: 355, UYU: 789, COP: 78900  },
    6: { ARS: 47600, USD: 34.00, EUR: 28.00, BRL: 186.70, MXN: 612, UYU: 1360,COP: 136000 },
  },

  "ig-vistas-historias": {
    0: { ARS: 2500,  USD: 1.79,  EUR: 1.47,  BRL: 9.80,   MXN: 32,  UYU: 71,  COP: 7100   },
    1: { ARS: 4250,  USD: 3.04,  EUR: 2.50,  BRL: 16.70,  MXN: 55,  UYU: 121, COP: 12100  },
    2: { ARS: 6100,  USD: 4.36,  EUR: 3.59,  BRL: 24.00,  MXN: 78,  UYU: 174, COP: 17400  },
    3: { ARS: 8500,  USD: 6.07,  EUR: 5.00,  BRL: 33.40,  MXN: 109, UYU: 243, COP: 24300  },
    4: { ARS: 13100, USD: 9.36,  EUR: 7.70,  BRL: 51.40,  MXN: 168, UYU: 374, COP: 37400  },
    5: { ARS: 27600, USD: 19.71, EUR: 16.23, BRL: 108.20, MXN: 355, UYU: 789, COP: 78900  },
    6: { ARS: 47600, USD: 34.00, EUR: 28.00, BRL: 186.70, MXN: 612, UYU: 1360,COP: 136000 },
  },

  "ig-visualizaciones-videos": {
    0: { ARS: 2500,  USD: 1.79,  EUR: 1.47,  BRL: 9.80,   MXN: 32,  UYU: 71,  COP: 7100   },
    1: { ARS: 4250,  USD: 3.04,  EUR: 2.50,  BRL: 16.70,  MXN: 55,  UYU: 121, COP: 12100  },
    2: { ARS: 6100,  USD: 4.36,  EUR: 3.59,  BRL: 24.00,  MXN: 78,  UYU: 174, COP: 17400  },
    3: { ARS: 8500,  USD: 6.07,  EUR: 5.00,  BRL: 33.40,  MXN: 109, UYU: 243, COP: 24300  },
    4: { ARS: 13100, USD: 9.36,  EUR: 7.70,  BRL: 51.40,  MXN: 168, UYU: 374, COP: 37400  },
    5: { ARS: 27600, USD: 19.71, EUR: 16.23, BRL: 108.20, MXN: 355, UYU: 789, COP: 78900  },
    6: { ARS: 47600, USD: 34.00, EUR: 28.00, BRL: 186.70, MXN: 612, UYU: 1360,COP: 136000 },
  },

  "ig-comentarios": {
    0: { ARS: 2500,  USD: 2.27,  EUR: 2.08,  BRL: 10.00,  MXN: 38,  UYU: 89,   COP: 9500   },
    1: { ARS: 3250,  USD: 2.95,  EUR: 2.71,  BRL: 13.00,  MXN: 50,  UYU: 116,  COP: 12350  },
    2: { ARS: 4500,  USD: 4.09,  EUR: 3.75,  BRL: 18.00,  MXN: 69,  UYU: 161,  COP: 17100  },
    3: { ARS: 6000,  USD: 5.45,  EUR: 5.00,  BRL: 24.00,  MXN: 92,  UYU: 214,  COP: 22800  },
    4: { ARS: 20750, USD: 18.86, EUR: 17.29, BRL: 83.00,  MXN: 319, UYU: 741,  COP: 78850  },
    5: { ARS: 32000, USD: 29.09, EUR: 26.67, BRL: 128.00, MXN: 492, UYU: 1143, COP: 121600 },
  },

  "ig-compartidas": {
    0: { ARS: 3000,  USD: 2.73,  EUR: 2.50,  BRL: 12.00,  MXN: 46,  UYU: 107,  COP: 11400  },
    1: { ARS: 4000,  USD: 3.64,  EUR: 3.33,  BRL: 16.00,  MXN: 62,  UYU: 143,  COP: 15200  },
    2: { ARS: 6500,  USD: 5.91,  EUR: 5.42,  BRL: 26.00,  MXN: 100, UYU: 232,  COP: 24700  },
    3: { ARS: 7000,  USD: 6.36,  EUR: 5.83,  BRL: 28.00,  MXN: 108, UYU: 250,  COP: 26600  },
    4: { ARS: 9500,  USD: 8.64,  EUR: 7.92,  BRL: 38.00,  MXN: 146, UYU: 339,  COP: 36100  },
    5: { ARS: 14000, USD: 12.73, EUR: 11.67, BRL: 56.00,  MXN: 215, UYU: 500,  COP: 53200  },
  },

  // ──────────── TIKTOK ────────────

  "tt-seguidores": {
    // 200 / 500 / 1.000 / 2.500 / 5.000 / 10.000 / 20.000
    0: { ARS: 5200,   USD: 3.71,  EUR: 3.25,  BRL: 20.43,  MXN: 69,   UYU: 145, COP: 14486  },
    1: { ARS: 7900,   USD: 5.64,  EUR: 4.94,  BRL: 31.04,  MXN: 104,  UYU: 220, COP: 22007  },
    2: { ARS: 12500,  USD: 8.93,  EUR: 7.81,  BRL: 49.11,  MXN: 165,  UYU: 348, COP: 34821  },
    3: { ARS: 24000,  USD: 17.14, EUR: 15.00, BRL: 94.29,  MXN: 317,  UYU: 669, COP: 66857  },
    4: { ARS: 42000,  USD: 30.00, EUR: 26.25, BRL: 165.00, MXN: 555,  UYU: 1170,COP: 117000 },
    5: { ARS: 58000,  USD: 41.43, EUR: 36.25, BRL: 227.86, MXN: 766,  UYU: 1616,COP: 161571 },
    6: { ARS: 102000, USD: 72.86, EUR: 63.75, BRL: 400.71, MXN: 1348, UYU: 2841,COP: 284143 },
  },

  "tt-likes": {
    // 500 / 1.000 / 2.500 / 5.000 / 10.000 / 20.000 / 50.000
    0: { ARS: 2700,  USD: 1.85,  EUR: 1.60,  BRL: 10.25,  MXN: 33,  UYU: 75,  COP: 7300   },
    1: { ARS: 3900,  USD: 2.70,  EUR: 2.30,  BRL: 14.80,  MXN: 48,  UYU: 108, COP: 10500  },
    2: { ARS: 7500,  USD: 5.15,  EUR: 4.40,  BRL: 28.40,  MXN: 92,  UYU: 207, COP: 20200  },
    3: { ARS: 12800, USD: 8.80,  EUR: 7.50,  BRL: 48.50,  MXN: 157, UYU: 355, COP: 34500  },
    4: { ARS: 22300, USD: 15.35, EUR: 13.10, BRL: 84.50,  MXN: 274, UYU: 620, COP: 60100  },
    5: { ARS: 40300, USD: 27.75, EUR: 23.70, BRL: 152.60, MXN: 495, UYU: 1110,COP: 108500 },
    6: { ARS: 96300, USD: 66.40, EUR: 56.60, BRL: 364.80, MXN: 1185,UYU: 2650,COP: 259500 },
  },

  "tt-visualizaciones": {
    // 2.000 / 5.000 / 10.000 / 20.000 / 50.000 / 150.000 / 300.000
    0: { ARS: 5000,  USD: 3.44,  EUR: 2.92,  BRL: 18.90,  MXN: 61,  UYU: 138, COP: 13380  },
    1: { ARS: 7000,  USD: 4.81,  EUR: 4.09,  BRL: 26.40,  MXN: 86,  UYU: 193, COP: 18730  },
    2: { ARS: 10000, USD: 6.87,  EUR: 5.84,  BRL: 37.70,  MXN: 123, UYU: 276, COP: 26760  },
    3: { ARS: 15000, USD: 10.31, EUR: 8.76,  BRL: 56.60,  MXN: 184, UYU: 414, COP: 40140  },
    4: { ARS: 27000, USD: 18.56, EUR: 15.76, BRL: 101.90, MXN: 332, UYU: 744, COP: 72250  },
    5: { ARS: 37000, USD: 25.43, EUR: 21.65, BRL: 139.60, MXN: 455, UYU: 1020,COP: 98990  },
    6: { ARS: 57000, USD: 39.18, EUR: 33.40, BRL: 215.10, MXN: 701, UYU: 1572,COP: 152530 },
  },

  // ──────────── FACEBOOK ────────────

  "fb-seguidores": {
    // 500 / 1.000 / 2.500 / 5.000 / 10.000 / 20.000 / 50.000
    0: { ARS: 3100,   USD: 2.13,  EUR: 1.81,  BRL: 11.70,  MXN: 38,   UYU: 85,  COP: 8300   },
    1: { ARS: 4700,   USD: 3.23,  EUR: 2.74,  BRL: 17.80,  MXN: 58,   UYU: 130, COP: 12600  },
    2: { ARS: 9700,   USD: 6.67,  EUR: 5.66,  BRL: 36.70,  MXN: 119,  UYU: 267, COP: 26000  },
    3: { ARS: 16900,  USD: 11.62, EUR: 9.87,  BRL: 63.90,  MXN: 208,  UYU: 466, COP: 45300  },
    4: { ARS: 29900,  USD: 20.55, EUR: 17.46, BRL: 113.00, MXN: 368,  UYU: 824, COP: 80100  },
    5: { ARS: 55900,  USD: 38.42, EUR: 32.65, BRL: 211.40, MXN: 688,  UYU: 1541,COP: 149800 },
    6: { ARS: 125900, USD: 86.53, EUR: 73.52, BRL: 476.10, MXN: 1549, UYU: 3469,COP: 337000 },
  },

  "fb-likes-post": {
    // 200 / 500 / 1.000 / 2.500 / 5.000 / 10.000 / 20.000
    0: { ARS: 2900,  USD: 1.99,  EUR: 1.69,  BRL: 10.90,  MXN: 36,  UYU: 80,  COP: 7800   },
    1: { ARS: 4500,  USD: 3.09,  EUR: 2.63,  BRL: 17.00,  MXN: 55,  UYU: 124, COP: 12000  },
    2: { ARS: 7500,  USD: 5.15,  EUR: 4.38,  BRL: 28.30,  MXN: 92,  UYU: 207, COP: 20100  },
    3: { ARS: 15900, USD: 10.93, EUR: 9.29,  BRL: 60.00,  MXN: 195, UYU: 438, COP: 42600  },
    4: { ARS: 28500, USD: 19.59, EUR: 16.65, BRL: 107.50, MXN: 350, UYU: 785, COP: 76300  },
    5: { ARS: 50900, USD: 34.98, EUR: 29.75, BRL: 192.10, MXN: 626, UYU: 1402,COP: 136200 },
    6: { ARS: 96000, USD: 65.98, EUR: 56.04, BRL: 362.30, MXN: 1181,UYU: 2645,COP: 256900 },
  },

  // ──────────── YOUTUBE ────────────

  "yt-subscriptores": {
    // 100 / 200 / 300 / 500 / 1.000 / 1.500 / 2.000
    0: { ARS: 19500,  USD: 13.93, EUR: 11.98, BRL: 76.60,  MXN: 251,  UYU: 557, COP: 55700  },
    1: { ARS: 34000,  USD: 24.29, EUR: 20.89, BRL: 133.60, MXN: 437,  UYU: 971, COP: 97100  },
    2: { ARS: 48000,  USD: 34.29, EUR: 29.49, BRL: 188.60, MXN: 617,  UYU: 1371,COP: 137100 },
    3: { ARS: 74500,  USD: 53.21, EUR: 45.76, BRL: 292.70, MXN: 958,  UYU: 2129,COP: 212900 },
    4: { ARS: 119000, USD: 85.00, EUR: 73.10, BRL: 467.50, MXN: 1530, UYU: 3400,COP: 340000 },
    5: { ARS: 167000, USD: 119.29,EUR: 102.59,BRL: 656.10, MXN: 2147, UYU: 4771,COP: 477100 },
    6: { ARS: 211000, USD: 150.71,EUR: 129.61,BRL: 828.90, MXN: 2713, UYU: 6029,COP: 602900 },
  },

  "yt-suscriptores-canales": {
    0: { ARS: 19500,  USD: 13.93, EUR: 11.98, BRL: 76.60,  MXN: 251,  UYU: 557, COP: 55700  },
    1: { ARS: 34000,  USD: 24.29, EUR: 20.89, BRL: 133.60, MXN: 437,  UYU: 971, COP: 97100  },
    2: { ARS: 48000,  USD: 34.29, EUR: 29.49, BRL: 188.60, MXN: 617,  UYU: 1371,COP: 137100 },
    3: { ARS: 74500,  USD: 53.21, EUR: 45.76, BRL: 292.70, MXN: 958,  UYU: 2129,COP: 212900 },
    4: { ARS: 119000, USD: 85.00, EUR: 73.10, BRL: 467.50, MXN: 1530, UYU: 3400,COP: 340000 },
    5: { ARS: 167000, USD: 119.29,EUR: 102.59,BRL: 656.10, MXN: 2147, UYU: 4771,COP: 477100 },
    6: { ARS: 211000, USD: 150.71,EUR: 129.61,BRL: 828.90, MXN: 2713, UYU: 6029,COP: 602900 },
  },

  "yt-likes-megusta": {
    // 100 / 200 / 500 / 1.000 / 2.500 / 5.000 / 10.000
    0: { ARS: 2000,  USD: 1.43,  EUR: 1.25,  BRL: 7.86,   MXN: 26,  UYU: 56,  COP: 5571   },
    1: { ARS: 2900,  USD: 2.07,  EUR: 1.81,  BRL: 11.39,  MXN: 38,  UYU: 81,  COP: 8079   },
    2: { ARS: 5500,  USD: 3.93,  EUR: 3.44,  BRL: 21.61,  MXN: 73,  UYU: 307, COP: 15321  },
    3: { ARS: 9500,  USD: 6.79,  EUR: 5.94,  BRL: 37.32,  MXN: 126, UYU: 529, COP: 26464  },
    4: { ARS: 19600, USD: 14.00, EUR: 12.25, BRL: 76.96,  MXN: 259, UYU: 1091,COP: 54643  },
    5: { ARS: 32600, USD: 23.29, EUR: 20.38, BRL: 128.00, MXN: 431, UYU: 1814,COP: 90857  },
    6: { ARS: 59600, USD: 42.57, EUR: 37.25, BRL: 234.29, MXN: 788, UYU: 3314,COP: 166143 },
  },

  "yt-likes-videos-shorts": {
    0: { ARS: 2000,  USD: 1.43,  EUR: 1.25,  BRL: 7.86,   MXN: 26,  UYU: 56,  COP: 5571   },
    1: { ARS: 2900,  USD: 2.07,  EUR: 1.81,  BRL: 11.39,  MXN: 38,  UYU: 81,  COP: 8079   },
    2: { ARS: 5500,  USD: 3.93,  EUR: 3.44,  BRL: 21.61,  MXN: 73,  UYU: 307, COP: 15321  },
    3: { ARS: 9500,  USD: 6.79,  EUR: 5.94,  BRL: 37.32,  MXN: 126, UYU: 529, COP: 26464  },
    4: { ARS: 19600, USD: 14.00, EUR: 12.25, BRL: 76.96,  MXN: 259, UYU: 1091,COP: 54643  },
    5: { ARS: 32600, USD: 23.29, EUR: 20.38, BRL: 128.00, MXN: 431, UYU: 1814,COP: 90857  },
    6: { ARS: 59600, USD: 42.57, EUR: 37.25, BRL: 234.29, MXN: 788, UYU: 3314,COP: 166143 },
  },

  "yt-visitas-mundiales": {
    // 1.000 / 2.500 / 5.000 / 10.000 / 20.000 / 50.000
    0: { ARS: 5400,   USD: 3.86,  EUR: 3.33,  BRL: 21.20,  MXN: 79,   UYU: 145, COP: 17100  },
    1: { ARS: 12750,  USD: 9.12,  EUR: 7.87,  BRL: 50.10,  MXN: 186,  UYU: 343, COP: 40300  },
    2: { ARS: 24000,  USD: 17.18, EUR: 14.85, BRL: 94.30,  MXN: 351,  UYU: 646, COP: 75900  },
    3: { ARS: 45000,  USD: 32.20, EUR: 27.85, BRL: 176.80, MXN: 658,  UYU: 1211,COP: 142400 },
    4: { ARS: 84000,  USD: 60.10, EUR: 51.95, BRL: 330.00, MXN: 1228, UYU: 2261,COP: 265800 },
    5: { ARS: 156000, USD: 111.70,EUR: 96.49, BRL: 612.80, MXN: 2281, UYU: 4199,COP: 493900 },
  },

  "yt-visitas-argentinas": {
    // 500 / 1.000 / 2.500 / 5.000 / 10.000 / 25.000
    0: { ARS: 7500,   USD: 5.37,  EUR: 4.64,  BRL: 29.50,  MXN: 110,  UYU: 202, COP: 23700  },
    1: { ARS: 15000,  USD: 10.74, EUR: 9.28,  BRL: 58.90,  MXN: 219,  UYU: 404, COP: 47500  },
    2: { ARS: 37500,  USD: 26.84, EUR: 23.20, BRL: 147.30, MXN: 548,  UYU: 1010,COP: 118700 },
    3: { ARS: 75000,  USD: 53.69, EUR: 46.40, BRL: 294.60, MXN: 1096, UYU: 2019,COP: 237500 },
    4: { ARS: 150000, USD: 107.37,EUR: 92.81, BRL: 589.20, MXN: 2193, UYU: 4038,COP: 474900 },
    5: { ARS: 375000, USD: 268.43,EUR: 232.03,BRL: 1473.00,MXN: 5481, UYU: 10096,COP:1187200},
  },

  "yt-comentarios": {
    0: { ARS: 4500,   USD: 4.09,  EUR: 3.75,  BRL: 18.00,  MXN: 69,   UYU: 161,  COP: 17100  },
    1: { ARS: 8250,   USD: 7.50,  EUR: 6.88,  BRL: 33.00,  MXN: 127,  UYU: 295,  COP: 31350  },
    2: { ARS: 14500,  USD: 13.18, EUR: 12.08, BRL: 58.00,  MXN: 223,  UYU: 518,  COP: 55100  },
    3: { ARS: 24500,  USD: 22.27, EUR: 20.42, BRL: 98.00,  MXN: 377,  UYU: 875,  COP: 93100  },
    4: { ARS: 55125,  USD: 50.11, EUR: 45.94, BRL: 220.50, MXN: 848,  UYU: 1969, COP: 209475 },
    5: { ARS: 102000, USD: 92.73, EUR: 85.00, BRL: 408.00, MXN: 1569, UYU: 3643, COP: 387600 },
  },

  "yt-espectadores": {
    0: { ARS: 6990,  USD: 6.35,  EUR: 5.83,  BRL: 27.96,  MXN: 108, UYU: 250,  COP: 26562  },
    1: { ARS: 11490, USD: 10.45, EUR: 9.58,  BRL: 45.96,  MXN: 177, UYU: 410,  COP: 43662  },
    2: { ARS: 15790, USD: 14.35, EUR: 13.16, BRL: 63.16,  MXN: 243, UYU: 564,  COP: 60002  },
    3: { ARS: 19590, USD: 17.81, EUR: 16.33, BRL: 78.36,  MXN: 301, UYU: 700,  COP: 74442  },
    4: { ARS: 23190, USD: 21.08, EUR: 19.33, BRL: 92.76,  MXN: 357, UYU: 828,  COP: 88122  },
    5: { ARS: 35990, USD: 32.72, EUR: 29.99, BRL: 143.96, MXN: 554, UYU: 1285, COP: 136762 },
  },

  // ──────────── SPOTIFY (sin cambios) ────────────

  "sp-reproducciones-mundiales": {
    0: { ARS: 6000,   USD: 5.45,  EUR: 5.00,  BRL: 24.00,  MXN: 92,   UYU: 214,  COP: 22800  },
    1: { ARS: 11000,  USD: 10.00, EUR: 9.17,  BRL: 44.00,  MXN: 169,  UYU: 393,  COP: 41800  },
    2: { ARS: 19000,  USD: 17.27, EUR: 15.83, BRL: 76.00,  MXN: 292,  UYU: 679,  COP: 72200  },
    3: { ARS: 34000,  USD: 30.91, EUR: 28.33, BRL: 136.00, MXN: 523,  UYU: 1214, COP: 129200 },
    4: { ARS: 72000,  USD: 65.45, EUR: 60.00, BRL: 288.00, MXN: 1108, UYU: 2571, COP: 273600 },
    5: { ARS: 132000, USD: 120.00,EUR: 110.00,BRL: 528.00, MXN: 2031, UYU: 4714, COP: 501600 },
  },

  "sp-reproducciones-argentinas": {
    0: { ARS: 12000,  USD: 10.91, EUR: 10.00, BRL: 48.00,  MXN: 185,  UYU: 429,  COP: 45600  },
    1: { ARS: 24500,  USD: 22.27, EUR: 20.42, BRL: 98.00,  MXN: 377,  UYU: 875,  COP: 93100  },
    2: { ARS: 44500,  USD: 40.45, EUR: 37.08, BRL: 178.00, MXN: 685,  UYU: 1589, COP: 169100 },
    3: { ARS: 82000,  USD: 74.55, EUR: 68.33, BRL: 328.00, MXN: 1262, UYU: 2929, COP: 311600 },
    4: { ARS: 189500, USD: 172.27,EUR: 157.92,BRL: 758.00, MXN: 2915, UYU: 6768, COP: 720100 },
    5: { ARS: 352000, USD: 320.00,EUR: 293.33,BRL: 1408.00,MXN: 5415, UYU: 12571,COP: 1337600},
  },

};

export function getPrice(
  serviceId: string,
  tierIndex: number,
  baseArsPrice: number,
  currency: Currency
): number {
  const dynamicPrice = PRICING_DATA[serviceId]?.[tierIndex]?.[currency];
  if (dynamicPrice !== undefined && dynamicPrice > 0) return dynamicPrice;

  // Fallback genérico
  if (currency === "ARS") return baseArsPrice;
  if (currency === "USD") return Math.round((baseArsPrice / 1395) * 100) / 100;
  if (currency === "EUR") return Math.round((baseArsPrice / 1620) * 100) / 100;
  if (currency === "BRL") return Math.round((baseArsPrice / 280) * 100) / 100;
  if (currency === "COP") return Math.round(baseArsPrice * 2.9);
  if (currency === "MXN") return Math.round((baseArsPrice / 69) * 10) / 10;
  if (currency === "UYU") return Math.round((baseArsPrice / 37) * 10) / 10;
  return baseArsPrice;
}
