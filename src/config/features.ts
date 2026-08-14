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
