// 개인 편지 — 보낸 편지 목록 자리. BE 조회 API가 생기기 전까지는 새 편지로 보낸다 (docs/screens/direct-letters.md "열린 질문")
import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/direct-letters/new');
}
