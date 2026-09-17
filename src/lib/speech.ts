export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

/** 브라우저 내장 TTS로 영어 단어/문장을 읽어준다. 미지원 브라우저에서는 아무 동작도 하지 않는다. */
export function speak(text: string, lang = 'en-US'): void {
  if (!isSpeechSynthesisSupported()) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  window.speechSynthesis.speak(utterance)
}
