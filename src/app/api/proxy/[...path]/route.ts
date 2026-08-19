// /api/proxy/* — 브라우저가 BE를 부르는 유일한 통로. 해석·위임만 하고 규칙은 _model/forward-to-backend.ts에 있다
import { backendNotConfigured, resolveBackendDeps } from '../../_model/backend';
import { forwardToBackend } from './_model/forward-to-backend';

// 어드민 응답은 어떤 계층에도 캐시하지 않는다 — Next fetch 캐시·라우트 캐시도 끈다
export const dynamic = 'force-dynamic';

type Ctx = RouteContext<'/api/proxy/[...path]'>;

async function forwardProxyRequest(request: Request, ctx: Ctx) {
  const { path } = await ctx.params;
  const deps = resolveBackendDeps();
  if (!deps) return backendNotConfigured();
  return forwardToBackend(request, path, deps);
}

export const GET = forwardProxyRequest;
export const POST = forwardProxyRequest;
export const PUT = forwardProxyRequest;
export const PATCH = forwardProxyRequest;
export const DELETE = forwardProxyRequest;
