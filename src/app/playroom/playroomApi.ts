export const PLAYROOM_PUBLIC_API_BASE =
  "https://tlyioijsopxeegzfjlqe.supabase.co/functions/v1/marketing-management-api/public";

export type PlayroomTemplateCategory = "story_mystery" | "friends";

export interface PlayroomTemplateApiItem {
  category: PlayroomTemplateCategory;
  ssobig_tool_template_id: string;
  title: string;
  description: string;
  players_label: string;
  price_label: string;
  card_image_url: string;
  destination_url: string;
  locale?: string;
  locale_visibility?: string;
  game_settings_id?: string | null;
  detail_description?: string | null;
  detail_description_html?: string | null;
  detail_description_format?: string | null;
  imageUrl?: string | null;
  backgroundImageUrl?: string | null;
  logoImageUrl?: string | null;
  themeColor?: string | number | null;
  isDarkMode?: boolean | null;
  credit?: string | number | null;
  minPlayerCount?: string | number | null;
  maxPlayerCount?: string | number | null;
  minPlayers?: string | number | null;
  maxPlayers?: string | number | null;
  minTimeMinutes?: string | number | null;
  maxTimeMinutes?: string | number | null;
  rating_average?: string | number | null;
  game?: {
    imageUrl?: string | null;
    backgroundImageUrl?: string | null;
    logoImageUrl?: string | null;
    themeColor?: string | number | null;
    isDarkMode?: boolean | null;
  } | null;
}

export function buildPlayroomTemplatesApiUrl(locale?: string) {
  const url = new URL(`${PLAYROOM_PUBLIC_API_BASE}/playroom-template-summaries`);
  if (locale) {
    url.searchParams.set("locale", locale);
  }
  return url;
}

export function buildPlayroomTemplateDetailApiUrl(
  locale: string,
  gameSettingsId: string,
) {
  const url = new URL(`${PLAYROOM_PUBLIC_API_BASE}/playroom-template-detail`);
  url.searchParams.set("locale", locale);
  url.searchParams.set("gameSettingsId", gameSettingsId);
  return url;
}
