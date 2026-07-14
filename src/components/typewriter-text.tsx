import { useEffect, useState } from "react"
import { useReducedMotion } from "framer-motion"

export function TypewriterText({
  text,
  className,
  speed = 35,
  startDelay = 0,
}: {
  text: string
  className?: string
  speed?: number
  startDelay?: number
}) {
  const reduceMotion = useReducedMotion()
  const [count, setCount] = useState(reduceMotion ? text.length : 0)

  useEffect(() => {
    if (reduceMotion) return
    let i = 0
    let interval: ReturnType<typeof setInterval>
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i += 1
        setCount(i)
        if (i >= text.length) clearInterval(interval)
      }, speed)
    }, startDelay)
    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [text, speed, startDelay, reduceMotion])

  const done = count >= text.length

  return (
    <span className={className}>
      {text.slice(0, count)}
      {!done && (
        <span
          className="ml-0.5 inline-block w-0.5 animate-pulse bg-current align-middle"
          style={{ height: "1em" }}
        />
      )}
    </span>
  )
}
