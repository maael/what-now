import * as React from 'react'
import cls from 'classnames'
import { Card } from '~/sharedTypes'

export default function CardSwiper(props: {
  onTriggerRight: () => void
  onTriggerLeft: () => void
  currentCard: Card | undefined
  stack: Card[]
  isLocked: boolean
}) {
  return (
    <div className="relative card">
      <Stack stack={props.stack} />
      {props.currentCard ? (
        props.currentCard.type === 'card' ? (
          <TopCard {...props} currentCard={props.currentCard} />
        ) : (
          <Minigame {...props} currentCard={props.currentCard} />
        )
      ) : null}
    </div>
  )
}

interface InteractionProps {
  onTriggerLeft: () => void
  onTriggerRight: () => void
  currentCard: Card
  isLocked: boolean
}

function Minigame({ onTriggerLeft }: InteractionProps) {
  return (
    <div
      className={
        'absolute top-0 left-0 flex flex-col transition-all transform bg-purple-700 border border-black rounded-md cursor-pointer select-none card hover:scale-110'
      }
    >
      <button className="px-2 py-1 bg-pink-500 rounded-md" onClick={onTriggerLeft}>
        Click Me
      </button>
    </div>
  )
}

function TopCard({ onTriggerLeft, onTriggerRight, currentCard, isLocked }: InteractionProps) {
  const [interactionStart, setInteractionStart] = React.useState<{ x: number; y: number } | null>(null)
  const [delta, setDelta] = React.useState<{ x: number; y: number } | null>(null)
  const yAdjustment = React.useMemo(() => -((delta ? Math.cos(delta?.x / 200) * 100 : 0) / 4), [delta])
  const rotateAdjustment = React.useMemo(
    () => (!delta ? 0 : delta.x > 0 ? Math.min(delta.x / 10, 10) : Math.max(delta.x / 10, -10)),
    [delta]
  )
  const directionText = !delta ? null : delta.x > 0 ? currentCard.top.right : currentCard.top.left
  React.useEffect(() => {
    function mouseUp() {
      setInteractionStart(null)
      setDelta(null)
    }
    document.addEventListener('mouseup', mouseUp)
    return () => {
      document.removeEventListener('mouseup', mouseUp)
    }
  }, [])
  return (
    <div
      className={cls(
        'absolute top-0 left-0 flex flex-col transition-all transform bg-purple-700 border border-black rounded-md cursor-pointer select-none card hover:scale-110',
        { 'opacity-50 pointer-events-none': isLocked }
      )}
      style={{
        left: delta ? delta.x : undefined,
        top: (interactionStart ? -10 : 0) + yAdjustment,
        transform: `rotate(${rotateAdjustment}deg)`,
      }}
      onMouseDown={(e) => {
        setInteractionStart({ x: e.screenX, y: e.screenY })
        setDelta(null)
      }}
      onMouseUp={(e) => {
        e.stopPropagation()
        if (delta && delta.x > 100) {
          onTriggerRight()
        } else if (delta && delta.x < -100) {
          onTriggerLeft()
        }
        setInteractionStart(null)
        setDelta(null)
      }}
      onMouseMove={(e) => {
        if (!interactionStart) return
        const deltaX = e.screenX - interactionStart.x
        const deltaY = e.screenY - interactionStart.y
        setDelta({ x: deltaX, y: deltaY })
      }}
      onTouchStart={(e) => {
        setInteractionStart({ x: e.touches[0].screenX, y: e.touches[0].screenY })
        setDelta(null)
      }}
      onTouchEnd={() => {
        if (delta && delta.x > 100) {
          onTriggerRight()
        } else if (delta && delta.x < -100) {
          onTriggerLeft()
        }
        setInteractionStart(null)
        setDelta(null)
      }}
      onTouchMove={(e) => {
        if (!interactionStart) return
        const deltaX = e.touches[0].screenX - interactionStart.x
        const deltaY = e.touches[0].screenY - interactionStart.y
        setDelta({ x: deltaX, y: deltaY })
      }}
    >
      <div
        className="flex items-center justify-center px-1 py-2 transition-all bg-gray-500 shadow-sm bg-opacity-60 rounded-t-md"
        style={{ height: directionText ? undefined : 0, opacity: directionText ? 1 : 0 }}
      >
        {directionText}
      </div>
      <div className="flex items-center justify-center flex-1 px-1 py-2 transition-all">{currentCard.middle}</div>
      <div className="flex items-center justify-center px-1 py-2 bg-gray-500 bg-opacity-60 rounded-b-md">
        {currentCard.bottom}
      </div>
    </div>
  )
}

function Stack({ stack }: { stack: Card[] }) {
  return (
    <>
      {stack.map((c, i) => (
        <div
          key={c.id}
          className="absolute top-0 transform bg-purple-900 border border-black rounded-md card"
          style={{ transform: `rotate(${Math.min(i + 1 * 2, 5) * (i % 2 === 0 ? -1 : 1)}deg)` }}
        ></div>
      ))}
    </>
  )
}
