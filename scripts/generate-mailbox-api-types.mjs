// 공지 언어 API의 실제 OpenAPI 스키마만 추출해 관리자 타입을 생성한다.
import { readFile, writeFile } from 'node:fs/promises';
import openapiTS, { astToString } from 'openapi-typescript';

const source = new URL(
  process.env.API_DOCS_URL ?? 'https://api-develop.landit.im/v3/api-docs',
);
const document =
  source.protocol === 'file:'
    ? JSON.parse(await readFile(source, 'utf8'))
    : await (await fetch(source)).json();
const names = [
  'AdminMailboxLetterCreateRequest',
  'AdminMailboxLetterPatchRequest',
  'AdminMailboxLetterResponse',
  'AdminMailboxLetterListResponse',
  'AdminMailboxLetterTranslation',
];
const schemas = Object.fromEntries(
  names.map((name) => {
    const schema = document.components.schemas[name];
    if (!schema) throw new Error(`OpenAPI에 ${name} 스키마가 없습니다.`);
    return [name, schema];
  }),
);
const ast = await openapiTS({
  ...document,
  paths: {},
  components: { schemas },
});
await writeFile(
  new URL('../src/shared/api/mailbox-schema.d.ts', import.meta.url),
  '// generate-mailbox-api-types.mjs로 실제 OpenAPI에서 생성한다. 손으로 수정하지 않는다.\n' +
    astToString(ast),
);
