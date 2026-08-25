// 보호 구역 레이아웃 — 인증 판단은 proxy.ts가 이미 했다. 여기선 셸만 씌운다. 서버 카드의 호스트는 env에서 읽는다 (비밀 아님)
import { ProtectedShell } from './_ui/ProtectedShell';

// 서버 카드에 보여줄 BE 호스트 — env는 고정값이라 모듈 로드 때 한 번만 계산한다
const API_HOST_FOR_DISPLAY =
  process.env.NEXT_PUBLIC_API_HOST ||
  URL.parse(process.env.API_BASE_URL ?? '')?.host ||
  '';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedShell apiHost={API_HOST_FOR_DISPLAY}>{children}</ProtectedShell>
  );
}
