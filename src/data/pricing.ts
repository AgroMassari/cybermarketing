export type Currency = "ARS" | "USD" | "EUR" | "COP" | "MXN" | "UYU" | "BRL" | "CLP";

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  ARS: "$",
  USD: "US$",
  EUR: "€",
  COP: "COP$",
  MXN: "MX$",
  UYU: "UYU$",
  BRL: "R$",
  CLP: "CLP$",
};

export type PricingTable = {
  [tierIndex: number]: {
    [key in Currency]?: number;
  };
};

// IDs match exactly the SERVICE_GROUPS id field in App.tsx
export const PRICING_DATA: Record<string, PricingTable> = {

  // ──────────── INSTAGRAM ────────────

  // Servicio Seguidores Global economics
  // 250 / 500 / 1.000 / 2.500 / 5.000 / 10.000 / 20.000
  "ig-seg-globales": {
    0: { ARS: 8900,   USD: 6.38,   EUR: 5.51,   BRL: 34.90,   MXN: 130,  UYU: 239,  COP: 28200,   CLP: 5716   },
    1: { ARS: 12300,  USD: 8.81,   EUR: 7.62,   BRL: 48.30,   MXN: 180,  UYU: 331,  COP: 38900,   CLP: 7899   },
    2: { ARS: 22700,  USD: 16.26,  EUR: 14.07,  BRL: 89.20,   MXN: 332,  UYU: 611,  COP: 71900,   CLP: 14579  },
    3: { ARS: 35000,  USD: 22.77,  EUR: 20.33,  BRL: 122.97, MXN: 429,  UYU: 915,  COP: 72000,   CLP: 22500  },
    4: { ARS: 50000,  USD: 32.53,  EUR: 29.05,  BRL: 175.67, MXN: 612,  UYU: 1307, COP: 102900,  CLP: 32100  },
    5: { ARS: 86000,  USD: 55.95,  EUR: 49.96,  BRL: 302.15, MXN: 1053, UYU: 2249, COP: 177000,  CLP: 55200  },
    6: { ARS: 139990, USD: 91.08,  EUR: 81.33,  BRL: 491.83, MXN: 1714, UYU: 3661, COP: 288200,  CLP: 89800  },
  },

  // Alias para retrocompatibilidad
  "ig-seg-premium": {
    0: { ARS: 8900,   USD: 6.38,   EUR: 5.51,   BRL: 34.90,   MXN: 130,  UYU: 239,  COP: 28200,   CLP: 5716   },
    1: { ARS: 12300,  USD: 8.81,   EUR: 7.62,   BRL: 48.30,   MXN: 180,  UYU: 331,  COP: 38900,   CLP: 7899   },
    2: { ARS: 22700,  USD: 16.26,  EUR: 14.07,  BRL: 89.20,   MXN: 332,  UYU: 611,  COP: 71900,   CLP: 14579  },
    3: { ARS: 35000,  USD: 22.77,  EUR: 20.33,  BRL: 122.97, MXN: 429,  UYU: 915,  COP: 72000,   CLP: 22500  },
    4: { ARS: 50000,  USD: 32.53,  EUR: 29.05,  BRL: 175.67, MXN: 612,  UYU: 1307, COP: 102900,  CLP: 32100  },
    5: { ARS: 86000,  USD: 55.95,  EUR: 49.96,  BRL: 302.15, MXN: 1053, UYU: 2249, COP: 177000,  CLP: 55200  },
    6: { ARS: 139990, USD: 91.08,  EUR: 81.33,  BRL: 491.83, MXN: 1714, UYU: 3661, COP: 288200,  CLP: 89800  },
  },

  // Seguidores Latino premium (con garantía)
  // 100 / 500 / 1.000 / 2.500 / 5.000 / 10.000
  "ig-seg-latinos": {
    0: { ARS: 10990,  USD: 7.13,   EUR: 6.40,   BRL: 38.14,  MXN: 133,  UYU: 290,  COP: 22500,  CLP: 7062   },
    1: { ARS: 25990,  USD: 16.86,  EUR: 15.12,  BRL: 90.19,  MXN: 314,  UYU: 680,  COP: 53000,  CLP: 16690  },
    2: { ARS: 42990,  USD: 27.88,  EUR: 25.02,  BRL: 149.18, MXN: 520,  UYU: 1120, COP: 87500,  CLP: 27607  },
    3: { ARS: 86990,  USD: 56.43,  EUR: 50.62,  BRL: 301.87, MXN: 1050, UYU: 2270, COP: 177500, CLP: 55835  },
    4: { ARS: 92990,  USD: 60.32,  EUR: 54.11,  BRL: 322.70, MXN: 1120, UYU: 2430, COP: 189500, CLP: 59687  },
    5: { ARS: 171990, USD: 111.56, EUR: 100.08, BRL: 596.84, MXN: 2080, UYU: 4490, COP: 350500, CLP: 110454 },
  },

  // Seguidores Premium VIP (con garantía)
  // 200 / 500 / 1.000 / 2.500 / 5.000
  "ig-seg-vip": {
    0: { ARS: 8990,   USD: 5.83,  EUR: 5.23,  BRL: 31.11,  MXN: 109,  UYU: 235,  COP: 18300,  CLP: 5775  },
    1: { ARS: 16000,  USD: 10.38, EUR: 9.31,  BRL: 55.36,  MXN: 193,  UYU: 418,  COP: 32600,  CLP: 10275 },
    2: { ARS: 28500,  USD: 18.49, EUR: 16.58, BRL: 98.62,  MXN: 345,  UYU: 744,  COP: 58100,  CLP: 18303 },
    3: { ARS: 57000,  USD: 36.97, EUR: 33.17, BRL: 197.23, MXN: 689,  UYU: 1487, COP: 116200, CLP: 36605 },
    4: { ARS: 100000, USD: 64.86, EUR: 58.19, BRL: 346.02, MXN: 1209, UYU: 2610, COP: 203800, CLP: 64220 },
  },

  // Likes Premium Instagram
  // 250 / 500 / 1.000 / 2.500 / 5.000 / 10.000 / 20.000
  "ig-likes-latinos": {
    0: { ARS: 4500,  USD: 2.92,  EUR: 2.62,  BRL: 15.62, MXN: 54,   UYU: 117,  COP: 9200,   CLP: 2890  },
    1: { ARS: 7300,  USD: 4.74,  EUR: 4.25,  BRL: 25.33, MXN: 88,   UYU: 190,  COP: 14900,  CLP: 4688  },
    2: { ARS: 8300,  USD: 5.38,  EUR: 4.83,  BRL: 29.00, MXN: 101,  UYU: 217,  COP: 16900,  CLP: 5321  },
    3: { ARS: 15500, USD: 10.05, EUR: 9.03,  BRL: 54.00, MXN: 188,  UYU: 405,  COP: 31600,  CLP: 9957  },
    4: { ARS: 28250, USD: 18.32, EUR: 16.46, BRL: 98.00, MXN: 342,  UYU: 738,  COP: 57600,  CLP: 18140 },
    5: { ARS: 54650, USD: 35.45, EUR: 31.83, BRL: 190.00,MXN: 662,  UYU: 1427, COP: 111500, CLP: 35081 },
    6: { ARS: 99400, USD: 64.48, EUR: 57.90, BRL: 346.00,MXN: 1204, UYU: 2595, COP: 202800, CLP: 63835 },
  },

  "ig-likes-latinos-arg": {
    0: { ARS: 4500,  USD: 2.92,  EUR: 2.62,  BRL: 15.62, MXN: 54,   UYU: 117,  COP: 9200,   CLP: 2890  },
    1: { ARS: 7300,  USD: 4.74,  EUR: 4.25,  BRL: 25.33, MXN: 88,   UYU: 190,  COP: 14900,  CLP: 4688  },
    2: { ARS: 8300,  USD: 5.38,  EUR: 4.83,  BRL: 29.00, MXN: 101,  UYU: 217,  COP: 16900,  CLP: 5321  },
    3: { ARS: 15500, USD: 10.05, EUR: 9.03,  BRL: 54.00, MXN: 188,  UYU: 405,  COP: 31600,  CLP: 9957  },
    4: { ARS: 28250, USD: 18.32, EUR: 16.46, BRL: 98.00, MXN: 342,  UYU: 738,  COP: 57600,  CLP: 18140 },
    5: { ARS: 54650, USD: 35.45, EUR: 31.83, BRL: 190.00,MXN: 662,  UYU: 1427, COP: 111500, CLP: 35081 },
    6: { ARS: 99400, USD: 64.48, EUR: 57.90, BRL: 346.00,MXN: 1204, UYU: 2595, COP: 202800, CLP: 63835 },
  },

  // Likes globales Instagram
  // 500 / 1.000 / 2.500 / 5.000 / 10.000 / 50.000
  "ig-likes-globales": {
    0: { ARS: 4700,   USD: 3.06,  EUR: 2.74,  BRL: 16.34,  MXN: 57,   UYU: 117,  COP: 9700,   CLP: 3019  },
    1: { ARS: 6600,   USD: 4.29,  EUR: 3.85,  BRL: 22.94,  MXN: 80,   UYU: 164,  COP: 13600,  CLP: 4238  },
    2: { ARS: 11400,  USD: 7.41,  EUR: 6.65,  BRL: 39.63,  MXN: 138,  UYU: 283,  COP: 23400,  CLP: 7322  },
    3: { ARS: 19900,  USD: 12.94, EUR: 11.61, BRL: 69.17,  MXN: 241,  UYU: 495,  COP: 40900,  CLP: 12780 },
    4: { ARS: 37500,  USD: 24.38, EUR: 21.87, BRL: 130.35, MXN: 455,  UYU: 932,  COP: 77100,  CLP: 24083 },
    5: { ARS: 152000, USD: 98.80, EUR: 88.66, BRL: 528.35, MXN: 1844, UYU: 3778, COP: 312400, CLP: 97614 },
  },

  "ig-likes-mundiales": {
    0: { ARS: 4700,   USD: 3.06,  EUR: 2.74,  BRL: 16.34,  MXN: 57,   UYU: 117,  COP: 9700,   CLP: 3019  },
    1: { ARS: 6600,   USD: 4.29,  EUR: 3.85,  BRL: 22.94,  MXN: 80,   UYU: 164,  COP: 13600,  CLP: 4238  },
    2: { ARS: 11400,  USD: 7.41,  EUR: 6.65,  BRL: 39.63,  MXN: 138,  UYU: 283,  COP: 23400,  CLP: 7322  },
    3: { ARS: 19900,  USD: 12.94, EUR: 11.61, BRL: 69.17,  MXN: 241,  UYU: 495,  COP: 40900,  CLP: 12780 },
    4: { ARS: 37500,  USD: 24.38, EUR: 21.87, BRL: 130.35, MXN: 455,  UYU: 932,  COP: 77100,  CLP: 24083 },
    5: { ARS: 152000, USD: 98.80, EUR: 88.66, BRL: 528.35, MXN: 1844, UYU: 3778, COP: 312400, CLP: 97614 },
  },

  // Visualizaciones Instagram
  // 2.000 / 5.000 / 10.000 / 20.000 / 50.000 / 150.000 / 300.000
  "ig-visualizaciones-videos": {
    0: { ARS: 3500,  USD: 2.28,  EUR: 2.04,  BRL: 12.17,  MXN: 42,  UYU: 91,   COP: 7200,  CLP: 2249  },
    1: { ARS: 5250,  USD: 3.41,  EUR: 3.07,  BRL: 18.26,  MXN: 64,  UYU: 137,  COP: 10700, CLP: 3372  },
    2: { ARS: 7100,  USD: 4.62,  EUR: 4.15,  BRL: 24.70,  MXN: 86,  UYU: 185,  COP: 14500, CLP: 4559  },
    3: { ARS: 9500,  USD: 6.18,  EUR: 5.55,  BRL: 33.05,  MXN: 115, UYU: 248,  COP: 19400, CLP: 6101  },
    4: { ARS: 14100, USD: 9.17,  EUR: 8.23,  BRL: 49.05,  MXN: 171, UYU: 368,  COP: 28900, CLP: 9060  },
    5: { ARS: 28600, USD: 18.60, EUR: 16.70, BRL: 99.49,  MXN: 347, UYU: 747,  COP: 58500, CLP: 18370 },
    6: { ARS: 48600, USD: 31.60, EUR: 28.38, BRL: 169.06, MXN: 589, UYU: 1270, COP: 99400, CLP: 31202 },
  },

  "ig-vistas-reels": {
    0: { ARS: 3500,  USD: 2.28,  EUR: 2.04,  BRL: 12.17,  MXN: 42,  UYU: 91,   COP: 7200,  CLP: 2249  },
    1: { ARS: 5250,  USD: 3.41,  EUR: 3.07,  BRL: 18.26,  MXN: 64,  UYU: 137,  COP: 10700, CLP: 3372  },
    2: { ARS: 7100,  USD: 4.62,  EUR: 4.15,  BRL: 24.70,  MXN: 86,  UYU: 185,  COP: 14500, CLP: 4559  },
    3: { ARS: 9500,  USD: 6.18,  EUR: 5.55,  BRL: 33.05,  MXN: 115, UYU: 248,  COP: 19400, CLP: 6101  },
    4: { ARS: 14100, USD: 9.17,  EUR: 8.23,  BRL: 49.05,  MXN: 171, UYU: 368,  COP: 28900, CLP: 9060  },
    5: { ARS: 28600, USD: 18.60, EUR: 16.70, BRL: 99.49,  MXN: 347, UYU: 747,  COP: 58500, CLP: 18370 },
    6: { ARS: 48600, USD: 31.60, EUR: 28.38, BRL: 169.06, MXN: 589, UYU: 1270, COP: 99400, CLP: 31202 },
  },

  "ig-vistas-historias": {
    0: { ARS: 2500,  USD: 1.79,  EUR: 1.47,  BRL: 9.80,   MXN: 32,  UYU: 71,   COP: 7100,   CLP: 1600  },
    1: { ARS: 4250,  USD: 3.04,  EUR: 2.50,  BRL: 16.70,  MXN: 55,  UYU: 121,  COP: 12100,  CLP: 2720  },
    2: { ARS: 6100,  USD: 4.36,  EUR: 3.59,  BRL: 24.00,  MXN: 78,  UYU: 174,  COP: 17400,  CLP: 3900  },
    3: { ARS: 8500,  USD: 6.07,  EUR: 5.00,  BRL: 33.40,  MXN: 109, UYU: 243,  COP: 24300,  CLP: 5440  },
    4: { ARS: 13100, USD: 9.36,  EUR: 7.70,  BRL: 51.40,  MXN: 168, UYU: 374,  COP: 37400,  CLP: 8380  },
    5: { ARS: 27600, USD: 19.71, EUR: 16.23, BRL: 108.20, MXN: 355, UYU: 789,  COP: 78900,  CLP: 17660 },
    6: { ARS: 47600, USD: 34.00, EUR: 28.00, BRL: 186.70, MXN: 612, UYU: 1360, COP: 136000, CLP: 30460 },
  },

  // Mix de acciones para Instagram (reposts-compartidos-guardados)
  // MIX 1 / MIX 2 / MIX 3 / MIX 4
  "ig-mix-acciones": {
    0: { ARS: 1500,  USD: 0.98, EUR: 0.87, BRL: 5.22,  MXN: 18,  UYU: 39,  COP: 3100,  CLP: 960  },
    1: { ARS: 3000,  USD: 1.95, EUR: 1.74, BRL: 10.43, MXN: 36,  UYU: 78,  COP: 6100,  CLP: 1920 },
    2: { ARS: 5000,  USD: 3.25, EUR: 2.91, BRL: 17.39, MXN: 61,  UYU: 131, COP: 10200, CLP: 3200 },
    3: { ARS: 10000, USD: 6.50, EUR: 5.81, BRL: 34.77, MXN: 121, UYU: 261, COP: 20400, CLP: 6400 },
  },

  "ig-comentarios": {
    0: { ARS: 2500,  USD: 2.27,  EUR: 2.08,  BRL: 10.00,  MXN: 38,  UYU: 89,   COP: 9500,   CLP: 1600 },
    1: { ARS: 3250,  USD: 2.95,  EUR: 2.71,  BRL: 13.00,  MXN: 50,  UYU: 116,  COP: 12350,  CLP: 2080 },
    2: { ARS: 4500,  USD: 4.09,  EUR: 3.75,  BRL: 18.00,  MXN: 69,  UYU: 161,  COP: 17100,  CLP: 2880 },
    3: { ARS: 6000,  USD: 5.45,  EUR: 5.00,  BRL: 24.00,  MXN: 92,  UYU: 214,  COP: 22800,  CLP: 3840 },
    4: { ARS: 20750, USD: 18.86, EUR: 17.29, BRL: 83.00,  MXN: 319, UYU: 741,  COP: 78850,  CLP: 13280},
    5: { ARS: 32000, USD: 29.09, EUR: 26.67, BRL: 128.00, MXN: 492, UYU: 1143, COP: 121600, CLP: 20480},
  },

  "ig-compartidas": {
    0: { ARS: 3000,  USD: 2.73,  EUR: 2.50,  BRL: 12.00,  MXN: 46,  UYU: 107,  COP: 11400,  CLP: 1920 },
    1: { ARS: 4000,  USD: 3.64,  EUR: 3.33,  BRL: 16.00,  MXN: 62,  UYU: 143,  COP: 15200,  CLP: 2560 },
    2: { ARS: 6500,  USD: 5.91,  EUR: 5.42,  BRL: 26.00,  MXN: 100, UYU: 232,  COP: 24700,  CLP: 4160 },
    3: { ARS: 7000,  USD: 6.36,  EUR: 5.83,  BRL: 28.00,  MXN: 108, UYU: 250,  COP: 26600,  CLP: 4480 },
    4: { ARS: 9500,  USD: 8.64,  EUR: 7.92,  BRL: 38.00,  MXN: 146, UYU: 339,  COP: 36100,  CLP: 6080 },
    5: { ARS: 14000, USD: 12.73, EUR: 11.67, BRL: 56.00,  MXN: 215, UYU: 500,  COP: 53200,  CLP: 8960 },
  },

  // ──────────── TIKTOK ────────────

  // Seguidores TikTok
  // 200 / 500 / 1.000 / 2.500 / 5.000 / 10.000 / 20.000
  "tt-seguidores": {
    0: { ARS: 7200,   USD: 4.76,  EUR: 4.06,  BRL: 24.35,  MXN: 82.26,   UYU: 192.73,  COP: 15207,   CLP: 4608  },
    1: { ARS: 9900,   USD: 6.54,  EUR: 5.58,  BRL: 33.48,  MXN: 113.10,  UYU: 264.93,  COP: 20917,   CLP: 6336  },
    2: { ARS: 14500,  USD: 9.59,  EUR: 8.18,  BRL: 49.05,  MXN: 165.65,  UYU: 388.06,  COP: 30636,   CLP: 9280  },
    3: { ARS: 26000,  USD: 17.19, EUR: 14.66, BRL: 87.96,  MXN: 297.09,  UYU: 696.05,  COP: 54927,   CLP: 16640 },
    4: { ARS: 44000,  USD: 29.09, EUR: 24.80, BRL: 148.86, MXN: 502.77,  UYU: 1177.32, COP: 92953,   CLP: 28160 },
    5: { ARS: 60000,  USD: 39.67, EUR: 33.84, BRL: 203.26, MXN: 685.59,  UYU: 1605.43, COP: 126754,  CLP: 38400 },
    6: { ARS: 104000, USD: 68.76, EUR: 58.65, BRL: 352.33, MXN: 1188.36, UYU: 2782.75, COP: 219040,  CLP: 66560 },
  },

  // Likes TikTok
  // 500 / 1.000 / 2.500 / 5.000 / 10.000 / 20.000 / 50.000
  "tt-likes": {
    0: { ARS: 3700,  USD: 2.41,  EUR: 2.16,  BRL: 12.87,  MXN: 45,   UYU: 97,   COP: 7600,   CLP: 2376  },
    1: { ARS: 4900,  USD: 3.19,  EUR: 2.86,  BRL: 17.04,  MXN: 59,   UYU: 128,  COP: 10000,  CLP: 3147  },
    2: { ARS: 8500,  USD: 5.53,  EUR: 4.96,  BRL: 29.57,  MXN: 103,  UYU: 222,  COP: 17400,  CLP: 5459  },
    3: { ARS: 13800, USD: 8.97,  EUR: 8.06,  BRL: 48.00,  MXN: 167,  UYU: 361,  COP: 28200,  CLP: 8863  },
    4: { ARS: 23300, USD: 15.15, EUR: 13.60, BRL: 81.05,  MXN: 283,  UYU: 609,  COP: 47700,  CLP: 14965 },
    5: { ARS: 41300, USD: 26.85, EUR: 24.11, BRL: 143.66, MXN: 501,  UYU: 1079, COP: 84500,  CLP: 26519 },
    6: { ARS: 97300, USD: 63.26, EUR: 56.81, BRL: 338.46, MXN: 1180, UYU: 2542, COP: 199100, CLP: 62486 },
  },

  "tt-visualizaciones": {
    // 2.000 / 5.000 / 10.000 / 20.000 / 50.000 / 150.000 / 300.000
    0: { ARS: 5000,  USD: 3.44,  EUR: 2.92,  BRL: 18.90,  MXN: 61,  UYU: 138, COP: 13380,  CLP: 3200  },
    1: { ARS: 7000,  USD: 4.81,  EUR: 4.09,  BRL: 26.40,  MXN: 86,  UYU: 193, COP: 18730,  CLP: 4480  },
    2: { ARS: 10000, USD: 6.87,  EUR: 5.84,  BRL: 37.70,  MXN: 123, UYU: 276, COP: 26760,  CLP: 6400  },
    3: { ARS: 15000, USD: 10.31, EUR: 8.76,  BRL: 56.60,  MXN: 184, UYU: 414, COP: 40140,  CLP: 9600  },
    4: { ARS: 27000, USD: 18.56, EUR: 15.76, BRL: 101.90, MXN: 332, UYU: 744, COP: 72250,  CLP: 17280 },
    5: { ARS: 37000, USD: 25.43, EUR: 21.65, BRL: 139.60, MXN: 455, UYU: 1020,COP: 98990,  CLP: 23680 },
    6: { ARS: 57000, USD: 39.18, EUR: 33.40, BRL: 215.10, MXN: 701, UYU: 1572,COP: 152530, CLP: 36480 },
  },

  // ──────────── FACEBOOK ────────────

  // Seguidores Facebook
  // 500 / 1.000 / 2.500 / 5.000 / 10.000 / 20.000 / 50.000
  "fb-seguidores": {
    0: { ARS: 4100,   USD: 2.66,  EUR: 2.39,  BRL: 14.23,  MXN: 50,   UYU: 107,  COP: 8400,   CLP: 2633  },
    1: { ARS: 5700,   USD: 3.70,  EUR: 3.32,  BRL: 19.78,  MXN: 69,   UYU: 149,  COP: 11600,  CLP: 3661  },
    2: { ARS: 10700,  USD: 6.94,  EUR: 6.23,  BRL: 37.13,  MXN: 129,  UYU: 279,  COP: 21800,  CLP: 6872  },
    3: { ARS: 17900,  USD: 11.61, EUR: 10.43, BRL: 62.11,  MXN: 217,  UYU: 467,  COP: 36500,  CLP: 11495 },
    4: { ARS: 30900,  USD: 20.04, EUR: 18.00, BRL: 107.23, MXN: 374,  UYU: 805,  COP: 63100,  CLP: 19844 },
    5: { ARS: 56900,  USD: 36.91, EUR: 33.14, BRL: 197.45, MXN: 688,  UYU: 1483, COP: 116100, CLP: 36547 },
    6: { ARS: 126900, USD: 82.31, EUR: 73.91, BRL: 440.36, MXN: 1535, UYU: 3307, COP: 259000, CLP: 81492 },
  },

  // Likes/reacciones Facebook
  // 200 / 500 / 1.000 / 2.500 / 5.000 / 10.000 / 20.000
  "fb-likes-post": {
    0: { ARS: 3900,  USD: 2.53,  EUR: 2.27,  BRL: 13.53,  MXN: 47,   UYU: 102,  COP: 8000,   CLP: 2504  },
    1: { ARS: 5500,  USD: 3.57,  EUR: 3.20,  BRL: 19.09,  MXN: 67,   UYU: 143,  COP: 11200,  CLP: 3532  },
    2: { ARS: 8500,  USD: 5.51,  EUR: 4.95,  BRL: 29.50,  MXN: 103,  UYU: 222,  COP: 17400,  CLP: 5459  },
    3: { ARS: 16900, USD: 10.96, EUR: 9.84,  BRL: 58.64,  MXN: 204,  UYU: 440,  COP: 34500,  CLP: 10853 },
    4: { ARS: 29500, USD: 19.13, EUR: 17.18, BRL: 102.37, MXN: 357,  UYU: 769,  COP: 60200,  CLP: 18940 },
    5: { ARS: 51900, USD: 33.66, EUR: 30.23, BRL: 180.10, MXN: 628,  UYU: 1353, COP: 105900, CLP: 33330 },
    6: { ARS: 97000, USD: 62.92, EUR: 56.50, BRL: 336.60, MXN: 1173, UYU: 2528, COP: 198000, CLP: 62293 },
  },

  // ──────────── YOUTUBE ────────────

  "yt-subscriptores": {
    // 100 / 200 / 300 / 500 / 1.000 / 1.500 / 2.000
    0: { ARS: 19500,  USD: 13.93, EUR: 11.98, BRL: 76.60,  MXN: 251,  UYU: 557,  COP: 55700,  CLP: 12480 },
    1: { ARS: 34000,  USD: 24.29, EUR: 20.89, BRL: 133.60, MXN: 437,  UYU: 971,  COP: 97100,  CLP: 21760 },
    2: { ARS: 48000,  USD: 34.29, EUR: 29.49, BRL: 188.60, MXN: 617,  UYU: 1371, COP: 137100, CLP: 30720 },
    3: { ARS: 74500,  USD: 53.21, EUR: 45.76, BRL: 292.70, MXN: 958,  UYU: 2129, COP: 212900, CLP: 47680 },
    4: { ARS: 119000, USD: 85.00, EUR: 73.10, BRL: 467.50, MXN: 1530, UYU: 3400, COP: 340000, CLP: 76160 },
    5: { ARS: 167000, USD: 119.29,EUR: 102.59,BRL: 656.10, MXN: 2147, UYU: 4771, COP: 477100, CLP: 106880},
    6: { ARS: 211000, USD: 150.71,EUR: 129.61,BRL: 828.90, MXN: 2713, UYU: 6029, COP: 602900, CLP: 135040},
  },

  "yt-suscriptores-canales": {
    0: { ARS: 19500,  USD: 13.93, EUR: 11.98, BRL: 76.60,  MXN: 251,  UYU: 557,  COP: 55700,  CLP: 12480 },
    1: { ARS: 34000,  USD: 24.29, EUR: 20.89, BRL: 133.60, MXN: 437,  UYU: 971,  COP: 97100,  CLP: 21760 },
    2: { ARS: 48000,  USD: 34.29, EUR: 29.49, BRL: 188.60, MXN: 617,  UYU: 1371, COP: 137100, CLP: 30720 },
    3: { ARS: 74500,  USD: 53.21, EUR: 45.76, BRL: 292.70, MXN: 958,  UYU: 2129, COP: 212900, CLP: 47680 },
    4: { ARS: 119000, USD: 85.00, EUR: 73.10, BRL: 467.50, MXN: 1530, UYU: 3400, COP: 340000, CLP: 76160 },
    5: { ARS: 167000, USD: 119.29,EUR: 102.59,BRL: 656.10, MXN: 2147, UYU: 4771, COP: 477100, CLP: 106880},
    6: { ARS: 211000, USD: 150.71,EUR: 129.61,BRL: 828.90, MXN: 2713, UYU: 6029, COP: 602900, CLP: 135040},
  },

  "yt-likes-megusta": {
    // 100 / 200 / 500 / 1.000 / 2.500 / 5.000 / 10.000
    0: { ARS: 2000,  USD: 1.43,  EUR: 1.25,  BRL: 7.86,   MXN: 26,  UYU: 56,   COP: 5571,   CLP: 1280  },
    1: { ARS: 2900,  USD: 2.07,  EUR: 1.81,  BRL: 11.39,  MXN: 38,  UYU: 81,   COP: 8079,   CLP: 1856  },
    2: { ARS: 5500,  USD: 3.93,  EUR: 3.44,  BRL: 21.61,  MXN: 73,  UYU: 307,  COP: 15321,  CLP: 3520  },
    3: { ARS: 9500,  USD: 6.79,  EUR: 5.94,  BRL: 37.32,  MXN: 126, UYU: 529,  COP: 26464,  CLP: 6080  },
    4: { ARS: 19600, USD: 14.00, EUR: 12.25, BRL: 76.96,  MXN: 259, UYU: 1091, COP: 54643,  CLP: 12544 },
    5: { ARS: 32600, USD: 23.29, EUR: 20.38, BRL: 128.00, MXN: 431, UYU: 1814, COP: 90857,  CLP: 20864 },
    6: { ARS: 59600, USD: 42.57, EUR: 37.25, BRL: 234.29, MXN: 788, UYU: 3314, COP: 166143, CLP: 38144 },
  },

  "yt-likes-videos-shorts": {
    0: { ARS: 2000,  USD: 1.43,  EUR: 1.25,  BRL: 7.86,   MXN: 26,  UYU: 56,   COP: 5571,   CLP: 1280  },
    1: { ARS: 2900,  USD: 2.07,  EUR: 1.81,  BRL: 11.39,  MXN: 38,  UYU: 81,   COP: 8079,   CLP: 1856  },
    2: { ARS: 5500,  USD: 3.93,  EUR: 3.44,  BRL: 21.61,  MXN: 73,  UYU: 307,  COP: 15321,  CLP: 3520  },
    3: { ARS: 9500,  USD: 6.79,  EUR: 5.94,  BRL: 37.32,  MXN: 126, UYU: 529,  COP: 26464,  CLP: 6080  },
    4: { ARS: 19600, USD: 14.00, EUR: 12.25, BRL: 76.96,  MXN: 259, UYU: 1091, COP: 54643,  CLP: 12544 },
    5: { ARS: 32600, USD: 23.29, EUR: 20.38, BRL: 128.00, MXN: 431, UYU: 1814, COP: 90857,  CLP: 20864 },
    6: { ARS: 59600, USD: 42.57, EUR: 37.25, BRL: 234.29, MXN: 788, UYU: 3314, COP: 166143, CLP: 38144 },
  },

  "yt-visitas-mundiales": {
    // 1.000 / 2.500 / 5.000 / 10.000 / 20.000 / 50.000
    0: { ARS: 5400,   USD: 3.86,   EUR: 3.33,  BRL: 21.20,  MXN: 79,   UYU: 145,  COP: 17100,  CLP: 3456  },
    1: { ARS: 12750,  USD: 9.12,   EUR: 7.87,  BRL: 50.10,  MXN: 186,  UYU: 343,  COP: 40300,  CLP: 8160  },
    2: { ARS: 24000,  USD: 17.18,  EUR: 14.85, BRL: 94.30,  MXN: 351,  UYU: 646,  COP: 75900,  CLP: 15360 },
    3: { ARS: 45000,  USD: 32.20,  EUR: 27.85, BRL: 176.80, MXN: 658,  UYU: 1211, COP: 142400, CLP: 28800 },
    4: { ARS: 84000,  USD: 60.10,  EUR: 51.95, BRL: 330.00, MXN: 1228, UYU: 2261, COP: 265800, CLP: 53760 },
    5: { ARS: 156000, USD: 111.70, EUR: 96.49, BRL: 612.80, MXN: 2281, UYU: 4199, COP: 493900, CLP: 99840 },
  },

  "yt-visitas-argentinas": {
    // 500 / 1.000 / 2.500 / 5.000 / 10.000 / 25.000
    0: { ARS: 7500,   USD: 5.37,   EUR: 4.64,   BRL: 29.50,   MXN: 110,  UYU: 202,   COP: 23700,   CLP: 4800   },
    1: { ARS: 15000,  USD: 10.74,  EUR: 9.28,   BRL: 58.90,   MXN: 219,  UYU: 404,   COP: 47500,   CLP: 9600   },
    2: { ARS: 37500,  USD: 26.84,  EUR: 23.20,  BRL: 147.30,  MXN: 548,  UYU: 1010,  COP: 118700,  CLP: 24000  },
    3: { ARS: 75000,  USD: 53.69,  EUR: 46.40,  BRL: 294.60,  MXN: 1096, UYU: 2019,  COP: 237500,  CLP: 48000  },
    4: { ARS: 150000, USD: 107.37, EUR: 92.81,  BRL: 589.20,  MXN: 2193, UYU: 4038,  COP: 474900,  CLP: 96000  },
    5: { ARS: 375000, USD: 268.43, EUR: 232.03, BRL: 1473.00, MXN: 5481, UYU: 10096, COP: 1187200, CLP: 240000 },
  },

  "yt-comentarios": {
    0: { ARS: 4500,   USD: 4.09,  EUR: 3.75,  BRL: 18.00,  MXN: 69,   UYU: 161,  COP: 17100,  CLP: 2880 },
    1: { ARS: 8250,   USD: 7.50,  EUR: 6.88,  BRL: 33.00,  MXN: 127,  UYU: 295,  COP: 31350,  CLP: 5280 },
    2: { ARS: 14500,  USD: 13.18, EUR: 12.08, BRL: 58.00,  MXN: 223,  UYU: 518,  COP: 55100,  CLP: 9280 },
    3: { ARS: 24500,  USD: 22.27, EUR: 20.42, BRL: 98.00,  MXN: 377,  UYU: 875,  COP: 93100,  CLP: 15680},
    4: { ARS: 55125,  USD: 50.11, EUR: 45.94, BRL: 220.50, MXN: 848,  UYU: 1969, COP: 209475, CLP: 35280},
    5: { ARS: 102000, USD: 92.73, EUR: 85.00, BRL: 408.00, MXN: 1569, UYU: 3643, COP: 387600, CLP: 65280},
  },

  "yt-espectadores": {
    0: { ARS: 6990,  USD: 6.35,  EUR: 5.83,  BRL: 27.96,  MXN: 108, UYU: 250,  COP: 26562,  CLP: 4474 },
    1: { ARS: 11490, USD: 10.45, EUR: 9.58,  BRL: 45.96,  MXN: 177, UYU: 410,  COP: 43662,  CLP: 7354 },
    2: { ARS: 15790, USD: 14.35, EUR: 13.16, BRL: 63.16,  MXN: 243, UYU: 564,  COP: 60002,  CLP: 10106},
    3: { ARS: 19590, USD: 17.81, EUR: 16.33, BRL: 78.36,  MXN: 301, UYU: 700,  COP: 74442,  CLP: 12538},
    4: { ARS: 23190, USD: 21.08, EUR: 19.33, BRL: 92.76,  MXN: 357, UYU: 828,  COP: 88122,  CLP: 14842},
    5: { ARS: 35990, USD: 32.72, EUR: 29.99, BRL: 143.96, MXN: 554, UYU: 1285, COP: 136762, CLP: 23034},
  },

  // ──────────── SPOTIFY ────────────

  "sp-reproducciones-mundiales": {
    0: { ARS: 6000,   USD: 5.45,   EUR: 5.00,   BRL: 24.00,  MXN: 92,   UYU: 214,  COP: 22800,  CLP: 3840  },
    1: { ARS: 11000,  USD: 10.00,  EUR: 9.17,  BRL: 44.00,  MXN: 169,  UYU: 393,  COP: 41800,  CLP: 7040  },
    2: { ARS: 19000,  USD: 17.27,  EUR: 15.83, BRL: 76.00,  MXN: 292,  UYU: 679,  COP: 72200,  CLP: 12160 },
    3: { ARS: 34000,  USD: 30.91,  EUR: 28.33, BRL: 136.00, MXN: 523,  UYU: 1214, COP: 129200, CLP: 21760 },
    4: { ARS: 72000,  USD: 65.45,  EUR: 60.00, BRL: 288.00, MXN: 1108, UYU: 2571, COP: 273600, CLP: 46080 },
    5: { ARS: 132000, USD: 120.00, EUR: 110.00,BRL: 528.00, MXN: 2031, UYU: 4714, COP: 501600, CLP: 84480 },
  },

  "sp-reproducciones-argentinas": {
    0: { ARS: 12000,  USD: 10.91,  EUR: 10.00,  BRL: 48.00,   MXN: 185,  UYU: 429,   COP: 45600,   CLP: 7680   },
    1: { ARS: 24500,  USD: 22.27,  EUR: 20.42,  BRL: 98.00,   MXN: 377,  UYU: 875,   COP: 93100,   CLP: 15680  },
    2: { ARS: 44500,  USD: 40.45,  EUR: 37.08,  BRL: 178.00,  MXN: 685,  UYU: 1589,  COP: 169100,  CLP: 28480  },
    3: { ARS: 82000,  USD: 74.55,  EUR: 68.33,  BRL: 328.00,  MXN: 1262, UYU: 2929,  COP: 311600,  CLP: 52480  },
    4: { ARS: 189500, USD: 172.27, EUR: 157.92, BRL: 758.00,  MXN: 2915, UYU: 6768,  COP: 720100,  CLP: 121280 },
    5: { ARS: 352000, USD: 320.00, EUR: 293.33, BRL: 1408.00, MXN: 5415, UYU: 12571, COP: 1337600, CLP: 225280 },
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
  if (currency === "CLP") return Math.round(baseArsPrice * 0.64);
  return baseArsPrice;
}
