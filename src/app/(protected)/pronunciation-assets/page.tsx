// 발음 에셋 현황과 기준 데이터·TTS 임포트 화면을 조립한다.
import { CoverageCard } from './_ui/CoverageCard';
import { ImportAssetsCard } from './_ui/ImportAssetsCard';

export default function Page() {
  return (
    <div className="space-y-5 pt-1 pb-12">
      <CoverageCard />
      <ImportAssetsCard />
    </div>
  );
}
