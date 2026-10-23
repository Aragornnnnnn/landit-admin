// LAN-696 서버 OpenAPI에서 레퍼럴 계약과 참조하는 스키마만 추출해 타입을 생성한다.
import { readFile, writeFile } from 'node:fs/promises';
import openapiTS, { astToString } from 'openapi-typescript';

const source = new URL(
  process.env.API_DOCS_URL ?? 'https://api-develop.landit.im/v3/api-docs',
);
const full =
  source.protocol === 'file:'
    ? JSON.parse(await readFile(source, 'utf8'))
    : await (await fetch(source)).json();
const paths = Object.fromEntries(
  Object.entries(full.paths).filter(([path]) => path.includes('/referral')),
);
if (Object.keys(paths).length === 0)
  throw new Error('서버 OpenAPI에 레퍼럴 API가 없습니다.');
const schemas = {};
function collect(value) {
  if (!value || typeof value !== 'object') return;
  if (
    typeof value.$ref === 'string' &&
    value.$ref.startsWith('#/components/schemas/')
  ) {
    const name = value.$ref.split('/').at(-1);
    if (!(name in schemas)) {
      schemas[name] = full.components.schemas[name];
      collect(schemas[name]);
    }
  }
  for (const child of Object.values(value)) collect(child);
}
collect(paths);
const ast = await openapiTS({ ...full, paths, components: { schemas } });
await writeFile(
  new URL('../src/shared/api/referral-schema.d.ts', import.meta.url),
  '// generate-referral-api-types.mjs가 LAN-696 OpenAPI에서 생성한 타입이다. 직접 편집하지 않는다.\n' +
    astToString(ast),
);
