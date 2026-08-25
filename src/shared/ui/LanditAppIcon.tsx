// landit 앱 아이콘 — 사용자 웹과 같은 에셋(public/brand/app-icon.png). 사이드바 로고와 내 계정 자리에 쓴다
import Image from 'next/image';

interface LanditAppIconProps {
  /** 정사각 한 변(px) */
  size: number;
  className?: string;
}

export function LanditAppIcon({ size, className }: LanditAppIconProps) {
  return (
    <Image
      src="/brand/app-icon.png"
      alt=""
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}
