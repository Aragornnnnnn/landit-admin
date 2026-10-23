'use client';

// 부여·회수 후 같은 사용자의 이력을 갱신하고 실패를 화면에 전달한다.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createGrant,
  fetchGrantProducts,
  fetchGrants,
  revokeGrant,
  type GrantRequest,
} from '../_api/subscription-grant';

export function useSubscriptionGrantsQuery(userId: number) {
  const client = useQueryClient();
  const products = useQuery({
    queryKey: ['subscription-products'],
    queryFn: fetchGrantProducts,
  });
  const history = useQuery({
    queryKey: ['subscription-grants', userId],
    queryFn: () => fetchGrants(userId),
  });
  const refresh = () =>
    client.invalidateQueries({ queryKey: ['subscription-grants', userId] });
  const grant = useMutation({
    mutationFn: (request: GrantRequest) => createGrant(userId, request),
    onSuccess: refresh,
  });
  const revoke = useMutation({
    mutationFn: (id: number) => revokeGrant(userId, id),
    onSuccess: refresh,
  });
  return { products, history, grant, revoke };
}
