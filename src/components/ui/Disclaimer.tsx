import React from 'react';

/**
 * Zastrzeżenie do danych plus droga do korekty.
 *
 * Serwis stawia twierdzenia o realnych firmach — kto do kogo należy, gdzie
 * produkuje, z jakiego kraju pochodzi. Widoczna informacja, że dane są
 * poglądowe i że błąd można zgłosić jednym kliknięciem, sprawia, że firma,
 * która chce coś sprostować, pisze maila zamiast szukać innej drogi.
 */

export const CONTACT_EMAIL = 'kontakt@ktostoiza.pl';

/** Link zgłoszenia z tematem uzupełnionym o nazwę wpisu. */
export function correctionMailto(subject?: string) {
  const topic = subject ? `Zgłoszenie poprawki: ${subject}` : 'Zgłoszenie poprawki';
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(topic)}`;
}

const DISCLAIMER_TEXT =
  'Dane mają charakter poglądowy i pochodzą ze źródeł publicznych oraz opracowań własnych. ' +
  'Mogą być niepełne lub nieaktualne — struktury właścicielskie zmieniają się częściej, ' +
  'niż nadążają za nimi opracowania.';

const TRADEMARK_TEXT =
  'Nazwy i znaki towarowe należą do ich właścicieli. Używamy ich wyłącznie w celu ' +
  'identyfikacji; serwis nie jest powiązany z żadną z wymienionych firm ani przez nie sponsorowany.';

/** Wersja pełna — pod treścią podstrony marki. */
export function Disclaimer({ subject }: { subject?: string }) {
  return (
    <aside className="mt-10 pt-8 border-t border-slate-200 text-slate-500 text-[13px] leading-relaxed">
      <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3">
        Zastrzeżenia
      </h2>
      <p className="mb-2">{DISCLAIMER_TEXT}</p>
      <p className="mb-4">{TRADEMARK_TEXT}</p>
      <p>
        Widzisz błąd albo reprezentujesz opisywaną firmę?{' '}
        <a
          href={correctionMailto(subject)}
          className="font-bold text-blue-600 hover:text-blue-700 underline decoration-blue-200 underline-offset-2"
        >
          Zgłoś poprawkę
        </a>{' '}
        — poprawiamy albo usuwamy wpis.
      </p>
    </aside>
  );
}

/** Wersja skrócona — w panelu bocznym na mapie, gdzie miejsca jest mało. */
export function DisclaimerCompact({ subject }: { subject?: string }) {
  return (
    <p className="px-6 pb-6 pt-2 text-[11px] leading-relaxed text-slate-400">
      Dane poglądowe, mogą być niepełne lub nieaktualne. Znaki towarowe należą do
      ich właścicieli.{' '}
      <a
        href={correctionMailto(subject)}
        className="font-bold text-slate-500 hover:text-blue-600 underline decoration-slate-300 underline-offset-2"
      >
        Zgłoś poprawkę
      </a>
    </p>
  );
}
