// 어드민은 검색 엔진에 노출하지 않는다 — 전 경로 크롤 금지 (metadata robots noindex와 이중)
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', disallow: '/' },
  };
}
