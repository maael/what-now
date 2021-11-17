import { Server } from "socket.io"
import { Event, Round } from "./sharedTypes"

const io = new Server({ path: "/io", serveClient: false })

const histories = new Map<string, Round[]>()
const currentRounds = new Map<string, Round>()

io.on("connection", (socket) => {
  const socketRoom = socket.handshake.query.room?.toString() || "default"
  console.log("a user connected", { socketRoom })
  socket.join(socketRoom)
  histories.set(socketRoom, histories.get(socketRoom) || [])
  const existingRound = currentRounds.get(socketRoom)
  currentRounds.set(socketRoom, {
    ...(existingRound || { votes: {}, players: [], status: 0 }),
    players: (existingRound?.players || []).concat(socket.id),
  })
  io.to(socketRoom).emit(Event.RoundUpdate, currentRounds.get(socketRoom))
  socket.on("disconnect", () => {
    currentRounds.set(socketRoom, {
      ...currentRounds.get(socketRoom)!,
      players: currentRounds
        .get(socketRoom)!
        .players.filter((p) => p !== socket.id),
    })
    if (currentRounds.get(socketRoom)!.players.length === 0) {
      currentRounds.delete(socketRoom)
      histories.delete(socketRoom)
    }
  })
  socket.emit(Event.HistoryCatchup, histories.get(socketRoom))
  socket.emit(Event.RoundCatchup, currentRounds.get(socketRoom))

  socket.on(Event.GameResult, ({ result }) => {
    console.info("[game:result]", { socketRoom, result })
    const round = currentRounds.get(socketRoom)!
    round.decision = result
    histories.set(socketRoom, (histories.get(socketRoom) || []).concat(round))
    io.to(socketRoom).emit(Event.Result, round)
    io.to(socketRoom).emit(Event.HistoryCatchup, histories.get(socketRoom))
    currentRounds.set(socketRoom, {
      ...round,
      votes: {},
      decision: undefined,
    })
  })

  socket.on(Event.Vote, ({ vote }) => {
    console.info("[vote]", { socketRoom, vote })
    // If all players in room and active have voted, send result to clients
    currentRounds.set(socketRoom, {
      ...currentRounds.get(socketRoom)!,
      votes: {
        ...currentRounds.get(socketRoom)!.votes,
        [socket.id]: vote,
      },
    })
    const players = currentRounds.get(socketRoom)?.players || []
    const voters = Object.keys(currentRounds.get(socketRoom)!.votes)
    io.to(socketRoom).emit(Event.RoundUpdate, currentRounds.get(socketRoom))
    if (players.every((p) => voters.includes(p))) {
      const round = currentRounds.get(socketRoom)!
      round.decision = getDecision(round.votes)
      histories.set(socketRoom, (histories.get(socketRoom) || []).concat(round))
      console.info("[result]", round.decision)
      io.to(socketRoom).emit(Event.Result, round)
      io.to(socketRoom).emit(Event.HistoryCatchup, histories.get(socketRoom))
      currentRounds.set(socketRoom, {
        ...round,
        votes: {},
        decision: undefined,
      })
    }
  })
})

function makeVoteSafe(v?: string) {
  return v === "undefined" ? undefined : v
}

function getDecision(votes: { [k: string]: string }): string | undefined {
  const voteCounts = Object.entries(votes).reduce<{ [k: string]: number }>(
    (acc, [_, vote]) => {
      acc[vote] = (acc[vote] || 0) + 1
      return acc
    },
    {}
  )
  const sortedCounts = Object.entries(voteCounts).sort(
    ([_v1, aCount], [_v2, bCount]) => aCount - bCount
  )
  if (sortedCounts.length < 0) return makeVoteSafe((sortedCounts[0] || [])[0])
  const topCounts = sortedCounts.filter((c) => c[1] === sortedCounts[0][1])
  // Choose randomly
  return makeVoteSafe(topCounts[0][0])
}

export default io
