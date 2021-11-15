import * as React from 'react'

interface Card {
  id: string
  top: {
    right: string
    left: string
  }
  middle: string
  bottom: string
  rightId?: string
  leftId?: string
}

export default function CardSwiper() {
  const [stack, setStack] = React.useState([
    { id: '1', top: { right: 'R', left: 'L' }, middle: 'Middle', bottom: 'Bottom' },
    { id: '2', top: { right: 'R', left: 'L' }, middle: 'Middle', bottom: 'Bottom' },
    { id: '3', top: { right: 'R', left: 'L' }, middle: 'Middle', bottom: 'Bottom' },
  ])
  const [currentCard, setCurrentCard] = React.useState<Card | undefined>({
    id: '0',
    top: {
      right: 'Right',
      left: 'Left',
    },
    middle: 'You enter the cave',
    bottom: 'Which way do you go?',
    rightId: '2',
    leftId: '3',
  })
  const getNextCard = (direction: 'right' | 'left') => {
    let newStack = stack
    let newCurrent = currentCard
    const resultId = currentCard ? currentCard[`${direction}Id`] : undefined
    if (!resultId) {
      const [next, ...remaining] = stack
      newStack = remaining
      newCurrent = next
    } else {
      newStack = stack.filter((s) => s.id !== resultId)
      newCurrent = stack.find((s) => s.id == resultId)
    }
    setStack(newStack)
    setCurrentCard(newCurrent)
  }
  return (
    <div className="relative card">
      <Stack stack={stack} />
      {currentCard ? (
        <TopCard
          onTriggerLeft={() => getNextCard('left')}
          onTriggerRight={() => getNextCard('right')}
          card={currentCard}
        />
      ) : null}
    </div>
  )
}

function TopCard({
  onTriggerLeft,
  onTriggerRight,
  card,
}: {
  onTriggerLeft: () => void
  onTriggerRight: () => void
  card: Card
}) {
  const [interactionStart, setInteractionStart] = React.useState<{ x: number; y: number } | null>(null)
  const [delta, setDelta] = React.useState<{ x: number; y: number } | null>(null)
  const yAdjustment = React.useMemo(() => -((delta ? Math.cos(delta?.x / 200) * 100 : 0) / 4), [delta])
  const rotateAdjustment = React.useMemo(
    () => (!delta ? 0 : delta.x > 0 ? Math.min(delta.x / 10, 10) : Math.max(delta.x / 10, -10)),
    [delta]
  )
  const directionText = !delta ? null : delta.x > 0 ? card.top.right : card.top.left
  return (
    <div
      className="absolute top-0 left-0 flex flex-col transition-all transform bg-purple-700 border border-black rounded-md cursor-pointer select-none card hover:scale-110"
      style={{
        left: delta ? delta.x : undefined,
        top: (interactionStart ? -10 : 0) + yAdjustment,
        transform: `rotate(${rotateAdjustment}deg)`,
      }}
      onMouseDown={(e) => {
        setInteractionStart({ x: e.screenX, y: e.screenY })
        setDelta(null)
      }}
      onMouseUp={() => {
        if (delta && delta.x > 100) {
          onTriggerRight()
        } else if (delta && delta.x < -100) {
          onTriggerLeft()
        }
        setInteractionStart(null)
        setDelta(null)
      }}
      onMouseLeave={() => {
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
      <div className="flex items-center justify-center flex-1 px-1 py-2 transition-all">{card.middle}</div>
      <div className="flex items-center justify-center px-1 py-2 bg-gray-500 bg-opacity-60 rounded-b-md">
        {card.bottom}
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
