import { useMemo } from 'react'
import { isSpeechSynthesisSupported, speak } from '../lib/speech'

/** 발음 듣기 기능을 제공하는 훅. 미지원 브라우저에서는 supported가 false로 내려온다. */
export function useSpeech() {
  const supported = useMemo(() => isSpeechSynthesisSupported(), [])
  return { supported, speak }
}
