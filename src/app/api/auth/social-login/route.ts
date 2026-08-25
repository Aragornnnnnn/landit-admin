// POST /api/auth/social-login — id_token을 BE에 넘기고 토큰을 httpOnly 쿠키로 심는다. 위임만 하고 규칙은 ../_model/session-handlers.ts
import { establishSocialSession } from '../_model/session-handlers';
import { backendNotConfigured, resolveBackendDeps } from '../../_model/backend';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const deps = resolveBackendDeps();
  if (!deps) return backendNotConfigured();
  return establishSocialSession(request, deps);
}
