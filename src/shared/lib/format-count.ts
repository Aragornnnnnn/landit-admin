// 사람 수·건수를 "1,204"처럼 — 어드민 전체가 한국어 자릿수 구분을 쓴다
export function formatCount(n: number): string {
  return n.toLocaleString('ko-KR');
}
