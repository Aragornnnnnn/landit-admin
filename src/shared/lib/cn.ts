// Tailwind 클래스 병합 — clsx로 조건부 결합 후 tailwind-merge로 충돌 클래스를 정리한다 (shadcn 컴포넌트가 쓴다)
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
