const fs = require('fs');
const path = require('path');

const datasetPath = path.join('d:\\CODING\\ktostoiza\\src\\data\\dataset.json');
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

const newBrandsHtml = `
[
  {
    "id": "b-balay",
    "name": "Balay",
    "history": "Hiszpańska marka założona w Saragossie, która stała się symbolem modernizacji tamtejszego gospodarstwa domowego. Od lat 80. XX wieku ściśle związana z grupą BSH, gdzie pełni rolę kluczowej marki na rynku iberyjskim, słynąc z innowacji w dziedzinie płyt indukcyjnych i piekarników.",
    "origin": "Hiszpania",
    "segment": "Standard",
    "founded_year": 1947,
    "business_structure": "Grupa Kapitałowa",
    "product_range": "Pełne Portfolio",
    "acquisition_history": "W 1988 roku marka została włączona do grupy BSH (Bosch und Siemens Hausgeräte), stając się częścią jednego z największych koncernów AGD na świecie.",
    "product_categories": [
      "Pranie",
      "Chłodnictwo",
      "Zmywanie",
      "Gotowanie"
    ],
    "factories_pl": [
      "Korzysta z zaplecza produkcyjnego BSH w Polsce (Łódź, Wrocław, Rogoźnica) dla wybranych linii produktowych."
    ],
    "producedBy": [
      "m-bsh-group"
    ]
  },
  {
    "id": "b-bomann",
    "name": "Bomann",
    "history": "Niemiecka firma rodzinna z ponad 130-letnią tradycją, obecnie będąca częścią grupy Clatronic. Marka koncentruje się na dostarczaniu przystępnego cenowo sprzętu AGD, który łączy prostotę obsługi z niemiecką kontrolą jakości, celując w segment masowy.",
    "origin": "Niemcy",
    "segment": "Budżetowy",
    "founded_year": 1885,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Szerokie Portfolio",
    "acquisition_history": "Obecnie marka należy do C. Bomann GmbH, będącej częścią grupy Clatronic International GmbH.",
    "product_categories": [
      "Chłodnictwo",
      "Zmywanie",
      "Małe AGD",
      "Gotowanie"
    ],
    "factories_pl": [
      "Brak własnych fabryk w Polsce; produkcja głównie OEM (Chiny, Turcja)."
    ],
    "producedBy": [
      "m-clatronic-group"
    ]
  },
  {
    "id": "b-cata",
    "name": "Cata",
    "history": "Pionier w produkcji urządzeń do wentylacji kuchennej. Firma z Katalonii, która przekształciła się w globalnego gracza, oferując szeroką gamę urządzeń do zabudowy. Słynie z własnych centrów badawczych i produkcji komponentów, takich jak silniki do okapów.",
    "origin": "Hiszpania",
    "segment": "Standard",
    "founded_year": 1947,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Specjalista: Gotowanie i Okapy",
    "acquisition_history": "Niezależna grupa CNA Group, która w swojej historii przejmowała inne marki, takie jak Nodor czy markę Fagor (prawa do nazwy w określonych regionach).",
    "product_categories": [
      "Okapy Kuchenne",
      "Płyty Grzewcze",
      "Piekarniki",
      "Zlewozmywaki"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce."
    ],
    "producedBy": [
      "m-cna-group"
    ]
  },
  {
    "id": "b-de-noble-foster",
    "name": "De Noble & Foster",
    "history": "Ekskluzywna marka pozycjonowana na styl klasyczny i brytyjską elegancję. Często kojarzona z wysokiej jakości kuchniami wolnostojącymi i okapami o charakterystycznym designie, dedykowana dla klientów poszukujących estetyki retro i premium.",
    "origin": "Wielka Brytania",
    "segment": "Premium",
    "founded_year": 2012,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Szerokie Portfolio (Zabudowa)",
    "acquisition_history": "Marka operująca w ramach partnerstw dystrybucyjnych i produkcyjnych, często powiązana z zapleczem produkcyjnym dużych grup europejskich.",
    "product_categories": [
      "Kuchnie Wolnostojące",
      "Okapy Kuchenne",
      "Piekarniki",
      "Chłodnictwo"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce; modele często produkowane na zlecenie przez zakłady we Włoszech lub Turcji."
    ],
    "producedBy": [
      "m-id-unknown"
    ]
  },
  {
    "id": "b-freggia",
    "name": "Freggia",
    "history": "Marka wywodząca się z włoskich tradycji wzornictwa, stworzona z myślą o rynkach Europy Środkowo-Wschodniej. Koncentruje się na urządzeniach do gotowania i pieczenia, kładąc duży nacisk na trwałość (np. stosowanie profesjonalnych zawiasów) oraz estetykę dopasowaną do nowoczesnych wnętrz.",
    "origin": "Włochy",
    "segment": "Standard",
    "founded_year": 2013,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Szerokie Portfolio",
    "acquisition_history": "Należy do międzynarodowej grupy dystrybucyjnej, która zleca produkcję w wyspecjalizowanych włoskich fabrykach.",
    "product_categories": [
      "Gotowanie",
      "Okapy Kuchenne",
      "Zmywanie",
      "Pranie"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce."
    ],
    "producedBy": [
      "m-id-unknown"
    ]
  },
  {
    "id": "b-hotpoint",
    "name": "Hotpoint",
    "history": "Historyczna marka o korzeniach amerykańsko-brytyjskich, przez lata kojarzona z innowacjami w praniu i chłodnictwie. Przez długi czas funkcjonowała jako Hotpoint-Ariston po połączeniu z włoskim Aristonem, stając się jednym z najpopularniejszych brandów AGD w Europie.",
    "origin": "Wielka Brytania / USA",
    "segment": "Standard / Premium",
    "founded_year": 1911,
    "business_structure": "Grupa Kapitałowa",
    "product_range": "Pełne Portfolio",
    "acquisition_history": "Przejęta przez Whirlpool Corporation, a obecnie (od 2024 r.) stanowi część Beko Europe – spółki joint venture z udziałem Arçelik i Whirlpool.",
    "product_categories": [
      "Pranie",
      "Suszenie",
      "Chłodnictwo",
      "Gotowanie"
    ],
    "factories_pl": [
      "Produkcja w zakładach Beko Europe (dawniej Whirlpool) w Łodzi, Radomsku i Wrocławiu."
    ],
    "producedBy": [
      "m-beko-europe"
    ]
  },
  {
    "id": "b-ikea",
    "name": "Ikea",
    "history": "Szwedzki gigant meblowy, który oferuje komplementarną linię urządzeń AGD zaprojektowaną wyłącznie pod wymiary swoich systemów kuchennych. Urządzenia IKEA są owocem współpracy z czołowymi producentami, co pozwala na oferowanie długich gwarancji i spójnego designu.",
    "origin": "Szwecja",
    "segment": "Standard",
    "founded_year": 1943,
    "business_structure": "Marka Własna (Private Label)",
    "product_range": "Pełne Portfolio (Zabudowa)",
    "acquisition_history": "Nie dotyczy – rozwój poprzez partnerstwa strategiczne z OEM.",
    "product_categories": [
      "Gotowanie",
      "Chłodnictwo",
      "Zmywanie",
      "Oczyszczanie powietrza"
    ],
    "factories_pl": [
      "Brak własnych fabryk AGD, ale produkty dedykowane dla IKEA są wytwarzane w polskich fabrykach Electrolux i Whirlpool/Beko Europe."
    ],
    "producedBy": [
      "m-electrolux",
      "m-beko-europe"
    ]
  },
  {
    "id": "b-kaiser",
    "name": "Kaiser",
    "history": "Marka należąca do berlińskiej firmy OLAN-Haushaltsgeräte, specjalizująca się w produkcji luksusowego sprzętu AGD. Kaiser wyróżnia się unikalnymi liniami wzorniczymi, takimi jak 'Empire' czy 'Art Déco', łącząc nowoczesną technikę z bogatymi zdobieniami w stylu retro.",
    "origin": "Niemcy",
    "segment": "Premium / Luksusowy",
    "founded_year": 1995,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Szerokie Portfolio",
    "acquisition_history": "Prywatna własność założycieli (rodzina Friedmann).",
    "product_categories": [
      "Gotowanie",
      "Okapy Kuchenne",
      "Chłodnictwo",
      "Zmywanie"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce."
    ],
    "producedBy": [
      "m-olan-haushaltsgerate"
    ]
  },
  {
    "id": "b-kuppersbusch",
    "name": "Küppersbusch",
    "history": "Jedna z najstarszych niemieckich marek AGD, od zawsze kojarzona z profesjonalną gastronomią i najwyższą jakością. Obecnie oferuje urządzenia do użytku domowego, które technologicznie i materiałowo aspirują do poziomu profesjonalnego, będąc synonimem luksusu w kuchni.",
    "origin": "Niemcy",
    "segment": "Luksusowy",
    "founded_year": 1875,
    "business_structure": "Grupa Kapitałowa",
    "product_range": "Pełne Portfolio (Luksusowe)",
    "acquisition_history": "Od 1999 roku marka należy do Teka Group.",
    "product_categories": [
      "Piekarniki",
      "Płyty Grzewcze",
      "Chłodnictwo",
      "Zmywanie"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce."
    ],
    "producedBy": [
      "m-teka-group"
    ]
  },
  {
    "id": "b-malatec",
    "name": "Malatec",
    "history": "Marka należąca do polskiej firmy dystrybucyjnej, koncentrująca się na sprzedaży drobnego sprzętu AGD oraz akcesoriów domowych za pośrednictwem kanałów e-commerce. Oferuje produkty o podstawowej funkcjonalności w bardzo atrakcyjnych cenach.",
    "origin": "Polska",
    "segment": "Ekonomiczny",
    "founded_year": 2010,
    "business_structure": "Marka Dystrybutorska (PL)",
    "product_range": "Specjalista: Małe AGD",
    "acquisition_history": "Własność firmy Kruzzel / ISO Trade.",
    "product_categories": [
      "Odkurzacze",
      "Nawilżacze",
      "Akcesoria kuchenne",
      "Małe AGD"
    ],
    "factories_pl": [
      "Produkcja typu OEM, głównie w Chinach."
    ],
    "producedBy": [
      "m-oem-china"
    ]
  },
  {
    "id": "b-nodor",
    "name": "Nodor",
    "history": "Hiszpański specjalista w dziedzinie technologii kuchennych, należący do CNA Group. Marka znana z wprowadzania innowacyjnych rozwiązań w okapach i płytach indukcyjnych, pozycjonowana wyżej niż siostrzana marka Cata pod względem designu i parametrów technicznych.",
    "origin": "Hiszpania",
    "segment": "Premium",
    "founded_year": 1968,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Specjalista: Gotowanie",
    "acquisition_history": "Przejęta w 2004 roku przez CNA Group.",
    "product_categories": [
      "Okapy Kuchenne",
      "Płyty Indukcyjne",
      "Piekarniki"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce."
    ],
    "producedBy": [
      "m-cna-group"
    ]
  },
  {
    "id": "b-pyramis",
    "name": "Pyramis",
    "history": "Grecka korporacja o zasięgu globalnym, jeden z największych na świecie producentów zlewozmywaków ze stali nierdzewnej. Marka rozszerzyła swoją ofertę o urządzenia do zabudowy, oferując kompletne rozwiązania do strefy zmywania i gotowania.",
    "origin": "Grecja",
    "segment": "Standard",
    "founded_year": 1959,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Szerokie Portfolio",
    "acquisition_history": "Niezależne przedsiębiorstwo rodzinne z własnymi zakładami produkcyjnymi w Grecji i Indiach.",
    "product_categories": [
      "Zlewozmywaki",
      "Baterie kuchenne",
      "Piekarniki",
      "Okapy Kuchenne"
    ],
    "factories_pl": [
      "Brak produkcji urządzeń AGD w Polsce; silna obecność dystrybucyjna."
    ],
    "producedBy": [
      "m-pyramis-metallourgia"
    ]
  },
  {
    "id": "b-thetford",
    "name": "Thetford",
    "history": "Światowy lider w dziedzinie systemów sanitarnych i chłodniczych dedykowanych dla pojazdów rekreacyjnych (kampery, przyczepy). Marka dostarcza wyspecjalizowany sprzęt AGD, który musi spełniać rygorystyczne normy mobilności i energooszczędności.",
    "origin": "USA / Holandia",
    "segment": "Premium",
    "founded_year": 1963,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Specjalista: Mobile Living",
    "acquisition_history": "Należy do Monomoy Capital Partners; europejskie centrum operacyjne znajduje się w Holandii.",
    "product_categories": [
      "Lodówki turystyczne",
      "Kuchenki mobilne",
      "Systemy sanitarne"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce."
    ],
    "producedBy": [
      "m-thetford-corp"
    ]
  },
  {
    "id": "b-vivax",
    "name": "Vivax",
    "history": "Chorwacka marka należąca do grupy M San, która od 2004 roku dynamicznie rozwija ofertę elektroniki użytkowej i AGD. Vivax koncentruje się na optymalnym stosunku ceny do jakości, będąc liderem rynkowym w regionie Adriatyku i rosnącym graczem w Europie Środkowej.",
    "origin": "Chorwacja",
    "segment": "Budżetowy / Standard",
    "founded_year": 2004,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Szerokie Portfolio (Głównie Chłodnictwo)",
    "acquisition_history": "Marka własna chorwackiego dystrybutora M San Grupa.",
    "product_categories": [
      "Klimatyzacja",
      "Chłodnictwo",
      "Telewizory",
      "Małe AGD"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce; własna linia montażowa telewizorów i klimatyzacji w Chorwacji."
    ],
    "producedBy": [
      "m-m-san-grupa"
    ]
  }
]
-SPLIT-
[
  {
    "id": "b-bora",
    "name": "BORA",
    "history": "Innowacyjna niemiecka marka, która zrewolucjonizowała rynek kuchenny, wprowadzając pierwszy efektywny system wyciągu oparów zintegrowany z płytą grzewczą (wyciąg blatowy). Założona przez Williego Bruckbauera pod hasłem 'The End of the Range Hood', marka skupia się na fizyce przepływu powietrza, eliminując tradycyjne okapy wiszące na rzecz designu i wolności w projektowaniu kuchni.",
    "origin": "Niemcy",
    "segment": "Luksusowy",
    "founded_year": 2007,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Specjalista: Gotowanie i Wyciągi",
    "acquisition_history": "Marka pozostaje niezależnym przedsiębiorstwem prywatnym, stale rozwijającym swoje portfolio o systemy chłodzenia i profesjonalne piekarniki parowe dla domu.",
    "product_categories": [
      "Systemy wyciągu oparów",
      "Płyty grzewcze",
      "Piekarniki parowe",
      "Chłodnictwo"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce."
    ],
    "producedBy": [
      "m-bora-holding"
    ]
  },
  {
    "id": "b-dometic",
    "name": "Dometic",
    "history": "Światowy lider rozwiązań dla mobilnego życia, którego korzenie sięgają wynalezienia lodówki absorpcyjnej przez inżynierów z grupy Electrolux. Firma specjalizuje się w dostarczaniu najwyższej klasy sprzętu do kamperów, łodzi oraz zastosowań outdoorowych, stawiając na innowacje w chłodnictwie i zasilaniu w trudnych warunkach.",
    "origin": "Szwecja",
    "segment": "Premium",
    "founded_year": 2001,
    "business_structure": "Spółka Publiczna",
    "product_range": "Specjalista: Mobile Living",
    "acquisition_history": "Wydzielona z grupy Electrolux w 2001 roku. W kolejnych latach przejęła wielu konkurentów, m.in. marki Waeco (chłodnictwo) oraz Kampa (sprzęt outdoorowy).",
    "product_categories": [
      "Chłodnictwo mobilne",
      "Klimatyzacja",
      "Gotowanie outdoorowe",
      "Systemy sanitarne"
    ],
    "factories_pl": [
      "Brak produkcji urządzeń AGD w Polsce (posiada centra dystrybucyjne)."
    ],
    "producedBy": [
      "m-dometic-group"
    ]
  },
  {
    "id": "b-kitchenaid",
    "name": "KitchenAid",
    "history": "Amerykańska ikona designu, której historia zaczęła się od legendarnego miksera planetarnego 'Model H-5'. Marka szybko stała się synonimem profesjonalnej jakości w domowej kuchni. Dziś oferuje pełną gamę urządzeń AGD, które wyróżniają się charakterystyczną stylistyką retro, trwałością i bezkompromisową wydajnością.",
    "origin": "USA",
    "segment": "Premium / Luksusowy",
    "founded_year": 1919,
    "business_structure": "Grupa Kapitałowa",
    "product_range": "Szerokie Portfolio",
    "acquisition_history": "Od 1986 roku marka należy do Whirlpool Corporation. Od 2024 r. dystrybucja dużego AGD w Europie realizowana jest w ramach Beko Europe.",
    "product_categories": [
      "Małe AGD",
      "Gotowanie",
      "Chłodnictwo",
      "Zmywanie"
    ],
    "factories_pl": [
      "Wybrane modele dużego AGD (lodówki, zmywarki) produkowane są w polskich zakładach Beko Europe (dawniej Whirlpool)."
    ],
    "producedBy": [
      "m-beko-europe",
      "m-whirlpool-usa"
    ]
  },
  {
    "id": "b-mora",
    "name": "Mora",
    "history": "Czeska marka z ponad dwustuletnią tradycją, będąca jednym z filarów środkowoeuropejskiego przemysłu AGD. Przez dekady kojarzona głównie z niezawodnymi kuchenkami i piecami, dziś oferuje nowoczesny sprzęt do zabudowy, zachowując opinię marki 'solidnej i przystępnej'.",
    "origin": "Czechy",
    "segment": "Standard",
    "founded_year": 1825,
    "business_structure": "Grupa Kapitałowa",
    "product_range": "Szerokie Portfolio (Głównie Gotowanie)",
    "acquisition_history": "W 2005 roku firma Mora Moravia została przejęta przez słoweńską grupę Gorenje, która obecnie jest częścią chińskiego giganta Hisense.",
    "product_categories": [
      "Gotowanie",
      "Okapy Kuchenne",
      "Zmywanie",
      "Chłodnictwo"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce; główny zakład znajduje się w czeskim Mariánskim Údolí."
    ],
    "producedBy": [
      "m-gorenje-hisense"
    ]
  },
  {
    "id": "b-winia",
    "name": "Winia",
    "history": "Południowokoreański producent, który przejął dziedzictwo technologiczne znanej marki Daewoo Electronics. Winia kontynuuje tradycję innowacji w segmencie budżetowym i standardowym, oferując m.in. unikalne pralki ścienne 'Mini' oraz zaawansowane lodówki z systemami świeżości.",
    "origin": "Korea Południowa",
    "segment": "Budżetowy / Standard",
    "founded_year": 1971,
    "business_structure": "Grupa Kapitałowa",
    "product_range": "Szerokie Portfolio",
    "acquisition_history": "Marka powstała po przejęciu Daewoo Electronics przez Dayou Group w 2018 roku (później zmieniona na Winia Electronics). Firma przechodziła liczne procesy restrukturyzacyjne w ostatnich latach.",
    "product_categories": [
      "Chłodnictwo",
      "Pranie",
      "Kuchenki mikrofalowe",
      "Klimatyzacja"
    ],
    "factories_pl": [
      "Obecnie brak własnej produkcji w Polsce (historycznie Daewoo posiadało duże zakłady w Warszawie i Pruszkowie)."
    ],
    "producedBy": [
      "m-winia-electronics"
    ]
  }
]
-SPLIT-
[
  {
    "id": "b-avintage",
    "name": "Avintage",
    "history": "Francuska marka premium należąca do grupy Frio, specjalizująca się wyłącznie w chłodziarkach do wina przeznaczonych do zabudowy kuchennej. Avintage jest uznawana za markę projektową, która łączy zaawansowaną technologię starzenia wina z estetyką nowoczesnych mebli kuchennych.",
    "origin": "Francja",
    "segment": "Premium",
    "founded_year": 2000,
    "business_structure": "Grupa Kapitałowa",
    "product_range": "Specjalista: Chłodnictwo Wina",
    "acquisition_history": "Marka portfelowa grupy Frio (dawniej Climadiff), lidera w segmencie winiarskim w Europie.",
    "product_categories": [
      "Winiarki do zabudowy",
      "Winiarki wolnostojące"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce."
    ],
    "producedBy": [
      "m-frio-group"
    ]
  },
  {
    "id": "b-caso",
    "name": "Caso",
    "history": "Niemiecka marka Caso Design to jeden z liderów innowacji w kategorii technologii kuchennej. Znana z wprowadzania nowoczesnych rozwiązań w małym AGD oraz zaawansowanych winiarek, które łączą funkcjonalność z wysokiej jakości materiałami, takimi jak stal nierdzewna i szkło hartowane.",
    "origin": "Niemcy",
    "segment": "Premium",
    "founded_year": 2003,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Specjalista: Kuchnia i Chłodnictwo",
    "acquisition_history": "Marka należy do Braukmann GmbH, niezależnej firmy rodzinnej.",
    "product_categories": [
      "Winiarki",
      "Kuchenki mikrofalowe",
      "Pakowarki próżniowe",
      "Płyty indukcyjne mobilne"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce."
    ],
    "producedBy": [
      "m-braukmann-gmbh"
    ]
  },
  {
    "id": "b-cavin",
    "name": "Cavin",
    "history": "Skandynawska marka, która wyrosła z pasji do wina i chęci dostarczenia wysokiej jakości rozwiązań w przystępniejszej cenie niż segment luksusowy. Cavin skupia się na minimalistycznym designie i efektywności chłodzenia, oferując szeroką gamę modeli 'Built-in' i 'Under-counter'.",
    "origin": "Szwecja",
    "segment": "Standard / Premium",
    "founded_year": 2012,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Specjalista: Chłodnictwo Wina",
    "acquisition_history": "Marka ściśle powiązana z grupą dystrybucyjną LS-Group, operującą na rynku skandynawskim i europejskim.",
    "product_categories": [
      "Winiarki do zabudowy",
      "Winiarki wolnostojące"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce."
    ],
    "producedBy": [
      "m-ls-group"
    ]
  },
  {
    "id": "b-climadiff",
    "name": "Climadiff",
    "history": "Legenda na rynku chłodziarek do wina. Climadiff była jedną z pierwszych marek, która przeniosła technologię profesjonalnych piwnic winiarskich do domowych urządzeń. Specjalizuje się w urządzeniach do długotrwałego leżakowania wina, dbając o idealną wilgotność i brak wibracji.",
    "origin": "Francja",
    "segment": "Standard / Premium",
    "founded_year": 1997,
    "business_structure": "Grupa Kapitałowa",
    "product_range": "Specjalista: Chłodnictwo Wina",
    "acquisition_history": "Założona przez rodzinę winiarzy, obecnie główna marka grupy Frio.",
    "product_categories": [
      "Winiarki piwniczne (starzenie)",
      "Winiarki serwujące"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce."
    ],
    "producedBy": [
      "m-frio-group"
    ]
  },
  {
    "id": "b-dunavox",
    "name": "Dunavox",
    "history": "Jeden z najszybciej rozwijających się producentów winiarek w Europie. Dunavox stawia na specjalizację – oferuje jedną z najszerszych ofert na rynku, od miniaturowych chłodziarek po wielkie szafy klimatyczne dla restauracji. Marka jest ceniona za bardzo cichą pracę urządzeń.",
    "origin": "Węgry",
    "segment": "Premium",
    "founded_year": 2006,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Specjalista: Chłodnictwo Wina",
    "acquisition_history": "Niezależna spółka z centralą w Budapeszcie, obecna w ponad 40 krajach.",
    "product_categories": [
      "Winiarki do zabudowy",
      "Winiarki wolnostojące",
      "Profesjonalne szafy na wino"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce."
    ],
    "producedBy": [
      "m-dunavox-europe"
    ]
  },
  {
    "id": "b-la-sommeliere",
    "name": "La Sommelière",
    "history": "Francuska marka z ponad 20-letnim stażem, dedykowana pasjonatom wina i profesjonalistom. Oferuje innowacyjne rozwiązania, takie jak zintegrowane systemy próżniowe wewnątrz winiarki czy sterowanie aplikacją (Vinotag). Łączy tradycyjne podejście do wina z nowoczesną technologią.",
    "origin": "Francja",
    "segment": "Premium",
    "founded_year": 1993,
    "business_structure": "Grupa Kapitałowa",
    "product_range": "Specjalista: Chłodnictwo Wina",
    "acquisition_history": "Kluczowa marka w portfolio grupy Frio.",
    "product_categories": [
      "Winiarki domowe",
      "Urządzenia dla gastronomii",
      "Systemy serwowania wina"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce."
    ],
    "producedBy": [
      "m-frio-group"
    ]
  },
  {
    "id": "b-le-cellier",
    "name": "Le Cellier",
    "history": "Ekskluzywna marka specjalistyczna, koncentrująca się na dostarczaniu rozwiązań do przechowywania wina dla najbardziej wymagających klientów. Produkty Le Cellier charakteryzują się rzemieślniczą precyzją i są często wybierane do luksusowych rezydencji oraz prestiżowych lokali gastronomicznych.",
    "origin": "Francja",
    "segment": "Premium / Luksusowy",
    "founded_year": 1995,
    "business_structure": "Grupa Kapitałowa",
    "product_range": "Specjalista: Chłodnictwo Wina",
    "acquisition_history": "Marka operująca w ramach powiązań z francuskimi liderami rynku winiarskiego (grupa Frio).",
    "product_categories": [
      "Luksusowe szafy na wino",
      "Winiarki do zabudowy"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce."
    ],
    "producedBy": [
      "m-frio-group"
    ]
  },
  {
    "id": "b-bright",
    "name": "Bright",
    "history": "Ekonomiczna marka oferująca podstawowy sprzęt AGD, często spotykana w sieciach handlowych i na rynkach e-commerce. Skupia się na prostocie wykonania i najniższej cenie, oferując modele mikrofal o standardowych parametrach.",
    "origin": "Wielka Brytania / Chiny",
    "segment": "Ekonomiczny",
    "founded_year": 2010,
    "business_structure": "Marka Własna (Private Label)",
    "product_range": "Specjalista: Małe AGD",
    "acquisition_history": "Marka rozwijana przez międzynarodowych dystrybutorów na bazie produkcji OEM.",
    "product_categories": [
      "Kuchenki mikrofalowe",
      "Małe AGD kuchenne"
    ],
    "factories_pl": [
      "Produkcja OEM w Chinach."
    ],
    "producedBy": [
      "m-oem-china"
    ]
  },
  {
    "id": "b-clatronic",
    "name": "Clatronic",
    "history": "Niemiecki gigant segmentu budżetowego. Firma Clatronic International GmbH dostarcza ogromną gamę produktów od drobnego AGD po urządzenia do zabudowy, stawiając na maksymalną dostępność cenową przy zachowaniu europejskich certyfikatów bezpieczeństwa.",
    "origin": "Niemcy",
    "segment": "Budżetowy",
    "founded_year": 1982,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Szerokie Portfolio",
    "acquisition_history": "Niezależna firma rodzinna (rodzina Claßen), właściciel marek Bomann i ProfiCook.",
    "product_categories": [
      "Kuchenki mikrofalowe",
      "Małe AGD",
      "Gotowanie",
      "Sprzątanie"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce; produkcja zorientowana na Azję i Turcję."
    ],
    "producedBy": [
      "m-clatronic-group"
    ]
  },
  {
    "id": "b-continental-edison",
    "name": "Continental Edison",
    "history": "Historyczna marka o amerykańskich korzeniach, która stała się ikoną we Francji. Obecnie pozycjonowana jako marka oferująca solidne urządzenia w bardzo konkurencyjnych cenach, łącząc nowoczesne funkcje (jak mikrofale z grillem) z przystępnością rynkową.",
    "origin": "Francja",
    "segment": "Budżetowy / Standard",
    "founded_year": 1882,
    "business_structure": "Marka Własna (Private Label)",
    "product_range": "Szerokie Portfolio",
    "acquisition_history": "Obecnie marka należy do grupy Casino (Cdiscount), francuskiego giganta handlu detalicznego.",
    "product_categories": [
      "Kuchenki mikrofalowe",
      "Telewizory",
      "Pranie",
      "Chłodnictwo"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce; korzysta z dostawców OEM (m.in. Vestel, Midea)."
    ],
    "producedBy": [
      "m-cdiscount-group"
    ]
  },
  {
    "id": "b-hanseatic",
    "name": "Hanseatic",
    "history": "Marka stworzona przez niemiecki koncern wysyłkowy Otto Group. Hanseatic oferuje pełen przekrój AGD, od pralek po mikrofale do zabudowy, będąc alternatywą dla droższych marek producenckich przy zachowaniu standardów jakości rynku niemieckiego.",
    "origin": "Niemcy",
    "segment": "Standard",
    "founded_year": 1949,
    "business_structure": "Marka Własna (Private Label)",
    "product_range": "Pełne Portfolio",
    "acquisition_history": "Marka własna Otto Group, rozwijana wewnętrznie jako kluczowy brand AGD w katalogach wysyłkowych.",
    "product_categories": [
      "Pranie",
      "Chłodnictwo",
      "Gotowanie (w tym mikrofale)",
      "Zmywanie"
    ],
    "factories_pl": [
      "Korzysta z produkcji OEM w różnych krajach; część asortymentu może pochodzić z fabryk w Polsce współpracujących z Otto Group."
    ],
    "producedBy": [
      "m-otto-group"
    ]
  },
  {
    "id": "b-orbegozo",
    "name": "Orbegozo",
    "history": "Hiszpański lider w kategorii małego AGD i wentylacji. Marka jest niezwykle popularna na Półwyspie Iberyjskim, oferując niezawodny sprzęt w bardzo niskich cenach. Ich oferta mikrofal jest ceniona za prostotę konstrukcji i trwałość.",
    "origin": "Hiszpania",
    "segment": "Budżetowy / Standard",
    "founded_year": 1949,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Szerokie Portfolio",
    "acquisition_history": "Należy do Sonifer S.A., hiszpańskiej firmy rodzinnej.",
    "product_categories": [
      "Kuchenki mikrofalowe",
      "Ogrzewanie",
      "Wentylacja",
      "Małe AGD kuchenne"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce."
    ],
    "producedBy": [
      "m-sonifer-sa"
    ]
  },
  {
    "id": "b-silva-homeline",
    "name": "Silva Homeline",
    "history": "Marka należąca do austriackiej grupy Silva Schneider, specjalizująca się w dostarczaniu funkcjonalnego sprzętu domowego. Silva Homeline łączy tradycyjne podejście do handlu z nowoczesnym wzornictwem mikrofal i drobnego AGD.",
    "origin": "Austria",
    "segment": "Budżetowy",
    "founded_year": 1968,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Specjalista: Małe AGD",
    "acquisition_history": "Część Silva Schneider Handel GmbH, operującej głównie na rynkach DACH.",
    "product_categories": [
      "Kuchenki mikrofalowe",
      "Małe AGD kuchenne",
      "Audio"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce."
    ],
    "producedBy": [
      "m-silva-schneider"
    ]
  }
]
-SPLIT-
[
  {
    "id": "b-airforce",
    "name": "Airforce",
    "history": "Włoska marka specjalizująca się w projektowaniu zaawansowanych systemów wentylacji kuchennej. Airforce słynie z odważnego podejścia do designu i wprowadzania innowacyjnych technologii, które mają na celu uczynienie okapu centralnym, a jednocześnie cichym elementem nowoczesnej kuchni.",
    "origin": "Włochy",
    "segment": "Premium",
    "founded_year": 1997,
    "business_structure": "Grupa Kapitałowa",
    "product_range": "Specjalista: Okapy Kuchenne",
    "acquisition_history": "Marka stała się częścią grupy Elica, co pozwoliło na synergię technologiczną i globalną ekspansję.",
    "product_categories": [
      "Okapy Kuchenne",
      "Płyty zintegrowane z wyciągiem"
    ],
    "factories_pl": [
      "Brak bezpośrednich fabryk w Polsce (korzysta z centrów logistycznych Elica w Jelczu-Laskowicach)."
    ],
    "producedBy": [
      "m-elica-group"
    ]
  },
  {
    "id": "b-berdsen",
    "name": "Berdsen",
    "history": "Dynamicznie rozwijająca się marka dystrybutorska, która zdominowała polskie kanały e-commerce w kategorii okapów kuchennych. Oferuje produkty łączące nowoczesną estetykę (szkło, LED) z bardzo przystępną ceną, trafiając w potrzeby masowego klienta.",
    "origin": "Polska",
    "segment": "Budżetowy / Standard",
    "founded_year": 2011,
    "business_structure": "Marka Dystrybutorska (PL)",
    "product_range": "Szerokie Portfolio (Głównie Okapy)",
    "acquisition_history": "Marka należąca do polskiej grupy kapitałowej koncentrującej się na handlu elektronicznym.",
    "product_categories": [
      "Okapy Kuchenne",
      "Akcesoria kuchenne",
      "Małe AGD"
    ],
    "factories_pl": [
      "Produkcja kontraktowa (OEM) w Chinach i Turcji."
    ],
    "producedBy": [
      "m-oem-china"
    ]
  },
  {
    "id": "b-best",
    "name": "Best",
    "history": "Jeden z najbardziej uznanych na świecie producentów okapów kuchennych. Marka Best od dekad wyznacza standardy w dziedzinie wydajności wyciągów i innowacji materiałowych. Ich produkty są często wybierane do projektów luksusowych apartamentów.",
    "origin": "Włochy",
    "segment": "Premium / Luksusowy",
    "founded_year": 1976,
    "business_structure": "Grupa Kapitałowa",
    "product_range": "Specjalista: Okapy Kuchenne",
    "acquisition_history": "Przez lata marka należała do amerykańskiego koncernu Nortek; obecnie operuje w ramach międzynarodowych struktur wyspecjalizowanych w wentylacji.",
    "product_categories": [
      "Okapy Kuchenne",
      "Systemy filtracji powietrza"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce."
    ],
    "producedBy": [
      "m-nortek-global"
    ]
  },
  {
    "id": "b-cecotec",
    "name": "Cecotec",
    "history": "Hiszpański fenomen rynkowy, który w krótkim czasie stał się jednym z największych graczy w Europie. Firma stawia na 'demokratyzację technologii', oferując urządzenia o parametrach premium (np. roboty sprzątające z laserem, frytkownice beztłuszczowe) w cenach dostępnych dla każdego.",
    "origin": "Hiszpania",
    "segment": "Mieszane (Budżetowy / Standard)",
    "founded_year": 1995,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Pełne Portfolio (Małe i Duże AGD)",
    "acquisition_history": "Niezależna firma rodzinna (rodzeństwo Orts), która przekształciła się w globalne przedsiębiorstwo.",
    "product_categories": [
      "Małe AGD",
      "Roboty sprzątające",
      "Ekspresy do kawy",
      "Duże AGD (wolnostojące)"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce; produkcja zorientowana na model OEM w Azji pod ścisłym nadzorem inżynieryjnym w Walencji."
    ],
    "producedBy": [
      "m-cecotec-innovaciones"
    ]
  },
  {
    "id": "b-ciarko",
    "name": "Ciarko",
    "history": "Największy polski producent okapów kuchennych z siedzibą w Sanoku. Firma przeszła drogę od małego warsztatu do jednego z najnowocześniejszych zakładów w Europie, dostarczając produkty pod własną marką (w tym luksusową linię Ciarko Design) oraz produkując dla największych światowych koncernów.",
    "origin": "Polska",
    "segment": "Mieszane (Standard / Premium)",
    "founded_year": 1986,
    "business_structure": "Przedsiębiorstwo Prywatne (PL)",
    "product_range": "Specjalista: Okapy Kuchenne",
    "acquisition_history": "Rodzinna firma z polskim kapitałem, stale reinwestująca w automatyzację i design.",
    "product_categories": [
      "Okapy Kuchenne",
      "Systemy wyciągowe"
    ],
    "factories_pl": [
      "Własna fabryka w Sanoku (woj. podkarpackie)."
    ],
    "producedBy": [
      "m-ciarko-sanok"
    ]
  },
  {
    "id": "b-ciarra",
    "name": "Ciarra",
    "history": "Nowoczesna marka skupiona na efektywności energetycznej i zrównoważonym rozwoju. Ciarra stawia na minimalistyczny design i prostotę montażu, pozycjonując się jako marka 'smart' dla świadomych ekologicznie użytkowników.",
    "origin": "Chiny",
    "segment": "Standard",
    "founded_year": 2016,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Szerokie Portfolio (Gotowanie)",
    "acquisition_history": "Marka o zasięgu globalnym, rozwijana przez chińskich inwestorów technologicznych.",
    "product_categories": [
      "Okapy Kuchenne",
      "Płyty Indukcyjne"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce."
    ],
    "producedBy": [
      "m-ciarra-appliances"
    ]
  },
  {
    "id": "b-comfee",
    "name": "Comfee",
    "history": "Marka należąca do giganta Midea, stworzona w celu dostarczania młodym użytkownikom funkcjonalnego, estetycznego i niedrogiego sprzętu AGD. Comfee kładzie nacisk na kompaktowe rozwiązania idealne do mniejszych mieszkań.",
    "origin": "Chiny",
    "segment": "Budżetowy",
    "founded_year": 2009,
    "business_structure": "Grupa Kapitałowa",
    "product_range": "Pełne Portfolio",
    "acquisition_history": "Marka strategiczna w portfelu Midea Group.",
    "product_categories": [
      "Chłodnictwo",
      "Klimatyzacja",
      "Pranie",
      "Zmywanie"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce."
    ],
    "producedBy": [
      "m-midea-group"
    ]
  },
  {
    "id": "b-falcon",
    "name": "Falcon",
    "history": "Brytyjski producent legendarnych kuchni wolnostojących (tzw. range cookers). Falcon to wybór dla profesjonalistów i pasjonatów gotowania, którzy oczekują od sprzętu domowego wydajności restauracyjnej oraz klasycznego, brytyjskiego wyglądu.",
    "origin": "Wielka Brytania",
    "segment": "Luksusowy",
    "founded_year": 1830,
    "business_structure": "Grupa Kapitałowa",
    "product_range": "Specjalista: Kuchnie Wolnostojące",
    "acquisition_history": "Marka należała do grupy Aga Rangemaster, która w 2015 roku została przejęta przez amerykański koncern Middleby Corporation.",
    "product_categories": [
      "Kuchnie Wolnostojące",
      "Okapy Kuchenne",
      "Chłodnictwo Premium"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce."
    ],
    "producedBy": [
      "m-middleby-corp"
    ]
  },
  {
    "id": "b-focus",
    "name": "Focus",
    "history": "Polska marka obecna na rynku od lat 90., dostarczająca urządzenia kuchenne do zabudowy. Focus jest ceniony za stabilną jakość i prostą stylistykę, będąc solidnym wyborem w segmencie średnim dla klientów ceniących krajowych dystrybutorów.",
    "origin": "Polska",
    "segment": "Standard",
    "founded_year": 1995,
    "business_structure": "Przedsiębiorstwo Prywatne (PL)",
    "product_range": "Szerokie Portfolio (Zabudowa)",
    "acquisition_history": "Niezależna marka zarządzana przez Focus AGD Sp. z o.o.",
    "product_categories": [
      "Okapy Kuchenne",
      "Piekarniki",
      "Płyty Grzewcze"
    ],
    "factories_pl": [
      "Produkcja mieszana (własny montaż / OEM)."
    ],
    "producedBy": [
      "m-focus-agd"
    ]
  },
  {
    "id": "b-goodhome",
    "name": "GoodHome",
    "history": "Marka własna grupy Kingfisher, wprowadzona jako ujednolicony brand dla wszystkich sklepów Castorama. GoodHome koncentruje się na kompleksowych rozwiązaniach do domu, oferując AGD w pełni kompatybilne z systemami mebli kuchennych tej sieci.",
    "origin": "Wielka Brytania",
    "segment": "Standard",
    "founded_year": 2019,
    "business_structure": "Marka Własna (Private Label)",
    "product_range": "Pełne Portfolio (Zabudowa)",
    "acquisition_history": "Stworzona przez Kingfisher plc w celu zastąpienia wcześniejszych marek takich jak Cooke & Lewis.",
    "product_categories": [
      "Gotowanie",
      "Zmywanie",
      "Okapy Kuchenne",
      "Chłodnictwo"
    ],
    "factories_pl": [
      "Produkcja OEM realizowana przez dużych graczy rynkowych (m.in. Whirlpool/Beko Europe)."
    ],
    "producedBy": [
      "m-kingfisher-plc"
    ]
  },
  {
    "id": "b-guzzanti",
    "name": "Guzzanti",
    "history": "Czeska marka, która za cel postawiła sobie dostarczanie sprzętu o włoskim designie w czeskiej cenie. Guzzanti oferuje bardzo szerokie portfolio, od maszynek do lodów po zaawansowane winiarki i okapy.",
    "origin": "Czechy",
    "segment": "Standard",
    "founded_year": 2005,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Szerokie Portfolio",
    "acquisition_history": "Część grupy Klima-Classic, czeskiego dystrybutora i producenta.",
    "product_categories": [
      "Chłodnictwo Wina",
      "Małe AGD",
      "Okapy Kuchenne",
      "Zmywanie"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce."
    ],
    "producedBy": [
      "m-klima-classic"
    ]
  },
  {
    "id": "b-hendi",
    "name": "Hendi",
    "history": "Europejski lider w dziedzinie profesjonalnego wyposażenia gastronomii. Choć marka Hendi kojarzy się głównie z restauracjami, ich wybrane urządzenia (np. cyrkulatory sous-vide, płyty indukcyjne nastawne) są chętnie wybierane przez ambitnych kucharzy domowych.",
    "origin": "Holandia",
    "segment": "Premium (Profesjonalny)",
    "founded_year": 1934,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Specjalista: Gastronomia (HoReCa)",
    "acquisition_history": "Międzynarodowa grupa z oddziałami w całej Europie, w tym silnym przedstawicielstwem Hendi Polska.",
    "product_categories": [
      "Sprzęt kuchenny profesjonalny",
      "Obróbka termiczna",
      "Chłodnictwo komercyjne"
    ],
    "factories_pl": [
      "Posiada centrum logistyczne i montażowe w Polsce (Gądki pod Poznaniem)."
    ],
    "producedBy": [
      "m-hendi-group"
    ]
  },
  {
    "id": "b-kuchinox",
    "name": "Kuchinox",
    "history": "Polski producent i dystrybutor specjalizujący się w strefie zmywania. Kuchinox jest kluczowym dostawcą dla marketów budowlanych, oferując zlewozmywaki i akcesoria, które łączą funkcjonalność z nowoczesnym wykończeniem (np. granit, stal szczotkowana).",
    "origin": "Polska",
    "segment": "Budżetowy / Standard",
    "founded_year": 1997,
    "business_structure": "Przedsiębiorstwo Prywatne (PL)",
    "product_range": "Specjalista: Zlewozmywaki i Armatura",
    "acquisition_history": "Marka powiązana kapitałowo z grupą Laveo.",
    "product_categories": [
      "Zlewozmywaki",
      "Baterie kuchenne",
      "Akcesoria kuchenne"
    ],
    "factories_pl": [
      "Własna produkcja zlewozmywaków granitowych w Polsce."
    ],
    "producedBy": [
      "m-kuchinox-polska"
    ]
  },
  {
    "id": "b-mepamsa",
    "name": "Mepamsa",
    "history": "Hiszpańska marka z ogromną tradycją w produkcji systemów wentylacyjnych. Przez dziesięciolecia Mepamsa była synonimem niezawodnego okapu w hiszpańskich domach, stawiając na prostotę i wysoką moc ssania.",
    "origin": "Hiszpania",
    "segment": "Standard",
    "founded_year": 1956,
    "business_structure": "Grupa Kapitałowa",
    "product_range": "Specjalista: Okapy Kuchenne",
    "acquisition_history": "Marka została przejęta przez szwajcarski koncern Franke Group, stając się częścią ich portfela marek kuchennych.",
    "product_categories": [
      "Okapy Kuchenne",
      "Płyty Grzewcze"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce."
    ],
    "producedBy": [
      "m-franke-group"
    ]
  },
  {
    "id": "b-novy",
    "name": "Novy",
    "history": "Belgijska marka uznawana za wynalazcę okapu kuchennego z wyciągiem szczelinowym. Novy to światowa czołówka w kategorii ciszy i dyskrecji – ich urządzenia są projektowane tak, by były niemal niesłyszalne i całkowicie zintegrowane z sufitem lub blatem.",
    "origin": "Belgia",
    "segment": "Luksusowy",
    "founded_year": 1907,
    "business_structure": "Grupa Kapitałowa",
    "product_range": "Specjalista: Okapy i Płyty",
    "acquisition_history": "W 2021 roku marka Novy została przejęta przez amerykańską grupę Middleby Corporation.",
    "product_categories": [
      "Okapy sufitowe",
      "Płyty z wyciągiem",
      "Oświetlenie kuchenne"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce."
    ],
    "producedBy": [
      "m-middleby-corp"
    ]
  },
  {
    "id": "b-pkm",
    "name": "PKM",
    "history": "Niemiecka marka nastawiona na dostarczanie kompletnego AGD do zabudowy w bardzo niskich cenach. PKM jest niezwykle popularne w Niemczech jako marka pierwszego wyboru do wynajmowanych mieszkań i tanich systemów kuchennych.",
    "origin": "Niemcy",
    "segment": "Ekonomiczny / Budżetowy",
    "founded_year": 1985,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Szerokie Portfolio",
    "acquisition_history": "Należy do PKM GmbH & Co. KG, specjalizującej się w imporcie i certyfikacji urządzeń OEM.",
    "product_categories": [
      "Chłodnictwo",
      "Gotowanie",
      "Zmywanie",
      "Zabudowa podblatowa"
    ],
    "factories_pl": [
      "Produkcja OEM (Chiny, Turcja)."
    ],
    "producedBy": [
      "m-pkm-gmbh"
    ]
  },
  {
    "id": "b-respekta",
    "name": "Respekta",
    "history": "Marka należąca do niemieckiej grupy NEG-Novex, od lat 70. dostarczająca gotowe zestawy kuchenne wraz z AGD. Respekta kładzie nacisk na prostotę montażu i funkcjonalność, będąc kluczowym graczem w europejskich marketach budowlanych (DIY).",
    "origin": "Niemcy",
    "segment": "Budżetowy",
    "founded_year": 1977,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Szerokie Portfolio (Zabudowa)",
    "acquisition_history": "Niezależna marka w ramach struktur NEG-Novex.",
    "product_categories": [
      "Zestawy do pieczenia",
      "Zmywanie",
      "Chłodnictwo do zabudowy"
    ],
    "factories_pl": [
      "Produkcja OEM."
    ],
    "producedBy": [
      "m-neg-novex"
    ]
  },
  {
    "id": "b-turboair",
    "name": "TurboAir",
    "history": "Włoska marka stworzona przez grupę Elica, mająca na celu dostarczenie legendarnej włoskiej jakości wentylacji w bardziej przystępnym przedziale cenowym niż główny brand Elica. TurboAir łączy tradycyjne rzemiosło z nowoczesnymi liniami produkcyjnymi.",
    "origin": "Włochy",
    "segment": "Standard",
    "founded_year": 1970,
    "business_structure": "Grupa Kapitałowa",
    "product_range": "Specjalista: Okapy Kuchenne",
    "acquisition_history": "Marka portfelowa grupy Elica.",
    "product_categories": [
      "Okapy Kuchenne"
    ],
    "factories_pl": [
      "Produkcja realizowana w fabrykach Elica, w tym w Polsce (Jelcz-Laskowice)."
    ],
    "producedBy": [
      "m-elica-group"
    ]
  },
  {
    "id": "b-vidaxl",
    "name": "VidaXL",
    "history": "Holenderski gigant e-commerce, który zrewolucjonizował sprzedaż detaliczną poprzez własną produkcję i bezpośrednią wysyłkę. W kategorii AGD VidaXL oferuje proste urządzenia (np. małe lodówki, wyciągi), stawiając na absolutnie najniższą cenę rynkową.",
    "origin": "Holandia",
    "segment": "Ekonomiczny",
    "founded_year": 2006,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Specjalista: Wyposażenie Domu",
    "acquisition_history": "Dynamicznie rosnąca spółka prywatna z potężnym zapleczem logistycznym w Polsce (Września).",
    "product_categories": [
      "Małe AGD",
      "Chłodnictwo turystyczne",
      "Okapy"
    ],
    "factories_pl": [
      "Wielkie centrum logistyczne w Polsce; produkcja AGD głównie w Chinach."
    ],
    "producedBy": [
      "m-oem-china"
    ]
  }
]
-SPLIT-
[
  {
    "id": "b-amzchef",
    "name": "Amzchef",
    "history": "Dynamiczna marka e-commerce, która zyskała popularność dzięki sprzedaży bezpośredniej na platformach takich jak Amazon. Skupia się na dostarczaniu nowoczesnych urządzeń kuchennych (wolnowary, wyciskarki, płyty indukcyjne) w bardzo konkurencyjnych cenach, stawiając na estetykę i kompaktowość.",
    "origin": "Chiny",
    "segment": "Budżetowy / Standard",
    "founded_year": 2017,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Specjalista: Małe AGD",
    "acquisition_history": "Niezależna marka chińska operująca w modelu Global Direct-to-Consumer.",
    "product_categories": [
      "Płyty indukcyjne nastawne",
      "Wyciskarki wolnoobrotowe",
      "Maszynki do mięsa"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce."
    ],
    "producedBy": [
      "m-oem-china"
    ]
  },
  {
    "id": "b-ardo",
    "name": "Ardo",
    "history": "Historyczna włoska marka należąca niegdyś do imperium Antonio Merloniego. W latach 90. jeden z największych producentów AGD w Europie, znany z solidnych pralek i lodówek. Po problemach finansowych grupy, marka przeszła restrukturyzację i obecnie funkcjonuje w znacznie mniejszej skali, często operując na licencjach.",
    "origin": "Włochy",
    "segment": "Standard",
    "founded_year": 1968,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Szerokie Portfolio",
    "acquisition_history": "Po upadku grupy Antonio Merloni, prawa do marki przechodziły przez różne struktury holdingowe (m.in. J.P. Industries).",
    "product_categories": [
      "Pranie",
      "Chłodnictwo",
      "Gotowanie"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce."
    ],
    "producedBy": [
      "m-jp-industries"
    ]
  },
  {
    "id": "b-arebos",
    "name": "AREBOS",
    "history": "Niemiecka marka handlowa należąca do Canbolat Vertriebs GmbH. Oferuje niezwykle szeroki wachlarz produktów – od narzędzi warsztatowych po AGD kuchenne. Strategia marki opiera się na dostarczaniu produktów o standardowej funkcjonalności w najniższej możliwej cenie.",
    "origin": "Niemcy",
    "segment": "Ekonomiczny",
    "founded_year": 2009,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Szerokie Portfolio",
    "acquisition_history": "Własność Canbolat Vertriebs GmbH.",
    "product_categories": [
      "Małe AGD",
      "Płyty grzewcze",
      "Urządzenia warsztatowe"
    ],
    "factories_pl": [
      "Produkcja OEM w Azji."
    ],
    "producedBy": [
      "m-canbolat-vertriebs"
    ]
  },
  {
    "id": "b-cooke-lewis",
    "name": "Cooke & Lewis",
    "history": "Główna marka własna grupy Kingfisher (Castorama, B&Q) przed wprowadzeniem brandu GoodHome. Pod tą nazwą oferowano wysokiej jakości systemy mebli kuchennych oraz dopasowane do nich urządzenia AGD o nowoczesnym designie.",
    "origin": "Wielka Brytania",
    "segment": "Standard",
    "founded_year": 2000,
    "business_structure": "Marka Własna (Private Label)",
    "product_range": "Pełne Portfolio (Zabudowa)",
    "acquisition_history": "Zastępowana sukcesywnie przez markę GoodHome w ramach globalnej strategii Kingfisher.",
    "product_categories": [
      "Zmywanie",
      "Gotowanie",
      "Okapy Kuchenne"
    ],
    "factories_pl": [
      "Produkcja kontraktowa w fabrykach dużych producentów (np. Whirlpool, Beko)."
    ],
    "producedBy": [
      "m-kingfisher-plc"
    ]
  },
  {
    "id": "b-daewoo",
    "name": "Daewoo",
    "history": "Legenda koreańskiego przemysłu. Po rozpadzie czebola Daewoo, dział elektroniki stał się niezależnym bytem. Przez dekady marka kojarzona z innowacjami (np. mikrofale z funkcją pieczenia). Obecnie nazwa Daewoo jest często używana na zasadzie licencji przez różnych producentów w zależności od regionu świata.",
    "origin": "Korea Południowa",
    "segment": "Budżetowy / Standard",
    "founded_year": 1967,
    "business_structure": "Partnerstwo Licencyjne",
    "product_range": "Szerokie Portfolio",
    "acquisition_history": "Dział AGD został przekształcony w Winia Electronics, jednak prawa do samej nazwy Daewoo na wielu rynkach są licencjonowane zewnętrznym podmiotom.",
    "product_categories": [
      "Chłodnictwo",
      "Pranie",
      "Kuchenki mikrofalowe"
    ],
    "factories_pl": [
      "Historycznie posiadała potężne zakłady w Polsce, obecnie brak własnej produkcji."
    ],
    "producedBy": [
      "m-winia-electronics",
      "m-oem-various"
    ]
  },
  {
    "id": "b-lacor",
    "name": "Lacor",
    "history": "Hiszpański producent specjalizujący się w profesjonalnym wyposażeniu kuchni. Marka Lacor Menaje Profesional jest ceniona przez szefów kuchni za trwałość i ergonomię. Oferują zarówno drobne akcesoria, jak i specjalistyczne urządzenia elektryczne dla gastronomii i wymagających użytkowników domowych.",
    "origin": "Hiszpania",
    "segment": "Premium",
    "founded_year": 1949,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Specjalista: Gastronomia",
    "acquisition_history": "Niezależna firma hiszpańska.",
    "product_categories": [
      "Małe AGD profesjonalne",
      "Naczynia kuchenne",
      "Przetwórstwo żywności"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce."
    ],
    "producedBy": [
      "m-lacor-menaje"
    ]
  },
  {
    "id": "b-oceanic",
    "name": "Oceanic",
    "history": "Francuska marka z długą tradycją, obecnie należąca do grupy Cdiscount. Pozycjonowana jako marka 'Smart Choice', oferuje szeroki wybór AGD i RTV w cenach budżetowych, będąc jednym z najpopularniejszych wyborów we francuskim e-commerce.",
    "origin": "Francja",
    "segment": "Budżetowy",
    "founded_year": 1947,
    "business_structure": "Marka Własna (Private Label)",
    "product_range": "Pełne Portfolio",
    "acquisition_history": "Należy do Cnova N.V. (część grupy Casino/Cdiscount).",
    "product_categories": [
      "Chłodnictwo",
      "Pranie",
      "Gotowanie",
      "RTV"
    ],
    "factories_pl": [
      "Produkcja OEM w Chinach i Turcji (m.in. Vestel)."
    ],
    "producedBy": [
      "m-cdiscount-group"
    ]
  },
  {
    "id": "b-schild",
    "name": "Schild",
    "history": "Marka pozycjonowana na rynek europejski (często kojarzona z rynkiem polskim i szwajcarskim designem), specjalizująca się w okapach kuchennych i płytach grzewczych. Skupia się na dostarczaniu nowoczesnego wyglądu i dobrych parametrów technicznych w segmencie średnim.",
    "origin": "Polska / Szwajcaria (Design)",
    "segment": "Standard",
    "founded_year": 2012,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Specjalista: Gotowanie i Okapy",
    "acquisition_history": "Niezależna marka rozwijana przez dystrybutorów AGD.",
    "product_categories": [
      "Okapy Kuchenne",
      "Płyty Indukcyjne",
      "Piekarniki"
    ],
    "factories_pl": [
      "Produkcja mieszana (Polska/Turcja)."
    ],
    "producedBy": [
      "m-id-unknown"
    ]
  },
  {
    "id": "b-silvercrest",
    "name": "Silvercrest",
    "history": "Niezwykle rozpoznawalna marka własna sieci Lidl. Silvercrest stał się fenomenem rynkowym dzięki oferowaniu małego AGD (m.in. roboty kuchenne Monsieur Cuisine) o funkcjonalnościach marek luksusowych w ułamku ich ceny.",
    "origin": "Niemcy",
    "segment": "Budżetowy / Standard",
    "founded_year": 2005,
    "business_structure": "Marka Własna (Private Label)",
    "product_range": "Szerokie Portfolio (Małe AGD)",
    "acquisition_history": "Własność grupy Schwarz (Lidl & Kaufland).",
    "product_categories": [
      "Roboty kuchenne",
      "Małe AGD śniadaniowe",
      "Pielęgnacja osobista"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce; głównymi dostawcami są producenci OEM z Chin (m.in. Hoyer Handel)."
    ],
    "producedBy": [
      "m-schwarz-gruppe"
    ]
  },
  {
    "id": "b-simfer",
    "name": "Simfer",
    "history": "Turecki gigant produkcyjny, który z małego warsztatu produkującego piece stał się jednym z największych eksporterów AGD na świecie. Simfer specjalizuje się przede wszystkim w technologii pieczenia i gotowania, posiadając ogromne zaplecze badawczo-rozwojowe.",
    "origin": "Turcja",
    "segment": "Standard",
    "founded_year": 1977,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Szerokie Portfolio (Głównie Gotowanie)",
    "acquisition_history": "Niezależna turecka firma rodzinna.",
    "product_categories": [
      "Kuchnie wolnostojące",
      "Piekarniki",
      "Chłodnictwo",
      "Ogrzewanie"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce; ogromne zakłady produkcyjne w Turcji (Kayseri)."
    ],
    "producedBy": [
      "m-simfer-as"
    ]
  },
  {
    "id": "b-taurus",
    "name": "Taurus",
    "history": "Kluczowa marka hiszpańskiej grupy Taurus Group. Firma stawia na innowacje i ekspansję na rynki wschodzące. Taurus jest znany z wysokiej jakości małego AGD, które łączy nowoczesną elektronikę z ergonomicznym designem.",
    "origin": "Hiszpania",
    "segment": "Standard",
    "founded_year": 1962,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Szerokie Portfolio",
    "acquisition_history": "Główna marka Taurus Group, która w swoim portfolio posiada również marki takie jak Solac czy Casals.",
    "product_categories": [
      "Małe AGD kuchenne",
      "Roboty sprzątające",
      "Obróbka żywności"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce."
    ],
    "producedBy": [
      "m-taurus-group"
    ]
  },
  {
    "id": "b-vevor",
    "name": "VEVOR",
    "history": "Globalny gigant specjalizujący się w sprzęcie profesjonalnym i półprofesjonalnym. VEVOR dostarcza tysiące produktów z zakresu gastronomii, warsztatu i ogrodu. Ich model biznesowy opiera się na eliminacji pośredników, co pozwala oferować solidne, metalowe urządzenia (np. lodówki kompresorowe, piece do pizzy) w cenach amatorskich.",
    "origin": "Chiny",
    "segment": "Ekonomiczny / Premium (Funkcjonalność)",
    "founded_year": 2007,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Specjalista: Narzędzia i Gastronomia",
    "acquisition_history": "Niezależna grupa z potężnym zapleczem logistycznym na każdym kontynencie.",
    "product_categories": [
      "Gastronomia profesjonalna",
      "Lodówki turystyczne",
      "Przetwórstwo żywności"
    ],
    "factories_pl": [
      "Posiada duże centra logistyczne w Polsce (np. okolice Słubic)."
    ],
    "producedBy": [
      "m-vevor-group"
    ]
  },
  {
    "id": "b-vitrokitchen",
    "name": "Vitrokitchen",
    "history": "Hiszpański specjalista w dziedzinie gotowania gazowego. Marka wyróżnia się oferowaniem unikalnych rozwiązań, takich jak piekarniki gazowe z termoobiegiem oraz płyty gazowe 'gas-on-glass' o luksusowym wykończeniu. Skupiają się na tradycyjnych metodach gotowania w nowoczesnej formie.",
    "origin": "Hiszpania",
    "segment": "Standard / Premium",
    "founded_year": 1995,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Specjalista: Gotowanie",
    "acquisition_history": "Niezależne przedsiębiorstwo hiszpańskie.",
    "product_categories": [
      "Kuchnie wolnostojące",
      "Płyty gazowe",
      "Piekarniki gazowe"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce."
    ],
    "producedBy": [
      "m-vitrokitchen-spain"
    ]
  }
]
-SPLIT-
[
  {
    "id": "b-arset",
    "name": "Arset",
    "history": "Polska marka dystrybutorska specjalizująca się w okapach kuchennych. Skupia się na oferowaniu prostych, funkcjonalnych urządzeń o klasycznym wzornictwie, dedykowanych dla klientów poszukujących ekonomicznych rozwiązań do standardowych kuchni.",
    "origin": "Polska",
    "segment": "Ekonomiczny",
    "founded_year": 2005,
    "business_structure": "Marka Dystrybutorska (PL)",
    "product_range": "Specjalista: Okapy Kuchenne",
    "acquisition_history": "Niezależny polski podmiot handlowy.",
    "product_categories": [
      "Okapy Kuchenne"
    ],
    "factories_pl": [
      "Produkcja OEM (głównie Turcja i Chiny)."
    ],
    "producedBy": [
      "m-oem-various"
    ]
  },
  {
    "id": "b-cata-can-roca",
    "name": "Cata & Can Roca",
    "history": "Ekskluzywna linia produktów powstała w wyniku współpracy marki Cata z braćmi Roca – właścicielami legendarnej restauracji El Celler de Can Roca (wyróżnionej 3 gwiazdkami Michelin). Produkty z tej serii łączą profesjonalne parametry gastronomiczne z unikalnym, minimalistycznym designem.",
    "origin": "Hiszpania",
    "segment": "Premium / Luksusowy",
    "founded_year": 2013,
    "business_structure": "Grupa Kapitałowa",
    "product_range": "Specjalista: Gotowanie (Linia Premium)",
    "acquisition_history": "Dedykowana linia wewnątrz struktur CNA Group (Cata).",
    "product_categories": [
      "Płyty Indukcyjne",
      "Okap kuchenne",
      "Piekarniki"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce."
    ],
    "producedBy": [
      "m-cna-group"
    ]
  },
  {
    "id": "b-covercook",
    "name": "Covercook",
    "history": "Marka technologiczna operująca głównie w modelu sprzedaży bezpośredniej (e-commerce). Specjalizuje się w nowoczesnych płytach grzewczych, stawiając na zaawansowane funkcje, takie jak duża liczba pól grzewczych i sterowanie dotykowe w bardzo atrakcyjnej cenie.",
    "origin": "Chiny",
    "segment": "Budżetowy",
    "founded_year": 2018,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Specjalista: Płyty Grzewcze",
    "acquisition_history": "Niezależna marka chińska o zasięgu globalnym.",
    "product_categories": [
      "Płyty Indukcyjne",
      "Płyty Ceramiczne",
      "Płyty Gazowe"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce."
    ],
    "producedBy": [
      "m-oem-china"
    ]
  },
  {
    "id": "b-fenu",
    "name": "Fenu",
    "history": "Niszowa marka obecna w kanałach e-commerce, oferująca urządzenia kuchenne do zabudowy. Fenu pozycjonuje się jako dostawca nowoczesnego designu w segmencie budżetowym, celując w klientów urządzających mieszkania na wynajem.",
    "origin": "Polska / Chiny",
    "segment": "Ekonomiczny / Budżetowy",
    "founded_year": 2020,
    "business_structure": "Marka Dystrybutorska (PL)",
    "product_range": "Szerokie Portfolio (Zabudowa)",
    "acquisition_history": "Marka rozwijana przez polskich importerów.",
    "product_categories": [
      "Okapy Kuchenne",
      "Płyty Grzewcze"
    ],
    "factories_pl": [
      "Produkcja OEM."
    ],
    "producedBy": [
      "m-oem-various"
    ]
  },
  {
    "id": "b-galvamet",
    "name": "Galvamet",
    "history": "Włoska manufaktura specjalizująca się w produkcji okapów kuchennych o najwyższym stopniu zaawansowania technologicznego. Galvamet słynie z innowacyjnych systemów filtrowania plazmowego oraz okapów zintegrowanych z płytami, które są w całości produkowane we Włoszech z dbałością o detale rzemieślnicze.",
    "origin": "Włochy",
    "segment": "Premium / Luksusowy",
    "founded_year": 1974,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Specjalista: Wentylacja i Gotowanie",
    "acquisition_history": "Niezależna firma rodzinna z silnym zapleczem R&D we Włoszech.",
    "product_categories": [
      "Okapy Kuchenne",
      "Płyty z wyciągiem",
      "Systemy oczyszczania powietrza"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce; 100% Made in Italy."
    ],
    "producedBy": [
      "m-galvamet-italy"
    ]
  },
  {
    "id": "b-heinrichs",
    "name": "Heinrich'S",
    "history": "Niemiecka marka (Heinrich's German Quality) skupiająca się na dostarczaniu sprzętu AGD łączącego solidne wykonanie z przystępną ceną. Marka jest bardzo aktywna na rynkach e-commerce w Europie, oferując szeroki wybór od małego AGD po lodówki i płyty do zabudowy.",
    "origin": "Niemcy",
    "segment": "Budżetowy / Standard",
    "founded_year": 1990,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Szerokie Portfolio",
    "acquisition_history": "Własność grupy ERS Group, specjalizującej się w handlu międzynarodowym.",
    "product_categories": [
      "Chłodnictwo",
      "Gotowanie",
      "Małe AGD"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce; produkcja kontraktowa."
    ],
    "producedBy": [
      "m-ers-group"
    ]
  },
  {
    "id": "b-hobsir",
    "name": "Hobsir",
    "history": "Marka specjalistyczna skoncentrowana na produkcji płyt grzewczych. Hobsir zdobywa rynek poprzez platformy sprzedażowe, oferując urządzenia o minimalistycznym wyglądzie, które mają konkurować z liderami rynku znacznie niższą ceną przy zachowaniu podstawowych norm jakościowych.",
    "origin": "Chiny",
    "segment": "Ekonomiczny / Budżetowy",
    "founded_year": 2019,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Specjalista: Płyty Grzewcze",
    "acquisition_history": "Chiński podmiot produkcyjno-handlowy.",
    "product_categories": [
      "Płyty Indukcyjne",
      "Płyty Ceramiczne"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce."
    ],
    "producedBy": [
      "m-oem-china"
    ]
  },
  {
    "id": "b-iceberg",
    "name": "Iceberg",
    "history": "Polska marka dystrybutorska, która swoją nazwę wywodzi od chłodnictwa, ale skutecznie rozszerzyła ofertę o okapy i drobny sprzęt kuchenny. Produkty Iceberg są projektowane z myślą o polskim rynku, łącząc estetykę inox i szkła z optymalną wydajnością.",
    "origin": "Polska",
    "segment": "Budżetowy / Standard",
    "founded_year": 2008,
    "business_structure": "Marka Dystrybutorska (PL)",
    "product_range": "Szerokie Portfolio",
    "acquisition_history": "Niezależna marka zarządzana przez krajowych importerów.",
    "product_categories": [
      "Okapy Kuchenne",
      "Chłodnictwo",
      "Zamrażarki"
    ],
    "factories_pl": [
      "Produkcja OEM (Turcja, Chiny)."
    ],
    "producedBy": [
      "m-oem-various"
    ]
  },
  {
    "id": "b-kage",
    "name": "KAGE",
    "history": "Marka specjalizująca się w nowoczesnych okapach kuchennych, często spotykana w wyspecjalizowanych sklepach z AGD do zabudowy. KAGE stawia na design inspirowany stylem industrialnym i wysoką wydajność turbin, celując w segment średni wyższy.",
    "origin": "Polska / Europa",
    "segment": "Standard / Premium",
    "founded_year": 2015,
    "business_structure": "Przedsiębiorstwo Prywatne (PL)",
    "product_range": "Specjalista: Okapy Kuchenne",
    "acquisition_history": "Niezależny brand rozwijany w ramach partnerstw produkcyjnych.",
    "product_categories": [
      "Okapy kuchenne",
      "Akcesoria wentylacyjne"
    ],
    "factories_pl": [
      "Częściowy montaż lub produkcja kontraktowa w Polsce."
    ],
    "producedBy": [
      "m-id-unknown"
    ]
  },
  {
    "id": "b-livoo",
    "name": "Livoo",
    "history": "Francuska marka 'lifestyle', której misją jest dostarczanie produktów ułatwiających codzienne życie i wspólne spędzanie czasu. Livoo oferuje sprzęt o bardzo nowoczesnym, kolorowym designie, który wyróżnia się na tle tradycyjnego, monochromatycznego AGD.",
    "origin": "Francja",
    "segment": "Standard",
    "founded_year": 2018,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Szerokie Portfolio",
    "acquisition_history": "Ewolucja marki Domoclip; należy do grupy Delta.",
    "product_categories": [
      "Małe AGD",
      "Płyty grzewcze nastawne",
      "Urządzenia do przygotowywania posiłków"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce."
    ],
    "producedBy": [
      "m-delta-france"
    ]
  },
  {
    "id": "b-melchioni",
    "name": "Melchioni",
    "history": "Włoska grupa handlowa z ponad 70-letnią historią. Melchioni to marka o bardzo szerokim spektrum – od komponentów elektronicznych po sprzęt AGD (linia Melchioni Family). Znana z praktycznych rozwiązań, takich jak minipiekarniki i płyty do zabudowy dla małych przestrzeni.",
    "origin": "Włochy",
    "segment": "Budżetowy / Standard",
    "founded_year": 1947,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Szerokie Portfolio",
    "acquisition_history": "Niezależna grupa Melchioni S.p.A.",
    "product_categories": [
      "Gotowanie",
      "Małe AGD",
      "Chłodnictwo przenośne"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce."
    ],
    "producedBy": [
      "m-melchioni-spa"
    ]
  },
  {
    "id": "b-neto",
    "name": "Neto",
    "history": "Marka skupiona na akcesoriach kuchennych i rozwiązaniach z zakresu zabudowy. Neto często pojawia się jako marka uzupełniająca w ofertach studiów kuchennych, oferując okapy o poprawnych parametrach technicznych w konkurencyjnych cenach.",
    "origin": "Polska",
    "segment": "Budżetowy",
    "founded_year": 2010,
    "business_structure": "Marka Dystrybutorska (PL)",
    "product_range": "Specjalista: Akcesoria Kuchenne",
    "acquisition_history": "Marka zarządzana przez lokalnych dystrybutorów AGD.",
    "product_categories": [
      "Okapy Kuchenne",
      "Zlewozmywaki"
    ],
    "factories_pl": [
      "Produkcja OEM."
    ],
    "producedBy": [
      "m-oem-various"
    ]
  },
  {
    "id": "b-novoterm",
    "name": "Novoterm",
    "history": "Szczecińska firma będąca właścicielem znanych marek takich jak Kerra czy Loge. Choć Novoterm kojarzony jest głównie z armaturą łazienkową, pod swoimi markami oferuje również urządzenia AGD do zabudowy, które uzupełniają ofertę wyposażenia wnętrz.",
    "origin": "Polska",
    "segment": "Standard",
    "founded_year": 1993,
    "business_structure": "Przedsiębiorstwo Prywatne (PL)",
    "product_range": "Szerokie Portfolio (Wyposażenie)",
    "acquisition_history": "Polska firma rodzinna.",
    "product_categories": [
      "Okapy Kuchenne",
      "Zlewozmywaki",
      "Armatura"
    ],
    "factories_pl": [
      "Produkcja mieszana; własne zaplecze projektowe i logistyczne w Polsce."
    ],
    "producedBy": [
      "m-novoterm-szczecin"
    ]
  },
  {
    "id": "b-obi",
    "name": "OBI",
    "history": "Niemiecka sieć marketów budowlanych, która pod własnym szyldem (lub markami takimi jak Balter) oferuje podstawowe urządzenia AGD. Produkty OBI są projektowane jako ekonomiczne uzupełnienie ofert mebli kuchennych dostępnych w markecie.",
    "origin": "Niemcy",
    "segment": "Ekonomiczny / Budżetowy",
    "founded_year": 1970,
    "business_structure": "Marka Własna (Private Label)",
    "product_range": "Szerokie Portfolio",
    "acquisition_history": "Część grupy Tengelmann.",
    "product_categories": [
      "Gotowanie",
      "Zlewozmywaki",
      "Małe AGD"
    ],
    "factories_pl": [
      "Produkcja OEM realizowana przez zewnętrznych dostawców."
    ],
    "producedBy": [
      "m-obi-group"
    ]
  },
  {
    "id": "b-smartcook",
    "name": "Smartcook",
    "history": "Nowoczesna marka własna skupiona na inteligentnych i energooszczędnych rozwiązaniach do kuchni. Smartcook oferuje urządzenia, które mają ułatwiać zdrowe gotowanie, ze szczególnym uwzględnieniem płyt indukcyjnych i piekarników o intuicyjnym interfejsie.",
    "origin": "Polska / Europa",
    "segment": "Standard",
    "founded_year": 2017,
    "business_structure": "Marka Dystrybutorska (PL)",
    "product_range": "Specjalista: Gotowanie",
    "acquisition_history": "Niezależny brand rozwijany przez dystrybutorów technologii kuchennych.",
    "product_categories": [
      "Płyty Indukcyjne",
      "Piekarniki",
      "Okapy"
    ],
    "factories_pl": [
      "Produkcja OEM."
    ],
    "producedBy": [
      "m-oem-various"
    ]
  },
  {
    "id": "b-stella",
    "name": "Stella",
    "history": "Marka często spotykana w segmencie akcesoriów kuchennych i okapów budżetowych. Stella koncentruje się na dostarczaniu produktów o prostej konstrukcji, które są łatwe w montażu i konserzechacji, dedykowane do masowego odbiorcy.",
    "origin": "Polska / Turcja",
    "segment": "Ekonomiczny",
    "founded_year": 2012,
    "business_structure": "Marka Dystrybutorska (PL)",
    "product_range": "Specjalista: Okapy i Zlewozmywaki",
    "acquisition_history": "Marka handlowa dystrybutorów wyposażenia kuchni.",
    "product_categories": [
      "Okapy Kuchenne",
      "Zlewozmywaki"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce; głównie Turcja."
    ],
    "producedBy": [
      "m-oem-turkey"
    ]
  },
  {
    "id": "b-tognana",
    "name": "Tognana",
    "history": "Legendarny włoski producent porcelany, który rozszerzył swoją ofertę o naczynia do gotowania oraz sprzęt AGD. Tognana przenosi swoje ogromne doświadczenie w dziedzinie ceramiki na produkty kuchenne, oferując płyty grzewcze i akcesoria o wyjątkowej estetyce i włoskim charakterze.",
    "origin": "Włochy",
    "segment": "Standard / Premium",
    "founded_year": 1775,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Szerokie Portfolio (Wyposażenie Kuchni)",
    "acquisition_history": "Niezależna firma Tognana Porcellane S.p.A.",
    "product_categories": [
      "Płyty grzewcze",
      "Małe AGD kuchenne",
      "Naczynia i Porcelana"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce."
    ],
    "producedBy": [
      "m-tognana-spa"
    ]
  },
  {
    "id": "b-vovv",
    "name": "Vovv",
    "history": "Marka e-commerce specjalizująca się w dostarczaniu komponentów AGD do zabudowy. Vovv skupia się na prostej formie i nowoczesnych materiałach (szkło hartowane), oferując płyty grzewcze w cenach znacznie poniżej średniej rynkowej dla markowych produktów.",
    "origin": "Chiny",
    "segment": "Ekonomiczny",
    "founded_year": 2021,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Specjalista: Płyty Grzewcze",
    "acquisition_history": "Marka technologiczna ukierunkowana na globalną sprzedaż online.",
    "product_categories": [
      "Płyty Indukcyjne",
      "Płyty Ceramiczne"
    ],
    "factories_pl": [
      "Brak produkcji w Polsce."
    ],
    "producedBy": [
      "m-oem-china"
    ]
  },
  {
    "id": "b-topstrong",
    "name": "TopStrong",
    "history": "Marka o profilu przemysłowo-domowym, oferująca akcesoria i sprzęt do kuchni. TopStrong stawia na wytrzymałość materiałów (stal nierdzewna) i proste, niemal surowe rozwiązania techniczne, które sprawdzają się w intensywnie użytkowanych kuchniach.",
    "origin": "Chiny",
    "segment": "Ekonomiczny",
    "founded_year": 2014,
    "business_structure": "Przedsiębiorstwo Prywatne",
    "product_range": "Szerokie Portfolio (Akcesoria/AGD)",
    "acquisition_history": "Marka handlowa o zasięgu międzynarodowym.",
    "product_categories": [
      "Okapy Kuchenne",
      "Akcesoria montażowe",
      "Małe AGD"
    ],
    "factories_pl": [
      "Produkcja OEM."
    ],
    "producedBy": [
      "m-oem-china"
    ]
  }
]
`;

let allNewBrands = [];
const blocks = newBrandsHtml.split('-SPLIT-').map(t => t.trim());
for (const block of blocks) {
  try {
    const arr = JSON.parse(block);
    allNewBrands = allNewBrands.concat(arr);
  } catch (err) {
    console.error("Parse error on block:", err);
  }
}

// Add 'type': 'brand' to all of them
allNewBrands.forEach(b => {
    b.type = 'brand';
});

let updatedCount = 0;
let addedCount = 0;

for (const newBrand of allNewBrands) {
    const idx = dataset.nodes.findIndex(node => node.id === newBrand.id);
    if (idx !== -1) {
        // Merge
        dataset.nodes[idx] = { ...dataset.nodes[idx], ...newBrand };
        updatedCount++;
    } else {
        // Append
        dataset.nodes.push(newBrand);
        addedCount++;
    }
}

fs.writeFileSync(datasetPath, JSON.stringify(dataset, null, 2), 'utf8');
console.log(`Successfully added ${addedCount} and updated ${updatedCount} brands in dataset.json`);
