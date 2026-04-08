import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Polityka Prywatności | KtoStoiZa',
  description: 'Zasady przetwarzania i ochrony danych użytkowników korzystających z serwisu KtoStoiZa.pl',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl border border-slate-200 p-8 sm:p-12">
        <Link 
          href="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-bold mb-10 transition-colors bg-blue-50 px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Powrót do mapy
        </Link>

        <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-10">Polityka Prywatności Serwisu KtoStoiZa.pl</h1>

        <div className="space-y-10 text-slate-700 leading-relaxed text-lg">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm">1</span> 
              Informacje Ogólne
            </h2>
            <p>
              Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych użytkowników korzystających z serwisu KtoStoiZa.pl (dalej: "Serwis"). Serwis ma charakter czysto informacyjny i służy do wizualizacji powiązań kapitałowych w branży AGD.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm">2</span> 
              Administrator Danych
            </h2>
            <p>
              Administratorem Serwisu jest Redakcja KtoStoiZa.pl. W sprawach związanych z funkcjonowaniem strony oraz ochroną prywatności można kontaktować się drogą elektroniczną pod adresem: <strong>kontakt@ktostoiza.pl</strong>.
            </p>
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-5 text-amber-900 text-base">
              <strong>Uwaga:</strong> Serwis nie umożliwia zakładania kont użytkowników, przesyłania komentarzy ani subskrypcji newslettera, w związku z czym nie gromadzi bezpośrednio Twoich danych osobowych (imion, nazwisk, adresów).
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm">3</span> 
              Ciasteczka (Cookies) i Dane Techniczne
            </h2>
            <p className="mb-3">Serwis korzysta z plików cookies oraz narzędzi analitycznych (np. Vercel Analytics, Google Analytics) w celu:</p>
            <ul className="list-disc pl-8 space-y-2">
              <li>Prawidłowego wyświetlania interaktywnej mapy.</li>
              <li>Zbierania anonimowych statystyk ruchu (typ przeglądarki, kraj, czas spędzony na stronie).</li>
              <li>Obsługi programów partnerskich.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm">4</span> 
              Linki Partnerskie (Afiliacja)
            </h2>
            <p className="mb-3">
              W Serwisie znajdują się przyciski przekierowujące do zewnętrznych sklepów (np. Media Expert, RTV Euro AGD) oraz porównywarki Ceneo.
            </p>
            <ul className="list-disc pl-8 space-y-2">
              <li>Kliknięcie w przycisk może spowodować zapisanie pliku cookie partnera na Twoim urządzeniu.</li>
              <li>Ma to na celu wyłącznie identyfikację źródła przejścia (tzw. afiliacja) i nie służy do Twojej osobistej identyfikacji przez Redakcję Serwisu.</li>
              <li>Zasady przetwarzania danych w tych sklepach określają ich własne polityki prywatności.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm">5</span> 
              Prawa Użytkownika
            </h2>
            <p className="mb-3">
              Mimo że nie zbieramy Twoich danych, masz prawo do:
            </p>
            <ul className="list-disc pl-8 space-y-2">
              <li>Zarządzania plikami cookies w ustawieniach swojej przeglądarki (możesz je w każdej chwili zablokować).</li>
              <li>Korzystania z Serwisu w sposób anonimowy (np. w trybie incognito).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm">6</span> 
              Wyłączenie Odpowiedzialności
            </h2>
            <p>
              Dane prezentowane na mapie powiązań pochodzą z ogólnodostępnych źródeł informacji (raporty roczne, strony producentów, KRS). Redakcja dokłada wszelkich starań, aby były one aktualne, jednak nie ponosi odpowiedzialności za nagłe zmiany kapitałowe lub błędy w danych źródłowych.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
