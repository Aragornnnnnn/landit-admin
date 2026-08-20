// 스웨거(OpenAPI JSON)에서 TypeScript 타입을 생성한다 — BE 계약이 바뀌면 재생성해서 typecheck로 잡는다
import { writeFile } from 'node:fs/promises';
import openapiTS, { astToString } from 'openapi-typescript';

// 기본은 develop 스웨거. 다른 서버로 뽑고 싶으면 API_DOCS_URL로 바꾼다
const url =
  process.env.API_DOCS_URL ?? 'https://api-develop.landit.im/v3/api-docs';
const output = new URL('../src/shared/api/schema.d.ts', import.meta.url);

const header = `// 이 파일은 \`pnpm api:types\`가 스웨거(${url})에서 생성한다. 손으로 고치지 말고 재생성한다.
// 스웨거가 틀린 부분은 ./schema-patch.ts에서 덮어쓴다.
`;

const ast = await openapiTS(new URL(url), {
  // 응답 날짜는 문자열(ISO)로 온다 — Date로 바꾸지 않는다
  transform: undefined,
});

await writeFile(output, header + astToString(ast));
console.log(`생성 완료 → ${output.pathname}`);
