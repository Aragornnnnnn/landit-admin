// 콘텐츠 제작 화면은 1차에서 데스크톱 전용 — 표·3열이 좁은 폭에 안 들어간다. 1024px 미만에선 안내만 그린다 (docs/screens/content-batches.md "상태")
export function DesktopOnly({ children }: { children: React.ReactNode }) {
  return (
    <>
      <p className="rounded-[20px] bg-card px-6 py-16 text-center text-[15px] font-medium text-body lg:hidden">
        이 화면은 데스크톱(1024px 이상)에서 써 주세요
      </p>
      <div className="hidden lg:block">{children}</div>
    </>
  );
}
