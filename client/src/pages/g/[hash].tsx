import * as React from 'react'
import { useRouter } from 'next/router'
import { io, Socket } from 'socket.io-client'
import CardSwiper from '~/components/primitives/CardSwiper'
import { SOCKET_URL } from '~/util'
import { Event, Round, Card } from '~/sharedTypes'

function useSocket(dispatch: ReturnType<typeof useCards>['dispatch']) {
  const [socket, setSocket] = React.useState<Socket | null>(null)
  const [round, setRound] = React.useState<Round | null>(null)
  const [history, setHistory] = React.useState<Round[]>([])
  const { query } = useRouter()
  React.useEffect(() => {
    let localSocket
    if (typeof window !== 'undefined' && query.hash) {
      localSocket = io(SOCKET_URL, {
        path: '/io',
        query: { room: query.hash?.toString() || 'default' },
      }).connect()
      localSocket.on('connect', () => {
        console.info('connected')
      })
      localSocket.on('disconnect', () => {
        console.info('disconnected')
      })
      localSocket.on('connect_error', (e) => {
        console.error('connect_error', e)
      })
      localSocket.on('error', () => {
        console.error('error')
      })
      localSocket.on(Event.HistoryCatchup, (d) => {
        setHistory(d)
      })
      localSocket.on(Event.RoundCatchup, (d) => {
        setRound(d)
      })
      localSocket.on(Event.Result, (d) => {
        console.info('[card:result]', d)
        dispatch({ type: 'draw', cardId: d.decision })
        setRound({ ...d, votes: {}, decision: undefined })
      })
      localSocket.on(Event.RoundUpdate, (d) => {
        setRound(d)
      })
      setSocket(localSocket)
    }
    return () => {
      if (localSocket) {
        console.info('disconnect')
        localSocket.disconnect()
        localSocket = null
      }
    }
  }, [query.hash, dispatch])
  return { socket, round, history }
}

const initialCardsState: { stack: Card[]; currentCard?: Card } = {
  stack: [
    {
      id: '1',
      top: { right: 'R', left: 'L' },
      middle: 'Middle',
      bottom: 'Bottom',
      rightId: '-1',
      leftId: '-1',
      type: 'card',
    },
    {
      id: '2',
      top: { right: 'R', left: 'L' },
      middle: 'Middle',
      bottom: 'Bottom',
      rightId: '3',
      leftId: '3',
      type: 'minigame',
    },
    {
      id: '3',
      top: { right: 'R', left: 'L' },
      middle: 'Middle',
      bottom: 'Bottom',
      rightId: '1',
      leftId: '1',
      type: 'card',
    },
  ],
  currentCard: {
    id: '0',
    top: {
      right: 'Right',
      left: 'Left',
    },
    middle: 'You enter the cave',
    bottom: 'Which way do you go?',
    rightId: '2',
    leftId: '3',
    type: 'card',
  },
}
function cardReducer(state: typeof initialCardsState, action: { type: 'catchup' } | { type: 'draw'; cardId: string }) {
  if (action.type === 'catchup') {
    return state
  } else if (action.type === 'draw') {
    let newStack = state.stack
    let newCurrent = state.currentCard
    if (!action.cardId) {
      const [next, ...remaining] = state.stack
      newStack = remaining
      newCurrent = next
    } else {
      newStack = state.stack.filter((s) => s.id !== action.cardId)
      newCurrent = state.stack.find((s) => s.id == action.cardId)
    }
    console.info('[draw]', newCurrent)
    return { stack: newStack, currentCard: newCurrent }
  }
  return state
}

function useCards() {
  const [state, dispatch] = React.useReducer(cardReducer, initialCardsState)
  return { state, dispatch }
}

export default function Game() {
  const {
    state: { currentCard, stack },
    dispatch,
  } = useCards()
  const { socket, round, history } = useSocket(dispatch)
  return (
    <main className="flex flex-col items-center justify-center h-full max-w-5xl py-5 m-auto">
      <div>
        {round?.players.length} Player{round?.players.length === 1 ? '' : 's'}
      </div>
      <div>Round {history?.length + 1}</div>
      {stack.length === 0 ? (
        <div>The End, went: 0, {history?.map((h) => h.decision).join(', ')}</div>
      ) : (
        <CardSwiper
          isLocked={Object.keys(round?.votes || {}).includes(socket?.id as string)}
          currentCard={currentCard}
          stack={stack}
          onTriggerLeft={() => {
            if (currentCard?.type === 'card') {
              socket?.emit(Event.Vote, { vote: currentCard?.leftId })
            } else if (currentCard?.type === 'minigame') {
              socket?.emit(Event.GameResult, { result: currentCard?.leftId })
            }
          }}
          onTriggerRight={() => {
            if (currentCard?.type === 'card') {
              socket?.emit(Event.Vote, { vote: currentCard?.rightId })
            } else if (currentCard?.type === 'minigame') {
              socket?.emit(Event.GameResult, { result: currentCard?.rightId })
            }
          }}
        />
      )}
      {stack.length !== 0 ? (
        <div>
          {Object.keys(round?.votes || {}).length} vote{Object.keys(round?.votes || {}).length === 1 ? '' : 's'}
        </div>
      ) : null}
    </main>
  )
}
