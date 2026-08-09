# Weryfikacja datasetu

Lista kontrolna wygenerowana ze zbioru — nie pisana ręcznie, więc liczby się zgadzają.
Przegenerujesz ją w każdej chwili:

```bash
node scratch/gen-weryfikacja.js
```

**Jak z tego korzystać:** idź sekcjami od góry. Sekcje 1–3 to rzeczy, które
wstawiła migracja automatycznie albo zostawiła jawnie nieuzupełnione — tam
ryzyko błędu jest największe. Sekcje 4–6 to kosmetyka, którą można robić
kiedykolwiek. Odhaczaj `[x]` w miarę sprawdzania; plik jest w repo, więc
historia zmian sama się zapisze.

Każda pozycja ma w nawiasie identyfikator węzła — po nim znajdziesz wpis
w `src/data/dataset.json`.

---

**Łącznie do sprawdzenia: 163 pozycji**

| Sekcja | Pozycji |
| --- | ---: |
| [1. Jawne zastępniki i niewiadome](#zastepniki) | 10 |
| [2.1 Wygenerowani producenci — partia 1](#producenci-1) | 16 |
| [2.2 Wygenerowani producenci — partia 2](#producenci-2) | 16 |
| [2.3 Wygenerowani producenci — partia 3](#producenci-3) | 13 |
| [3.1 Przypisane do „Polskie Marki Niezależne” po pochodzeniu](#pochodzenie-1) | 13 |
| [3.2 Przypisane do „Pozostałe Marki Niezależne” po pochodzeniu](#pochodzenie-2) | 13 |
| [3.3 Przypisane do „Niemieckie Marki Niezależne” po pochodzeniu](#pochodzenie-3) | 9 |
| [3.4 Przypisane do „Marki hiszpańskie” po pochodzeniu](#pochodzenie-4) | 9 |
| [3.5 Przypisane do „Włoskie Marki Niezależne” po pochodzeniu](#pochodzenie-5) | 8 |
| [3.6 Przypisane do „Marki francuskie” po pochodzeniu](#pochodzenie-6) | 7 |
| [3.7 Przypisane do „Chińskie Marki Niezależne” po pochodzeniu](#pochodzenie-7) | 7 |
| [3.8 Przypisane do „Marki brytyjskie” po pochodzeniu](#pochodzenie-8) | 3 |
| [4. Marki własne sieci handlowych](#marki-wlasne) | 7 |
| [5. Brakujące pliki logotypów](#logotypy) | 28 |
| [6. Drobiazgi](#drobiazgi) | 4 |

---

<a id="zastepniki"></a>

## 1. Jawne zastępniki i niewiadome

> Wpisy, przy których migracja **wprost przyznała, że nie wie**. Najkrótsza lista i najwyższy zwrot — po jej domknięciu nic w bazie nie udaje wiedzy, której nie ma.

**Pozycji: 10**

- [ ] **Producenci kontraktowi (Chiny)** (`m-oem-china`) — 9 marek: Malatec, Bright, Berdsen, VidaXL, Amzchef, Covercook, Hobsir, Vovv, TopStrong
      <br>Ustal realnego producenta dla każdej z nich albo potwierdź, że zostaje zbiorczo.
- [ ] **Producenci kontraktowi (różni)** (`m-oem-various`) — 6 marek: Daewoo, Arset, Fenu, Iceberg, Neto, Smartcook
      <br>Ustal realnego producenta dla każdej z nich albo potwierdź, że zostaje zbiorczo.
- [ ] **Producenci kontraktowi (Turcja)** (`m-oem-turkey`) — 1 marek: Stella
      <br>Ustal realnego producenta dla każdej z nich albo potwierdź, że zostaje zbiorczo.
- [ ] **Producent nieustalony** (`m-id-unknown`) — 4 marek: De Noble & Foster, Freggia, Schild, KAGE
      <br>Ustal realnego producenta dla każdej z nich albo potwierdź, że zostaje zbiorczo.
- [ ] **ERS Group** (`m-ers-group`) — kraj `Nieznany`, produkuje dla: Heinrich'S
      <br>Ustal kraj (teraz UI pokazuje globus zamiast flagi).
- [ ] **Producent nieustalony** (`m-id-unknown`) — kraj `Nieznany`, produkuje dla: De Noble & Foster, Freggia, Schild, KAGE
      <br>Ustal kraj (teraz UI pokazuje globus zamiast flagi).
- [ ] **LS Group** (`m-ls-group`) — kraj `Nieznany`, produkuje dla: Cavin
      <br>Ustal kraj (teraz UI pokazuje globus zamiast flagi).
- [ ] **NEG / Novex** (`m-neg-novex`) — kraj `Nieznany`, produkuje dla: Respekta
      <br>Ustal kraj (teraz UI pokazuje globus zamiast flagi).
- [ ] **Sonifer SA** (`m-sonifer-sa`) — kraj `Nieznany`, produkuje dla: Orbegozo
      <br>Ustal kraj (teraz UI pokazuje globus zamiast flagi).
- [ ] **Sprzeczność BORA** — marka `b-bora` ma `origin: "Niemcy"`, producent `m-bora-holding` ma `country: "Austria"`
      <br>Jedno z dwóch jest błędne. Rozstrzygnij i wyrównaj.

<a id="producenci-1"></a>

## 2.1 Wygenerowani producenci — partia 1

> Nazwy odtworzone z identyfikatorów w `producedBy`, kraje uzupełnione tam, gdzie były pewne. Sprawdź, czy podmiot **naprawdę tak się nazywa** i czy faktycznie jest producentem, a nie tylko dystrybutorem albo właścicielem marki.

**Pozycji: 16**

- [ ] **Frio Group** (`m-frio-group`) — Francja — dla: Avintage, Climadiff, La Sommelière, Le Cellier
- [ ] **CNA Group** (`m-cna-group`) — Hiszpania — dla: Cata, Nodor, Cata & Can Roca
- [ ] **Cdiscount Group** (`m-cdiscount-group`) — Francja — dla: Continental Edison, Oceanic
- [ ] **Clatronic Group** (`m-clatronic-group`) — Niemcy — dla: Bomann, Clatronic
- [ ] **Elica Group** (`m-elica-group`) — Włochy — dla: Airforce, TurboAir
- [ ] **Kingfisher plc** (`m-kingfisher-plc`) — Wielka Brytania — dla: GoodHome, Cooke & Lewis
- [ ] **Middleby Corp** (`m-middleby-corp`) — USA — dla: Falcon, Novy
- [ ] **Winia Electronics** (`m-winia-electronics`) — Korea Południowa — dla: Winia, Daewoo
- [ ] **Bora Holding** (`m-bora-holding`) — Austria — dla: BORA
- [ ] **Braukmann Gmbh** (`m-braukmann-gmbh`) — Niemcy — dla: Caso
- [ ] **Canbolat Vertriebs** (`m-canbolat-vertriebs`) — Niemcy — dla: AREBOS
- [ ] **Cecotec Innovaciones** (`m-cecotec-innovaciones`) — Hiszpania — dla: Cecotec
- [ ] **Ciarko (Sanok)** (`m-ciarko-sanok`) — Polska — dla: Ciarko
- [ ] **Ciarra Appliances** (`m-ciarra-appliances`) — Chiny — dla: Ciarra
- [ ] **Delta France** (`m-delta-france`) — Francja — dla: Livoo
- [ ] **Dometic Group** (`m-dometic-group`) — Szwecja — dla: Dometic

<a id="producenci-2"></a>

## 2.2 Wygenerowani producenci — partia 2

> Ciąg dalszy poprzedniej partii — ten sam rodzaj sprawdzenia.

**Pozycji: 16**

- [ ] **Dunavox Europe** (`m-dunavox-europe`) — Węgry — dla: Dunavox
- [ ] **Electrolux** (`m-electrolux`) — Szwecja — dla: Ikea
- [ ] **Focus AGD** (`m-focus-agd`) — Polska — dla: Focus
- [ ] **Franke Group** (`m-franke-group`) — Szwajcaria — dla: Mepamsa
- [ ] **Galvamet (Włochy)** (`m-galvamet-italy`) — Włochy — dla: Galvamet
- [ ] **Hendi Group** (`m-hendi-group`) — Holandia — dla: Hendi
- [ ] **JP Industries** (`m-jp-industries`) — Włochy — dla: Ardo
- [ ] **Klima Classic** (`m-klima-classic`) — Czechy — dla: Guzzanti
- [ ] **Kuchinox Polska** (`m-kuchinox-polska`) — Polska — dla: Kuchinox
- [ ] **Lacor Menaje Profesional** (`m-lacor-menaje`) — Hiszpania — dla: Lacor
- [ ] **M SAN Grupa** (`m-m-san-grupa`) — Chorwacja — dla: Vivax
- [ ] **Melchioni S.p.A.** (`m-melchioni-spa`) — Włochy — dla: Melchioni
- [ ] **Nortek Global** (`m-nortek-global`) — USA — dla: Best
- [ ] **Novoterm (Szczecin)** (`m-novoterm-szczecin`) — Polska — dla: Novoterm
- [ ] **OBI Group** (`m-obi-group`) — Niemcy — dla: OBI
- [ ] **Olan Haushaltsgeräte** (`m-olan-haushaltsgerate`) — Niemcy — dla: Kaiser

<a id="producenci-3"></a>

## 2.3 Wygenerowani producenci — partia 3

> Ciąg dalszy poprzedniej partii — ten sam rodzaj sprawdzenia.

**Pozycji: 13**

- [ ] **Otto Group** (`m-otto-group`) — Niemcy — dla: Hanseatic
- [ ] **PKM GmbH** (`m-pkm-gmbh`) — Niemcy — dla: PKM
- [ ] **Pyramis Metallourgia** (`m-pyramis-metallourgia`) — Grecja — dla: Pyramis
- [ ] **Schwarz Gruppe** (`m-schwarz-gruppe`) — Niemcy — dla: Silvercrest
- [ ] **Silva-Schneider** (`m-silva-schneider`) — Austria — dla: Silva Homeline
- [ ] **Simfer A.Ş.** (`m-simfer-as`) — Turcja — dla: Simfer
- [ ] **Taurus Group** (`m-taurus-group`) — Hiszpania — dla: Taurus
- [ ] **Teka Group** (`m-teka-group`) — Hiszpania — dla: Küppersbusch
- [ ] **Thetford Corp** (`m-thetford-corp`) — USA — dla: Thetford
- [ ] **Tognana S.p.A.** (`m-tognana-spa`) — Włochy — dla: Tognana
- [ ] **Vevor Group** (`m-vevor-group`) — Chiny — dla: VEVOR
- [ ] **Vitrokitchen (Hiszpania)** (`m-vitrokitchen-spain`) — Hiszpania — dla: Vitrokitchen
- [ ] **Whirlpool Corporation (USA)** (`m-whirlpool-usa`) — USA — dla: KitchenAid

<a id="pochodzenie-1"></a>

## 3.1 Przypisane do „Polskie Marki Niezależne” po pochodzeniu

> Te marki nie miały w bazie żadnego właściciela, więc migracja wrzuciła je do kubełka **wyłącznie na podstawie pola `origin`**. To zgadywanie: jeśli marka ma realnego właściciela, przepnij ją pod niego.

**Pozycji: 13**

- [ ] **Malatec** (`b-malatec`) — origin: Polska — produkuje: Producenci kontraktowi (Chiny)
- [ ] **Berdsen** (`b-berdsen`) — origin: Polska — produkuje: Producenci kontraktowi (Chiny)
- [ ] **Focus** (`b-focus`) — origin: Polska — produkuje: Focus AGD
- [ ] **Kuchinox** (`b-kuchinox`) — origin: Polska — produkuje: Kuchinox Polska
- [ ] **Schild** (`b-schild`) — origin: Polska / Szwajcaria (Design) — produkuje: Producent nieustalony
- [ ] **Arset** (`b-arset`) — origin: Polska — produkuje: Producenci kontraktowi (różni)
- [ ] **Fenu** (`b-fenu`) — origin: Polska / Chiny — produkuje: Producenci kontraktowi (różni)
- [ ] **Iceberg** (`b-iceberg`) — origin: Polska — produkuje: Producenci kontraktowi (różni)
- [ ] **KAGE** (`b-kage`) — origin: Polska / Europa — produkuje: Producent nieustalony
- [ ] **Neto** (`b-neto`) — origin: Polska — produkuje: Producenci kontraktowi (różni)
- [ ] **Novoterm** (`b-novoterm`) — origin: Polska — produkuje: Novoterm (Szczecin)
- [ ] **Smartcook** (`b-smartcook`) — origin: Polska / Europa — produkuje: Producenci kontraktowi (różni)
- [ ] **Stella** (`b-stella`) — origin: Polska / Turcja — produkuje: Producenci kontraktowi (Turcja)

<a id="pochodzenie-2"></a>

## 3.2 Przypisane do „Pozostałe Marki Niezależne” po pochodzeniu

> Te marki nie miały w bazie żadnego właściciela, więc migracja wrzuciła je do kubełka **wyłącznie na podstawie pola `origin`**. To zgadywanie: jeśli marka ma realnego właściciela, przepnij ją pod niego.

**Pozycji: 13**

- [ ] **Pyramis** (`b-pyramis`) — origin: Grecja — produkuje: Pyramis Metallourgia
- [ ] **Thetford** (`b-thetford`) — origin: USA / Holandia — produkuje: Thetford Corp
- [ ] **Vivax** (`b-vivax`) — origin: Chorwacja — produkuje: M SAN Grupa
- [ ] **Dometic** (`b-dometic`) — origin: Szwecja — produkuje: Dometic Group
- [ ] **Winia** (`b-winia`) — origin: Korea Południowa — produkuje: Winia Electronics
- [ ] **Cavin** (`b-cavin`) — origin: Szwecja — produkuje: LS Group
- [ ] **Dunavox** (`b-dunavox`) — origin: Węgry — produkuje: Dunavox Europe
- [ ] **Silva Homeline** (`b-silva-homeline`) — origin: Austria — produkuje: Silva-Schneider
- [ ] **Guzzanti** (`b-guzzanti`) — origin: Czechy — produkuje: Klima Classic
- [ ] **Hendi** (`b-hendi`) — origin: Holandia — produkuje: Hendi Group
- [ ] **Novy** (`b-novy`) — origin: Belgia — produkuje: Middleby Corp
- [ ] **Daewoo** (`b-daewoo`) — origin: Korea Południowa — produkuje: Winia Electronics, Producenci kontraktowi (różni)
- [ ] **Simfer** (`b-simfer`) — origin: Turcja — produkuje: Simfer A.Ş.

<a id="pochodzenie-3"></a>

## 3.3 Przypisane do „Niemieckie Marki Niezależne” po pochodzeniu

> Te marki nie miały w bazie żadnego właściciela, więc migracja wrzuciła je do kubełka **wyłącznie na podstawie pola `origin`**. To zgadywanie: jeśli marka ma realnego właściciela, przepnij ją pod niego.

**Pozycji: 9**

- [ ] **Bomann** (`b-bomann`) — origin: Niemcy — produkuje: Clatronic Group
- [ ] **Kaiser** (`b-kaiser`) — origin: Niemcy — produkuje: Olan Haushaltsgeräte
- [ ] **Küppersbusch** (`b-kuppersbusch`) — origin: Niemcy — produkuje: Teka Group
- [ ] **Caso** (`b-caso`) — origin: Niemcy — produkuje: Braukmann Gmbh
- [ ] **Clatronic** (`b-clatronic`) — origin: Niemcy — produkuje: Clatronic Group
- [ ] **PKM** (`b-pkm`) — origin: Niemcy — produkuje: PKM GmbH
- [ ] **Respekta** (`b-respekta`) — origin: Niemcy — produkuje: NEG / Novex
- [ ] **AREBOS** (`b-arebos`) — origin: Niemcy — produkuje: Canbolat Vertriebs
- [ ] **Heinrich'S** (`b-heinrichs`) — origin: Niemcy — produkuje: ERS Group

<a id="pochodzenie-4"></a>

## 3.4 Przypisane do „Marki hiszpańskie” po pochodzeniu

> Te marki nie miały w bazie żadnego właściciela, więc migracja wrzuciła je do kubełka **wyłącznie na podstawie pola `origin`**. To zgadywanie: jeśli marka ma realnego właściciela, przepnij ją pod niego.

**Pozycji: 9**

- [ ] **Cata** (`b-cata`) — origin: Hiszpania — produkuje: CNA Group
- [ ] **Nodor** (`b-nodor`) — origin: Hiszpania — produkuje: CNA Group
- [ ] **Orbegozo** (`b-orbegozo`) — origin: Hiszpania — produkuje: Sonifer SA
- [ ] **Cecotec** (`b-cecotec`) — origin: Hiszpania — produkuje: Cecotec Innovaciones
- [ ] **Mepamsa** (`b-mepamsa`) — origin: Hiszpania — produkuje: Franke Group
- [ ] **Lacor** (`b-lacor`) — origin: Hiszpania — produkuje: Lacor Menaje Profesional
- [ ] **Taurus** (`b-taurus`) — origin: Hiszpania — produkuje: Taurus Group
- [ ] **Vitrokitchen** (`b-vitrokitchen`) — origin: Hiszpania — produkuje: Vitrokitchen (Hiszpania)
- [ ] **Cata & Can Roca** (`b-cata-can-roca`) — origin: Hiszpania — produkuje: CNA Group

<a id="pochodzenie-5"></a>

## 3.5 Przypisane do „Włoskie Marki Niezależne” po pochodzeniu

> Te marki nie miały w bazie żadnego właściciela, więc migracja wrzuciła je do kubełka **wyłącznie na podstawie pola `origin`**. To zgadywanie: jeśli marka ma realnego właściciela, przepnij ją pod niego.

**Pozycji: 8**

- [ ] **Freggia** (`b-freggia`) — origin: Włochy — produkuje: Producent nieustalony
- [ ] **Airforce** (`b-airforce`) — origin: Włochy — produkuje: Elica Group
- [ ] **Best** (`b-best`) — origin: Włochy — produkuje: Nortek Global
- [ ] **TurboAir** (`b-turboair`) — origin: Włochy — produkuje: Elica Group
- [ ] **Ardo** (`b-ardo`) — origin: Włochy — produkuje: JP Industries
- [ ] **Galvamet** (`b-galvamet`) — origin: Włochy — produkuje: Galvamet (Włochy)
- [ ] **Melchioni** (`b-melchioni`) — origin: Włochy — produkuje: Melchioni S.p.A.
- [ ] **Tognana** (`b-tognana`) — origin: Włochy — produkuje: Tognana S.p.A.

<a id="pochodzenie-6"></a>

## 3.6 Przypisane do „Marki francuskie” po pochodzeniu

> Te marki nie miały w bazie żadnego właściciela, więc migracja wrzuciła je do kubełka **wyłącznie na podstawie pola `origin`**. To zgadywanie: jeśli marka ma realnego właściciela, przepnij ją pod niego.

**Pozycji: 7**

- [ ] **Avintage** (`b-avintage`) — origin: Francja — produkuje: Frio Group
- [ ] **Climadiff** (`b-climadiff`) — origin: Francja — produkuje: Frio Group
- [ ] **La Sommelière** (`b-la-sommeliere`) — origin: Francja — produkuje: Frio Group
- [ ] **Le Cellier** (`b-le-cellier`) — origin: Francja — produkuje: Frio Group
- [ ] **Continental Edison** (`b-continental-edison`) — origin: Francja — produkuje: Cdiscount Group
- [ ] **Oceanic** (`b-oceanic`) — origin: Francja — produkuje: Cdiscount Group
- [ ] **Livoo** (`b-livoo`) — origin: Francja — produkuje: Delta France

<a id="pochodzenie-7"></a>

## 3.7 Przypisane do „Chińskie Marki Niezależne” po pochodzeniu

> Te marki nie miały w bazie żadnego właściciela, więc migracja wrzuciła je do kubełka **wyłącznie na podstawie pola `origin`**. To zgadywanie: jeśli marka ma realnego właściciela, przepnij ją pod niego.

**Pozycji: 7**

- [ ] **Ciarra** (`b-ciarra`) — origin: Chiny — produkuje: Ciarra Appliances
- [ ] **Amzchef** (`b-amzchef`) — origin: Chiny — produkuje: Producenci kontraktowi (Chiny)
- [ ] **VEVOR** (`b-vevor`) — origin: Chiny — produkuje: Vevor Group
- [ ] **Covercook** (`b-covercook`) — origin: Chiny — produkuje: Producenci kontraktowi (Chiny)
- [ ] **Hobsir** (`b-hobsir`) — origin: Chiny — produkuje: Producenci kontraktowi (Chiny)
- [ ] **Vovv** (`b-vovv`) — origin: Chiny — produkuje: Producenci kontraktowi (Chiny)
- [ ] **TopStrong** (`b-topstrong`) — origin: Chiny — produkuje: Producenci kontraktowi (Chiny)

<a id="pochodzenie-8"></a>

## 3.8 Przypisane do „Marki brytyjskie” po pochodzeniu

> Te marki nie miały w bazie żadnego właściciela, więc migracja wrzuciła je do kubełka **wyłącznie na podstawie pola `origin`**. To zgadywanie: jeśli marka ma realnego właściciela, przepnij ją pod niego.

**Pozycji: 3**

- [ ] **De Noble & Foster** (`b-de-noble-foster`) — origin: Wielka Brytania — produkuje: Producent nieustalony
- [ ] **Bright** (`b-bright`) — origin: Wielka Brytania / Chiny — produkuje: Producenci kontraktowi (Chiny)
- [ ] **Falcon** (`b-falcon`) — origin: Wielka Brytania — produkuje: Middleby Corp

<a id="marki-wlasne"></a>

## 4. Marki własne sieci handlowych

> Przypisane do „Marki Marketowe (OEM)” z dużą pewnością, ale warto potwierdzić właściciela sieci.

**Pozycji: 7**

- [ ] **Ikea** (`b-ikea`) — origin: Szwecja
- [ ] **Hanseatic** (`b-hanseatic`) — origin: Niemcy
- [ ] **GoodHome** (`b-goodhome`) — origin: Wielka Brytania
- [ ] **VidaXL** (`b-vidaxl`) — origin: Holandia
- [ ] **Cooke & Lewis** (`b-cooke-lewis`) — origin: Wielka Brytania
- [ ] **Silvercrest** (`b-silvercrest`) — origin: Niemcy
- [ ] **OBI** (`b-obi`) — origin: Niemcy

<a id="logotypy"></a>

## 5. Brakujące pliki logotypów

> Pole `localLogo` wskazuje na plik, którego nie ma w `public/`. Marka pokazuje inicjał zamiast logo — nic się nie psuje, ale wygląda ubogo. Albo dorzuć plik pod tę ścieżkę, albo usuń pole.

**Pozycji: 28**

- [ ] **Midea** (`b-midea`) — brak pliku `/brandsicons/midea.jpg`
- [ ] **Berg** (`b-berg`) — brak pliku `/brandsicons/berg.jpg`
- [ ] **Smith & Brown** (`b-smith-brown`) — brak pliku `/brandsicons/smith-brown.jpg`
- [ ] **Lin** (`b-lin`) — brak pliku `/brandsicons/lin.jpg`
- [ ] **Dreame** (`b-dreame`) — brak pliku `/brandsicons/dreame.jpg`
- [ ] **Electro-line** (`b-electro-line`) — brak pliku `/brandsicons/electro-line.jpg`
- [ ] **Sam Cook** (`b-samcook`) — brak pliku `/brandsicons/sam-cook.jpg`
- [ ] **Goddess** (`b-goddess`) — brak pliku `/brandsicons/goddess.jpg`
- [ ] **Eta** (`b-eta`) — brak pliku `/brandsicons/eta.jpg`
- [ ] **Manta** (`b-manta`) — brak pliku `/brandsicons/manta.jpg`
- [ ] **Optimum** (`b-optimum`) — brak pliku `/brandsicons/optimum.jpg`
- [ ] **Xiaomi** (`b-xiaomi`) — brak pliku `/brandsicons/xiaomi.jpg`
- [ ] **Hyundai** (`b-hyundai`) — brak pliku `/brandsicons/hyundai.jpg`
- [ ] **Dynaxo** (`b-dynaxo`) — brak pliku `/brandsicons/dynaxo.jpg`
- [ ] **Gasmaster** (`b-gasmaster`) — brak pliku `/brandsicons/gasmaster.jpg`
- [ ] **Iseasy** (`b-iseasy`) — brak pliku `/brandsicons/iseasy.jpg`
- [ ] **Xberg** (`b-xberg`) — brak pliku `/brandsicons/xberg.jpg`
- [ ] **Brandt** (`b-brandt`) — brak pliku `/brandsicons/brandt.jpg`
- [ ] **Kluge** (`b-kluge`) — brak pliku `/brandsicons/kluge.jpg`
- [ ] **Lanilia** (`b-lanilia`) — brak pliku `/brandsicons/lanilia.jpg`
- [ ] **De Dietrich** (`b-dedietrich`) — brak pliku `/brandsicons/de-dietrich.jpg`
- [ ] **Maan** (`b-maan`) — brak pliku `/brandsicons/maan.jpg`
- [ ] **SeeNERGY** (`b-seenergy`) — brak pliku `/brandsicons/seenergy.jpg`
- [ ] **Alveus** (`b-alveus`) — brak pliku `/brandsicons/alveus.jpg`
- [ ] **Afrelli** (`b-afrelli`) — brak pliku `/brandsicons/afrelli.jpg`
- [ ] **Toflesz** (`b-toflesz`) — brak pliku `/brandsicons/toflesz.jpg`
- [ ] **Nortberg** (`b-nortberg`) — brak pliku `/brandsicons/nortberg.jpg`
- [ ] **BORA** (`b-bora`) — brak pliku `/brandsicons/bora.svg`

<a id="drobiazgi"></a>

## 6. Drobiazgi

> Nic z tego nic nie psuje. Do zrobienia, kiedy wyżej będzie już odhaczone.

**Pozycji: 4**

- [ ] **Samsung** (`b-samsung`) — opis ma tylko 33 znaków: „Lider sprzedaży lodówek i pralek.”
- [ ] **Bertazzoni** (`b-bertazzoni`) — opis ma tylko 39 znaków: „Włoskie luksusowe kuchnie wolnostojące.”
- [ ] **LG** (`b-lg`) — brak `product_categories` (nie wyjdzie w wyszukiwarce po kategorii)
- [ ] **Ujednolicić zapis braku fabryk** — 87 marek ma `factories_pl` z tekstem „Brak…”, a 38 nie ma pola w ogóle. Oba znaczą to samo; warto zostawić jedną konwencję.
