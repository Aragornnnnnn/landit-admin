// 아직 만들지 않은 화면의 자리표시자 — 어느 스펙을 구현할지 가리킨다. 화면 PR이 들어오면 지운다
export function ComingSoon({ spec }: { spec: string }) {
  return (
    <section className="rounded-[20px] bg-card px-6 py-10 text-center">
      <p className="text-[15px] text-muted-foreground">
        준비 중인 화면이에요. 스펙은{' '}
        <code className="text-foreground">{spec}</code>
      </p>
    </section>
  );
}
