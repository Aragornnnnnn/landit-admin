// 붙여넣은 ID 목록을 해석한다 — 푸시 대상·개인 편지 받는 사람이 같은 입력 규칙을 쓴다
export interface ParsedIds {
  ids: number[];
  recognized: number;
  duplicates: number;
  invalid: number;
}

/** "1284, 1283\n#1279 1201" → ID 목록. 쉼표·세미콜론·공백·줄바꿈이 구분자, 앞의 #은 뗀다. 양의 정수만 인식한다 */
export function parseIdList(text: string): ParsedIds {
  const seen = new Set<number>();
  let duplicates = 0;
  let invalid = 0;
  for (const token of text.split(/[\s,;]+/)) {
    if (!token) continue;
    const digits = token.replace(/^#/, '');
    const id = /^\d+$/.test(digits) ? Number(digits) : 0;
    if (id <= 0) invalid += 1;
    else if (seen.has(id)) duplicates += 1;
    else seen.add(id);
  }
  return { ids: [...seen], recognized: seen.size, duplicates, invalid };
}
