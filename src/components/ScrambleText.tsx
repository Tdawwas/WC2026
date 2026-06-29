import { useState, useEffect, useRef } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><'

interface ScrambleTextProps {
  text: string
  isHovered: boolean
  className?: string
}

export default function ScrambleText({ text, isHovered, className }: ScrambleTextProps) {
  const [displayed, setDisplayed] = useState(text)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (isHovered) {
      // Immediately scramble all chars
      setDisplayed(
        text.split('').map(c => (c === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)])).join('')
      )

      let frame = 0
      intervalRef.current = setInterval(() => {
        frame++
        const pos = Math.floor(frame / 4)

        if (pos >= text.length) {
          setDisplayed(text)
          if (intervalRef.current) clearInterval(intervalRef.current)
          intervalRef.current = null
          return
        }

        setDisplayed(
          text.split('').map((c, i) => {
            if (c === ' ') return ' '
            if (i < pos) return c
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          }).join('')
        )
      }, 25)
    } else {
      setDisplayed(text)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isHovered, text])

  return <span className={className}>{displayed}</span>
}
