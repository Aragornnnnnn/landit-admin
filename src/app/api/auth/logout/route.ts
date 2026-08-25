// POST /api/auth/logout — BE refresh 무효화 + 쿠키 삭제. 위임만 하고 규칙은 ../_model/session-handlers.ts
import { logoutSession } from '../_model/session-handlers';
import { backendNotConfigured, resolveBackendDeps } from '../../_model/backend';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const deps = resolveBackendDeps();
  if (!deps) return backendNotConfigured();
  return logoutSession(request, deps);
}
