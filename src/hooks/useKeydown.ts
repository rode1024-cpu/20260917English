import { useEffect } from 'react'

/**
 * 전역 키보드 단축키 등록 훅.
 * 입력 필드(input/textarea)에 포커스가 있을 때는 단축키를 무시해서
 * 텍스트 입력을 방해하지 않는다.
 */
export function useKeydown(handler: (event: KeyboardEvent) => void, deps: unknown[] = []) {
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isTyping = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA'
      if (isTyping) return
      handler(event)
    }
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
