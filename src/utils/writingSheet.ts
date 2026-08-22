export const WRITING_SHEET_EXTENSION_THRESHOLD = 220;

export function shouldExtendWritingSheet(
  scrollTop: number,
  clientHeight: number,
  scrollHeight: number,
  threshold = WRITING_SHEET_EXTENSION_THRESHOLD,
) {
  return scrollTop + clientHeight >= scrollHeight - threshold;
}
