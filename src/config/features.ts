/**
 * Ujawnianie powiązań produkcyjnych (OEM) — kto fizycznie produkuje dla której
 * marki.
 *
 * Wyłączone z powodów prawnych: te twierdzenia opierały się na wiedzy
 * branżowej, do której nie da się wskazać źródła. Dopóki każde z nich nie
 * będzie miało odnośnika, nie pokazujemy ich publicznie.
 *
 * Samo ukrycie w interfejsie nie wystarczyłoby — dataset.json trafia do bundla
 * JS i do plików .rsc obok prerenderowanego HTML-a, więc dane byłyby do
 * odczytania mimo niewidocznego UI. Dlatego zostały wyjęte z datasetu do
 * src/data/oem-reserved.json, którego nie importuje żaden moduł aplikacji.
 *
 * Przywrócenie wymaga obu kroków:
 *   1. node scratch/split-oem.js --restore
 *   2. SHOW_OEM = true
 */
export const SHOW_OEM = false;

/**
 * Linki afiliacyjne w panelu marki i na podstronach.
 *
 * Wyłączone: żaden program partnerski nie jest jeszcze podpięty, więc linki
 * nie zarabiają, a wymuszają obowiązek informacyjny wobec konsumenta. Dane
 * (`monetization`) zostają w datasecie — nic nie jest renderowane, więc nie
 * dochodzi do komunikacji handlowej.
 */
export const SHOW_AFFILIATE = false;

/**
 * Logotypy marek z /public/brandsicons.
 *
 * Wyłączone: komplet jest niepełny (działa 65 ze 175 marek), więc mapa i tak
 * była mieszanką logotypów i inicjałów. Do czasu uzupełnienia wszystkie marki
 * pokazują inicjał — spójnie i bez użycia cudzych znaków towarowych obok
 * treści komercyjnych. Pliki zostają w repozytorium, po prostu nikt ich nie
 * wskazuje.
 */
export const SHOW_BRAND_LOGOS = false;
