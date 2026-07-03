import {
  defaultLocale,
  supportedLocales,
  type LocaleCode,
} from "./platform-system-model.server.ts";

export type LocalizedRecord<T> = T & {
  locale: LocaleCode | string;
};

export type LocalizedPickResult<T> = {
  translation: LocalizedRecord<T>;
  requestedLocale: string;
  resolvedLocale: string;
  fallbackUsed: boolean;
};

export function resolveLocale(locale?: string | null): LocaleCode {
  if (locale && supportedLocales.includes(locale as LocaleCode)) {
    return locale as LocaleCode;
  }

  return defaultLocale;
}

export function getLocaleFallbacks(
  requestedLocale?: string | null,
  availableLocales: string[] = [],
): string[] {
  const requested = requestedLocale?.trim() || defaultLocale;
  const fallbacks = [requested, defaultLocale, ...availableLocales];
  return Array.from(new Set(fallbacks.filter(Boolean)));
}

export function pickTranslation<T>(
  translations: Array<LocalizedRecord<T>>,
  requestedLocale?: string | null,
): LocalizedPickResult<T> | null {
  if (translations.length === 0) return null;

  const fallbackLocales = getLocaleFallbacks(
    requestedLocale,
    translations.map((translation) => translation.locale),
  );

  for (const locale of fallbackLocales) {
    const translation = translations.find((item) => item.locale === locale);
    if (translation) {
      return {
        translation,
        requestedLocale: requestedLocale?.trim() || defaultLocale,
        resolvedLocale: translation.locale,
        fallbackUsed: translation.locale !== (requestedLocale?.trim() || defaultLocale),
      };
    }
  }

  const [translation] = translations;
  return {
    translation,
    requestedLocale: requestedLocale?.trim() || defaultLocale,
    resolvedLocale: translation.locale,
    fallbackUsed: true,
  };
}
