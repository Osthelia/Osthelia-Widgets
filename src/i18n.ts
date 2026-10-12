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
  en: { loading: "Loading", credit: "Widget provided by GC Stats", noData: "No data", error: "Unable to load the widget", heatmap: "Position heatmap on {map}", ban: "Ban", pick: "Pick", decider: "Decider", sideChoice: "chooses a side", attack: "Attack", defense: "Defense", vetoWaiting: "Waiting for the teams", vetoChoosing: "Choosing who starts", vetoDone: "Veto complete" },
  fr: { loading: "Chargement", credit: "Widget fourni par GC Stats", noData: "Aucune donnée", error: "Impossible de charger le widget", heatmap: "Heatmap des positions sur {map}", ban: "Ban", pick: "Pick", decider: "Decider", sideChoice: "choisit un side", attack: "Attaque", defense: "Défense", vetoWaiting: "En attente des équipes", vetoChoosing: "Choix de qui commence", vetoDone: "Veto terminé" },
  es: { loading: "Cargando", credit: "Widget proporcionado por GC Stats", noData: "Sin datos", error: "No se pudo cargar el widget", heatmap: "Mapa de calor de posiciones en {map}", ban: "Ban", pick: "Pick", decider: "Decider", sideChoice: "elige un lado", attack: "Ataque", defense: "Defensa", vetoWaiting: "Esperando a los equipos", vetoChoosing: "Eligiendo quién empieza", vetoDone: "Veto completado" },
  pt: { loading: "Carregando", credit: "Widget fornecido por GC Stats", noData: "Sem dados", error: "Não foi possível carregar o widget", heatmap: "Mapa de calor de posições em {map}", ban: "Ban", pick: "Pick", decider: "Decider", sideChoice: "escolhe um lado", attack: "Ataque", defense: "Defesa", vetoWaiting: "Aguardando as equipes", vetoChoosing: "Escolhendo quem começa", vetoDone: "Veto concluído" },
  tr: { loading: "Yükleniyor", credit: "Widget GC Stats tarafından sağlanmıştır", noData: "Veri yok", error: "Widget yüklenemedi", heatmap: "{map} üzerindeki konum ısı haritası", ban: "Ban", pick: "Pick", decider: "Decider", sideChoice: "taraf seçiyor", attack: "Saldırı", defense: "Savunma", vetoWaiting: "Takımlar bekleniyor", vetoChoosing: "Kimin başlayacağı seçiliyor", vetoDone: "Veto tamamlandı" },
  ja: { loading: "読み込み中", credit: "GC Stats 提供のウィジェット", noData: "データなし", error: "ウィジェットを読み込めません", heatmap: "{map} のポジションヒートマップ", ban: "BAN", pick: "PICK", decider: "DECIDER", sideChoice: "がサイドを選択", attack: "アタック", defense: "ディフェンス", vetoWaiting: "チームを待機中", vetoChoosing: "先攻を選択中", vetoDone: "ベト完了" },
  ko: { loading: "로딩 중", credit: "GC Stats 제공 위젯", noData: "데이터 없음", error: "위젯을 불러올 수 없습니다", heatmap: "{map} 위치 히트맵", ban: "밴", pick: "픽", decider: "결정 맵", sideChoice: "진영 선택 중", attack: "공격", defense: "수비", vetoWaiting: "팀 대기 중", vetoChoosing: "선공 선택 중", vetoDone: "벳 완료" },
  de: { loading: "Wird geladen", credit: "Widget bereitgestellt von GC Stats", noData: "Keine Daten", error: "Widget konnte nicht geladen werden", heatmap: "Positions-Heatmap auf {map}", ban: "Ban", pick: "Pick", decider: "Decider", sideChoice: "wählt eine Seite", attack: "Angriff", defense: "Verteidigung", vetoWaiting: "Warten auf die Teams", vetoChoosing: "Wer beginnt, wird gewählt", vetoDone: "Veto abgeschlossen" },
  zh: { loading: "加载中", credit: "Widget 由 GC Stats 提供", noData: "暂无数据", error: "无法加载小组件", heatmap: "{map} 位置热力图", ban: "禁用", pick: "选择", decider: "决胜图", sideChoice: "选择阵营", attack: "进攻", defense: "防守", vetoWaiting: "等待队伍", vetoChoosing: "正在选择先手", vetoDone: "选图完成" },
  it: { loading: "Caricamento", credit: "Widget fornito da GC Stats", noData: "Nessun dato", error: "Impossibile caricare il widget", heatmap: "Heatmap delle posizioni su {map}", ban: "Ban", pick: "Pick", decider: "Decider", sideChoice: "sceglie un lato", attack: "Attacco", defense: "Difesa", vetoWaiting: "In attesa delle squadre", vetoChoosing: "Scelta di chi inizia", vetoDone: "Veto completato" },
  pl: { loading: "Ładowanie", credit: "Widget udostępniony przez GC Stats", noData: "Brak danych", error: "Nie udało się załadować widżetu", heatmap: "Mapa cieplna pozycji na {map}", ban: "Ban", pick: "Pick", decider: "Decider", sideChoice: "wybiera stronę", attack: "Atak", defense: "Obrona", vetoWaiting: "Oczekiwanie na drużyny", vetoChoosing: "Wybór, kto zaczyna", vetoDone: "Veto zakończone" },
  ar: { loading: "جارٍ التحميل", credit: "الودجت مقدم من GC Stats", noData: "لا توجد بيانات", error: "تعذر تحميل الودجت", heatmap: "خريطة حرارية للمواقع على {map}", ban: "حظر", pick: "اختيار", decider: "الخريطة الحاسمة", sideChoice: "يختار الجانب", attack: "هجوم", defense: "دفاع", vetoWaiting: "بانتظار الفرق", vetoChoosing: "اختيار من يبدأ", vetoDone: "اكتمل الفيتو" },
  th: { loading: "กำลังโหลด", credit: "วิดเจ็ตจัดทำโดย GC Stats", noData: "ไม่มีข้อมูล", error: "ไม่สามารถโหลดวิดเจ็ตได้", heatmap: "ฮีตแมปตำแหน่งบน {map}", ban: "แบน", pick: "เลือก", decider: "แมพตัดสิน", sideChoice: "เลือกฝั่ง", attack: "บุก", defense: "รับ", vetoWaiting: "รอทีม", vetoChoosing: "กำลังเลือกผู้เริ่ม", vetoDone: "เวโต้เสร็จสิ้น" },
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
