# Weryfikacja datasetu

**175 marek** i **0 producentów** do przejścia.
Każda pozycja ma wypisany komplet tego, co jest w bazie, listę brakujących pól
i gotowe linki do Wikipedii, Ceneo i wyszukiwarki.

Pliki są pogrupowane po koncernach — w obrębie grupy źródła zwykle się pokrywają,
więc najszybciej idzie jedna grupa za jednym posiedzeniem. Odhaczaj `- [ ]`
w miarę sprawdzania.

⚠️ oznacza wartość, którą wstawiła migracja automatycznie i której **nikt jeszcze
nie potwierdził** — tam zaczynaj, jeśli chcesz szybkiego zwrotu.

Przegenerowanie po poprawkach (nadpisze pliki, więc najpierw scommituj odhaczenia):

```bash
node scratch/gen-weryfikacja.js
```

---

| # | Grupa | Marek | Do potwierdzenia |
| --- | --- | ---: | ---: |
| 1 | [Marki polskie](01-marki-polskie.md) | 35 | 28 |
| 2 | [Marki włoskie](02-marki-wloskie.md) | 16 | 9 |
| 3 | [Pozostałe marki](03-pozostale-marki.md) | 16 | 13 |
| 4 | [Marki niemieckie](04-marki-niemieckie.md) | 15 | 10 |
| 5 | [Marki Marketowe](05-marki-marketowe.md) | 11 | 7 |
| 6 | [Beko Europe](06-beko-europe.md) | 10 | — |
| 7 | [Marki chińskie](07-marki-chinskie.md) | 10 | 8 |
| 8 | [Marki hiszpańskie](08-marki-hiszpanskie.md) | 9 | 9 |
| 9 | [Marki francuskie](09-marki-francuskie.md) | 7 | 7 |
| 10 | [BSH Group](10-bsh-group.md) | 5 | — |
| 11 | [Amica Group](11-amica-group.md) | 5 | — |
| 12 | [Haier Europe](12-haier-europe.md) | 4 | — |
| 13 | [Hisense Group](13-hisense-group.md) | 4 | — |
| 14 | [Midea Group](14-midea-group.md) | 4 | 1 |
| 15 | [Electrolux Group](15-electrolux-group.md) | 3 | — |
| 16 | [Vestel](16-vestel.md) | 3 | — |
| 17 | [Marki japońskie](17-marki-japonskie.md) | 3 | — |
| 18 | [Marki brytyjskie](18-marki-brytyjskie.md) | 3 | 3 |
| 19 | [HP Tronic](19-hp-tronic.md) | 3 | 3 |
| 20 | [Cevital Group](20-cevital-group.md) | 2 | 2 |
| 21 | [Xiaomi Corporation](21-xiaomi-corporation.md) | 2 | 2 |
| 22 | [Grupa MPM](22-grupa-mpm.md) | 2 | 1 |
| 23 | [Samsung Electronics](23-samsung-electronics.md) | 1 | — |
| 24 | [LG Electronics](24-lg-electronics.md) | 1 | — |
| 25 | [Marki słoweńskie](25-marki-slowenskie.md) | 1 | 1 |
| — | [Producenci OEM](99-producenci-oem.md) | 0 | 0 |

**Razem: 175 marek, z czego 104 z niepotwierdzoną wartością.**

---

## Czego świadomie nie wypisuję

`monetization` (linki zakupowe) brakuje u 162 z 175 marek, więc na każdej
pozycji byłby tylko szumem. To decyzja biznesowa, nie brak danych — uzupełniaj
wtedy, kiedy będziesz podpinać afiliację.
