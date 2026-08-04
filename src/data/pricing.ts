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

  // ──────────── INSTAGRAM (datos del PDF) ────────────

  "ig-seg-latinos": {
    0: { ARS: 3990,   USD: 3.63,  EUR: 3.32,  BRL: 15.68,  MXN: 49,   UYU: 110,  COP: 11114  },
    1: { ARS: 18990,  USD: 17.27, EUR: 15.82, BRL: 74.64,  MXN: 233,  UYU: 523,  COP: 52921  },
    2: { ARS: 35990,  USD: 32.72, EUR: 29.98, BRL: 141.41, MXN: 442,  UYU: 992,  COP: 100318 },
    3: { ARS: 79990,  USD: 72.72, EUR: 66.65, BRL: 314.35, MXN: 983,  UYU: 2204, COP: 222923 },
    4: { ARS: 85990,  USD: 78.18, EUR: 71.66, BRL: 337.97, MXN: 1057, UYU: 2370, COP: 239689 },
    5: { ARS: 164990, USD: 150.00,EUR: 137.50,BRL: 648.39, MXN: 2028, UYU: 4545, COP: 460000 },
  },

  "ig-seg-globales": {
    0: { ARS: 5900,   USD: 4.22,  EUR: 3.48,  BRL: 23.19,  MXN: 86,   UYU: 159,  COP: 16437  },
    1: { ARS: 11100,  USD: 7.95,  EUR: 6.55,  BRL: 43.62,  MXN: 162,  UYU: 299,  COP: 30932  },
    2: { ARS: 26500,  USD: 18.98, EUR: 15.65, BRL: 104.18, MXN: 387,  UYU: 714,  COP: 73822  },
    3: { ARS: 49000,  USD: 35.09, EUR: 28.94, BRL: 192.75, MXN: 716,  UYU: 1320, COP: 136589 },
    4: { ARS: 89000,  USD: 63.78, EUR: 52.59, BRL: 350.20, MXN: 1301, UYU: 2396, COP: 248055 },
    5: { ARS: 169000, USD: 121.00,EUR: 99.82, BRL: 664.52, MXN: 2471, UYU: 4545, COP: 471063 },
    6: { ARS: 390000, USD: 279.37,EUR: 230.52,BRL: 1533.33,MXN: 5702, UYU: 10481,COP: 1087500},
  },

  "ig-seg-premium": {
    0: { ARS: 8400,   USD: 6.00,  EUR: 4.99,  BRL: 33.03,  MXN: 123,  UYU: 226,  COP: 23400  },
    1: { ARS: 11800,  USD: 8.45,  EUR: 7.01,  BRL: 46.41,  MXN: 173,  UYU: 318,  COP: 32889  },
    2: { ARS: 22200,  USD: 15.87, EUR: 13.18, BRL: 87.30,  MXN: 325,  UYU: 598,  COP: 61833  },
    3: { ARS: 53000,  USD: 37.93, EUR: 31.49, BRL: 208.47, MXN: 776,  UYU: 1427, COP: 147778 },
    4: { ARS: 98000,  USD: 70.07, EUR: 58.21, BRL: 385.36, MXN: 1434, UYU: 2637, COP: 273056 },
    5: { ARS: 178000, USD: 127.36,EUR: 105.77,BRL: 700.39, MXN: 2604, UYU: 4791, COP: 496296 },
    6: { ARS: 338000, USD: 241.78,EUR: 200.90,BRL: 1329.73,MXN: 4945, UYU: 9098, COP: 942407 },
  },

  "ig-likes-mundiales": {
    0: { ARS: 500,  USD: 0.36, EUR: 0.31, BRL: 1.96,  MXN: 6,  UYU: 13,  COP: 1392  },
    1: { ARS: 1250, USD: 0.89, EUR: 0.78, BRL: 4.91,  MXN: 15, UYU: 34,  COP: 3482  },
    2: { ARS: 2000, USD: 1.43, EUR: 1.25, BRL: 7.86,  MXN: 24, UYU: 55,  COP: 5571  },
    3: { ARS: 2800, USD: 2.00, EUR: 1.75, BRL: 11.00, MXN: 34, UYU: 77,  COP: 7799  },
    4: { ARS: 3500, USD: 2.50, EUR: 2.19, BRL: 13.75, MXN: 43, UYU: 96,  COP: 9750  },
    5: { ARS: 8000, USD: 5.71, EUR: 5.00, BRL: 31.43, MXN: 98, UYU: 222, COP: 22286 },
  },

  "ig-likes-latinos": {
    0: { ARS: 1000,  USD: 0.71,  EUR: 0.62,  BRL: 3.93,  MXN: 12,  UYU: 27,  COP: 2786  },
    1: { ARS: 2375,  USD: 1.70,  EUR: 1.48,  BRL: 9.33,  MXN: 29,  UYU: 65,  COP: 6618  },
    2: { ARS: 4500,  USD: 3.21,  EUR: 2.81,  BRL: 17.68, MXN: 55,  UYU: 124, COP: 12536 },
    3: { ARS: 6600,  USD: 4.71,  EUR: 4.12,  BRL: 25.93, MXN: 81,  UYU: 182, COP: 18393 },
    4: { ARS: 8500,  USD: 6.07,  EUR: 5.31,  BRL: 33.39, MXN: 104, UYU: 234, COP: 23679 },
    5: { ARS: 20000, USD: 14.29, EUR: 12.50, BRL: 78.57, MXN: 246, UYU: 551, COP: 55714 },
  },

  "ig-likes-globales": {
    0: { ARS: 2700,   USD: 1.93,  EUR: 1.69,  BRL: 10.61,  MXN: 33,  UYU: 74,  COP: 7521   },
    1: { ARS: 4600,   USD: 3.29,  EUR: 2.87,  BRL: 18.07,  MXN: 56,  UYU: 127, COP: 12814  },
    2: { ARS: 9400,   USD: 6.71,  EUR: 5.87,  BRL: 36.93,  MXN: 115, UYU: 259, COP: 26186  },
    3: { ARS: 17900,  USD: 12.79, EUR: 11.19, BRL: 70.36,  MXN: 220, UYU: 494, COP: 49886  },
    4: { ARS: 35500,  USD: 25.36, EUR: 22.19, BRL: 139.50, MXN: 436, UYU: 980, COP: 98943  },
    5: { ARS: 65000,  USD: 46.43, EUR: 40.62, BRL: 255.71, MXN: 799, UYU: 1793,COP: 181286 },
    6: { ARS: 150000, USD: 107.14,EUR: 93.75, BRL: 589.86, MXN: 1843,UYU: 4136,COP: 418286 },
  },

  "ig-likes-latinos-arg": {
    0: { ARS: 2100,  USD: 1.50,  EUR: 1.31,  BRL: 8.25,   MXN: 25,  UYU: 57,  COP: 5850   },
    1: { ARS: 4050,  USD: 2.89,  EUR: 2.53,  BRL: 15.91,  MXN: 49,  UYU: 110, COP: 11286  },
    2: { ARS: 6900,  USD: 4.93,  EUR: 4.31,  BRL: 27.11,  MXN: 84,  UYU: 188, COP: 19243  },
    3: { ARS: 14100, USD: 10.07, EUR: 8.81,  BRL: 55.43,  MXN: 173, UYU: 388, COP: 39300  },
    4: { ARS: 26850, USD: 19.18, EUR: 16.78, BRL: 105.54, MXN: 330, UYU: 739, COP: 74836  },
    5: { ARS: 53250, USD: 38.04, EUR: 33.28, BRL: 209.29, MXN: 654, UYU: 1466,COP: 148464 },
    6: { ARS: 97500, USD: 69.64, EUR: 60.94, BRL: 383.14, MXN: 1198,UYU: 2683,COP: 271821 },
  },

  "ig-vistas-reels": {
    0: { ARS: 2500,  USD: 2.54,  EUR: 2.15,  BRL: 13.99,  MXN: 32,  UYU: 102, COP: 9905   },
    1: { ARS: 4250,  USD: 3.85,  EUR: 3.26,  BRL: 21.17,  MXN: 55,  UYU: 154, COP: 14991  },
    2: { ARS: 6100,  USD: 7.15,  EUR: 6.05,  BRL: 39.31,  MXN: 78,  UYU: 287, COP: 27841  },
    3: { ARS: 8500,  USD: 12.99, EUR: 11.00, BRL: 71.44,  MXN: 109, UYU: 521, COP: 50595  },
    4: { ARS: 13100, USD: 25.09, EUR: 21.24, BRL: 137.97, MXN: 168, UYU: 1006,COP: 97711  },
    5: { ARS: 27600, USD: 45.36, EUR: 38.41, BRL: 249.48, MXN: 355, UYU: 1818,COP: 176682 },
    6: { ARS: 47600, USD: 103.78,EUR: 87.88, BRL: 570.78, MXN: 612, UYU: 4160,COP: 404227 },
  },

  "ig-vistas-historias": {
    0: { ARS: 2500,  USD: 2.54,  EUR: 2.15,  BRL: 13.99,  MXN: 32,  UYU: 102, COP: 9905   },
    1: { ARS: 4250,  USD: 3.85,  EUR: 3.26,  BRL: 21.17,  MXN: 55,  UYU: 154, COP: 14991  },
    2: { ARS: 6100,  USD: 7.15,  EUR: 6.05,  BRL: 39.31,  MXN: 78,  UYU: 287, COP: 27841  },
    3: { ARS: 8500,  USD: 12.99, EUR: 11.00, BRL: 71.44,  MXN: 109, UYU: 521, COP: 50595  },
    4: { ARS: 13100, USD: 25.09, EUR: 21.24, BRL: 137.97, MXN: 168, UYU: 1006,COP: 97711  },
    5: { ARS: 27600, USD: 45.36, EUR: 38.41, BRL: 249.48, MXN: 355, UYU: 1818,COP: 176682 },
    6: { ARS: 47600, USD: 103.78,EUR: 87.88, BRL: 570.78, MXN: 612, UYU: 4160,COP: 404227 },
  },

  // ──────────── INSTAGRAM (sin datos PDF → base +2000 ARS) ────────────

  "ig-visualizaciones-videos": {
    0: { ARS: 2890,  USD: 2.63,  EUR: 2.41,  BRL: 11.56,  MXN: 44,  UYU: 103,  COP: 10982  },
    1: { ARS: 3750,  USD: 3.41,  EUR: 3.13,  BRL: 15.00,  MXN: 58,  UYU: 134,  COP: 14250  },
    2: { ARS: 5500,  USD: 5.00,  EUR: 4.58,  BRL: 22.00,  MXN: 85,  UYU: 196,  COP: 20900  },
    3: { ARS: 7900,  USD: 7.18,  EUR: 6.58,  BRL: 31.60,  MXN: 122, UYU: 282,  COP: 30020  },
    4: { ARS: 12500, USD: 11.36, EUR: 10.42, BRL: 50.00,  MXN: 192, UYU: 446,  COP: 47500  },
    5: { ARS: 27000, USD: 24.55, EUR: 22.50, BRL: 108.00, MXN: 415, UYU: 964,  COP: 102600 },
    6: { ARS: 47000, USD: 42.73, EUR: 39.17, BRL: 188.00, MXN: 723, UYU: 1679, COP: 178600 },
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

  // ──────────── TIKTOK (datos del PDF) ────────────

  "tt-seguidores": {
    0: { ARS: 5200,   USD: 3.71,  EUR: 3.25,  BRL: 20.43,  MXN: 69,   UYU: 145, COP: 14486  },
    1: { ARS: 7900,   USD: 5.64,  EUR: 4.94,  BRL: 31.04,  MXN: 104,  UYU: 220, COP: 22007  },
    2: { ARS: 12500,  USD: 8.93,  EUR: 7.81,  BRL: 49.11,  MXN: 165,  UYU: 348, COP: 34821  },
    3: { ARS: 24000,  USD: 17.14, EUR: 15.00, BRL: 94.29,  MXN: 317,  UYU: 669, COP: 66857  },
    4: { ARS: 42000,  USD: 30.00, EUR: 26.25, BRL: 165.00, MXN: 555,  UYU: 1170,COP: 117000 },
    5: { ARS: 58000,  USD: 41.43, EUR: 36.25, BRL: 227.86, MXN: 766,  UYU: 1616,COP: 161571 },
    6: { ARS: 102000, USD: 72.86, EUR: 63.75, BRL: 400.71, MXN: 1348, UYU: 2841,COP: 284143 },
  },

  "tt-likes": {
    0: { ARS: 2700,  USD: 3.71,  EUR: 3.25,  BRL: 20.43,  MXN: 33,  UYU: 145, COP: 13380  },
    1: { ARS: 3900,  USD: 5.64,  EUR: 4.94,  BRL: 31.04,  MXN: 48,  UYU: 220, COP: 18730  },
    2: { ARS: 7500,  USD: 8.93,  EUR: 7.81,  BRL: 49.11,  MXN: 92,  UYU: 348, COP: 26760  },
    3: { ARS: 12800, USD: 17.14, EUR: 15.00, BRL: 94.29,  MXN: 157, UYU: 669, COP: 40140  },
    4: { ARS: 22300, USD: 30.00, EUR: 26.25, BRL: 165.00, MXN: 274, UYU: 1170,COP: 72250  },
    5: { ARS: 40300, USD: 41.43, EUR: 36.25, BRL: 227.86, MXN: 495, UYU: 1616,COP: 98990  },
    6: { ARS: 96300, USD: 72.86, EUR: 63.75, BRL: 400.71, MXN: 1185,UYU: 2841,COP: 152530 },
  },

  "tt-visualizaciones": {
    0: { ARS: 5000,  USD: 1.85,  EUR: 1.60,  BRL: 10.25,  MXN: 61,  UYU: 75,  COP: 7300   },
    1: { ARS: 7000,  USD: 2.70,  EUR: 2.30,  BRL: 14.80,  MXN: 86,  UYU: 108, COP: 10500  },
    2: { ARS: 10000, USD: 5.15,  EUR: 4.40,  BRL: 28.40,  MXN: 123, UYU: 207, COP: 20200  },
    3: { ARS: 15000, USD: 8.80,  EUR: 7.50,  BRL: 48.50,  MXN: 184, UYU: 355, COP: 34500  },
    4: { ARS: 27000, USD: 15.35, EUR: 13.10, BRL: 84.50,  MXN: 332, UYU: 620, COP: 60100  },
    5: { ARS: 37000, USD: 27.75, EUR: 23.70, BRL: 152.60, MXN: 455, UYU: 1110,COP: 108500 },
    6: { ARS: 57000, USD: 66.40, EUR: 56.60, BRL: 364.80, MXN: 701, UYU: 2650,COP: 259500 },
  },

  // ──────────── FACEBOOK (datos del PDF) ────────────

  "fb-seguidores": {
    0: { ARS: 3100,   USD: 2.82,  EUR: 1.84,  BRL: 12.19,  MXN: 38,   UYU: 85,  COP: 8639   },
    1: { ARS: 4700,   USD: 4.27,  EUR: 2.79,  BRL: 18.47,  MXN: 58,   UYU: 130, COP: 13093  },
    2: { ARS: 9700,   USD: 8.82,  EUR: 5.76,  BRL: 38.12,  MXN: 119,  UYU: 267, COP: 27031  },
    3: { ARS: 16900,  USD: 15.36, EUR: 10.03, BRL: 66.44,  MXN: 208,  UYU: 466, COP: 47093  },
    4: { ARS: 29900,  USD: 27.18, EUR: 17.75, BRL: 117.55, MXN: 368,  UYU: 825, COP: 83357  },
    5: { ARS: 55900,  USD: 50.82, EUR: 33.21, BRL: 219.78, MXN: 688,  UYU: 1542,COP: 155786 },
    6: { ARS: 125900, USD: 114.45,EUR: 74.76, BRL: 494.97, MXN: 1549, UYU: 3473,COP: 350850 },
  },

  "fb-likes-post": {
    0: { ARS: 2900,  USD: 2.07,  EUR: 1.72,  BRL: 11.40,  MXN: 36,  UYU: 80,  COP: 8083   },
    1: { ARS: 4500,  USD: 3.21,  EUR: 2.67,  BRL: 17.68,  MXN: 55,  UYU: 124, COP: 12536  },
    2: { ARS: 7500,  USD: 5.36,  EUR: 4.45,  BRL: 29.46,  MXN: 92,  UYU: 207, COP: 20893  },
    3: { ARS: 15900, USD: 11.36, EUR: 9.44,  BRL: 62.50,  MXN: 195, UYU: 439, COP: 44286  },
    4: { ARS: 28500, USD: 20.36, EUR: 16.92, BRL: 112.05, MXN: 350, UYU: 786, COP: 79393  },
    5: { ARS: 50900, USD: 36.39, EUR: 30.24, BRL: 200.20, MXN: 626, UYU: 1403,COP: 141857 },
    6: { ARS: 96000, USD: 68.66, EUR: 57.03, BRL: 377.64, MXN: 1181,UYU: 2648,COP: 267619 },
  },

  // ──────────── YOUTUBE (datos del PDF) ────────────

  "yt-subscriptores": {
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
    0: { ARS: 5400,   USD: 3.86,  EUR: 3.33,  BRL: 21.20,  MXN: 79,   UYU: 145, COP: 17100  },
    1: { ARS: 12750,  USD: 9.12,  EUR: 7.87,  BRL: 50.10,  MXN: 186,  UYU: 343, COP: 40300  },
    2: { ARS: 24000,  USD: 17.18, EUR: 14.85, BRL: 94.30,  MXN: 351,  UYU: 646, COP: 75900  },
    3: { ARS: 45000,  USD: 32.20, EUR: 27.85, BRL: 176.80, MXN: 658,  UYU: 1211,COP: 142400 },
    4: { ARS: 84000,  USD: 60.10, EUR: 51.95, BRL: 330.00, MXN: 1228, UYU: 2261,COP: 265800 },
    5: { ARS: 156000, USD: 111.70,EUR: 96.49, BRL: 612.80, MXN: 2281, UYU: 4199,COP: 493900 },
  },

  "yt-visitas-argentinas": {
    0: { ARS: 7500,   USD: 5.37,  EUR: 4.64,  BRL: 29.50,  MXN: 110,  UYU: 202, COP: 23700  },
    1: { ARS: 15000,  USD: 10.74, EUR: 9.28,  BRL: 58.90,  MXN: 219,  UYU: 404, COP: 47500  },
    2: { ARS: 37500,  USD: 26.84, EUR: 23.20, BRL: 147.30, MXN: 548,  UYU: 1010,COP: 118700 },
    3: { ARS: 75000,  USD: 53.69, EUR: 46.40, BRL: 294.60, MXN: 1096, UYU: 2019,COP: 237500 },
    4: { ARS: 150000, USD: 107.37,EUR: 92.81, BRL: 589.20, MXN: 2193, UYU: 4038,COP: 474900 },
    5: { ARS: 375000, USD: 268.43,EUR: 232.03,BRL: 1473.00,MXN: 5481, UYU: 10096,COP:1187200},
  },

  // ──────────── YOUTUBE (sin datos PDF → base +2000 ARS) ────────────

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

  // ──────────── SPOTIFY (sin datos PDF → base +2000 ARS) ────────────

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
  if (dynamicPrice !== undefined) return dynamicPrice;

  // Fallback genérico (no debería usarse — todos los servicios ya tienen datos)
  if (currency === "ARS") return baseArsPrice;
  if (currency === "USD") return Math.round((baseArsPrice / 1100) * 100) / 100;
  if (currency === "EUR") return Math.round((baseArsPrice / 1200) * 100) / 100;
  if (currency === "BRL") return Math.round((baseArsPrice / 250) * 100) / 100;
  if (currency === "COP") return Math.round(baseArsPrice * 3.8);
  if (currency === "MXN") return Math.round((baseArsPrice / 65) * 10) / 10;
  if (currency === "UYU") return Math.round((baseArsPrice / 28) * 10) / 10;
  return baseArsPrice;
}
