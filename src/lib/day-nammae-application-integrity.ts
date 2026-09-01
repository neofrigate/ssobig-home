export function resolveDayNammaeDuplicateUpload(params: {
  edgeBody: Record<string, unknown> | null;
  currentUuid: string;
  uploadedPath: string;
}) {
  const { edgeBody, currentUuid, uploadedPath } = params;
  const persistedUuid =
    typeof edgeBody?.uuid === "string" && edgeBody.uuid.trim()
      ? edgeBody.uuid.trim()
      : currentUuid;
  const duplicate = edgeBody?.duplicate === true;

  return {
    persistedUuid,
    duplicate,
    shouldCleanupUpload:
      duplicate &&
      Boolean(uploadedPath) &&
      Boolean(persistedUuid) &&
      persistedUuid !== currentUuid,
  };
}

function safeString(value: unknown, maxLength = 100) {
  return typeof value === "string" ? value.slice(0, maxLength) : "";
}

function safeNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function sanitizeDayNammaeSentryContext(params: {
  debugClientContext: Record<string, unknown> | null;
  photoContext: Record<string, unknown>;
}) {
  const { debugClientContext, photoContext } = params;

  return {
    photoType: safeString(photoContext.photoType),
    photoSize: safeNumber(photoContext.photoSize),
    inAppBrowserName: safeString(debugClientContext?.inAppBrowserName, 40),
    viewport: safeString(debugClientContext?.viewport, 40),
    onLine: debugClientContext?.onLine === true,
    visibilityState: safeString(debugClientContext?.visibilityState, 40),
    connectionEffectiveType: safeString(
      debugClientContext?.connectionEffectiveType,
      40,
    ),
    connectionRtt: safeNumber(debugClientContext?.connectionRtt),
    connectionDownlink: safeNumber(debugClientContext?.connectionDownlink),
    connectionSaveData: debugClientContext?.connectionSaveData === true,
  };
}
