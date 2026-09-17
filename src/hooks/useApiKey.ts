import { useCallback, useState } from 'react'

const API_KEY_STORAGE_KEY = 'vocaloop.geminiApiKey'

/** Gemini API 키를 브라우저 localStorage에만 저장한다 (서버로 전송되지 않음). */
export function useApiKey() {
  const [apiKey, setApiKeyState] = useState<string>(() => {
    try {
      return localStorage.getItem(API_KEY_STORAGE_KEY) ?? ''
    } catch {
      return ''
    }
  })

  const setApiKey = useCallback((key: string) => {
    setApiKeyState(key)
    try {
      if (key) {
        localStorage.setItem(API_KEY_STORAGE_KEY, key)
      } else {
        localStorage.removeItem(API_KEY_STORAGE_KEY)
      }
    } catch {
      // localStorage 접근 불가 시 조용히 무시한다 (세션 내 메모리 값은 유지됨)
    }
  }, [])

  return { apiKey, setApiKey }
}
