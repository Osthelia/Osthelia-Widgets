/**
 * Osthelia-Widgets — i18n
 *
 * Translations of the widgets' texts and the `t()` helper, language picked from the `?lang=` param.
 *
 * @copyright Copyright (c) 2026 Osthelia — Widgets
 * @license   https://github.com/Osthelia/Widgets/blob/main/LICENSE.md Osthelia License v1.0
 * @link      https://github.com/Osthelia/Widgets
 */

const MESSAGES = {
  en: { loading: "Loading", credit: "Widget provided by GC Stats", noData: "No data", error: "Unable to load the widget", heatmap: "Position heatmap on {map}" },
  fr: { loading: "Chargement", credit: "Widget fourni par GC Stats", noData: "Aucune donnée", error: "Impossible de charger le widget", heatmap: "Heatmap des positions sur {map}" },
  es: { loading: "Cargando", credit: "Widget proporcionado por GC Stats", noData: "Sin datos", error: "No se pudo cargar el widget", heatmap: "Mapa de calor de posiciones en {map}" },
  pt: { loading: "Carregando", credit: "Widget fornecido por GC Stats", noData: "Sem dados", error: "Não foi possível carregar o widget", heatmap: "Mapa de calor de posições em {map}" },
  tr: { loading: "Yükleniyor", credit: "Widget GC Stats tarafından sağlanmıştır", noData: "Veri yok", error: "Widget yüklenemedi", heatmap: "{map} üzerindeki konum ısı haritası" },
  ja: { loading: "読み込み中", credit: "GC Stats 提供のウィジェット", noData: "データなし", error: "ウィジェットを読み込めません", heatmap: "{map} のポジションヒートマップ" },
  ko: { loading: "로딩 중", credit: "GC Stats 제공 위젯", noData: "데이터 없음", error: "위젯을 불러올 수 없습니다", heatmap: "{map} 위치 히트맵" },
  de: { loading: "Wird geladen", credit: "Widget bereitgestellt von GC Stats", noData: "Keine Daten", error: "Widget konnte nicht geladen werden", heatmap: "Positions-Heatmap auf {map}" },
  zh: { loading: "加载中", credit: "Widget 由 GC Stats 提供", noData: "暂无数据", error: "无法加载小组件", heatmap: "{map} 位置热力图" },
  it: { loading: "Caricamento", credit: "Widget fornito da GC Stats", noData: "Nessun dato", error: "Impossibile caricare il widget", heatmap: "Heatmap delle posizioni su {map}" },
  pl: { loading: "Ładowanie", credit: "Widget udostępniony przez GC Stats", noData: "Brak danych", error: "Nie udało się załadować widżetu", heatmap: "Mapa cieplna pozycji na {map}" },
  ar: { loading: "جارٍ التحميل", credit: "الودجت مقدم من GC Stats", noData: "لا توجد بيانات", error: "تعذر تحميل الودجت", heatmap: "خريطة حرارية للمواقع على {map}" },
  th: { loading: "กำลังโหลด", credit: "วิดเจ็ตจัดทำโดย GC Stats", noData: "ไม่มีข้อมูล", error: "ไม่สามารถโหลดวิดเจ็ตได้", heatmap: "ฮีตแมปตำแหน่งบน {map}" },
} as const;

export type Locale = keyof typeof MESSAGES;
export type MessageKey = keyof (typeof MESSAGES)["en"];

function detectLocale(): Locale {
  const wanted = new URLSearchParams(window.location.search).get("lang") ?? navigator.language;
  const short = wanted.slice(0, 2).toLowerCase();
  return short in MESSAGES ? (short as Locale) : "en";
}

const locale = detectLocale();
document.documentElement.lang = locale;
document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";

/** Translates a key in the `?lang=` locale (browser language otherwise, English as fallback). */
export function t(key: MessageKey, vars?: Record<string, string>): string {
  const text: string = MESSAGES[locale][key];
  return text.replace(/\{(\w+)\}/g, (match, name: string) => vars?.[name] ?? match);
}
