import { useState, useEffect, useRef } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><'

interface ScrambleInProps {
  text: string
  delay: number
  triggered: boolean
}

export default function ScrambleIn({ text, delay, triggered }: ScrambleInProps) {
  const [displayed, setDisplayed] = useState<string>('')
  const cursorRef = useRef(0)

  useEffect(() => {
    if (!triggered) {
      cursorRef.current = 0
      setDisplayed('')
      return
    }

    const timeoutId = setTimeout(() => {
      cursorRef.current = 0

      const intervalId = setInterval(() => {
        cursorRef.current += 0.5
        const pos = Math.floor(cursorRef.current)

        if (pos >= text.length) {
          setDisplayed(text)
          clearInterval(intervalId)
          return
        }

        const chars = text.split('').map((char, i) => {
          if (char === ' ') return ' '
          if (i < pos) return char
          if (i < pos + 3) return CHARS[Math.floor(Math.random() * CHARS.length)]
          return ''
        })
        setDisplayed(chars.join(''))
      }, 25)

      return () => clearInterval(intervalId)
    }, delay)

    return () => clearTimeout(timeoutId)
  }, [triggered, text, delay])

  if (!triggered || displayed === '') {
    return <> </>
  }
  return <>{displayed}</>
}
