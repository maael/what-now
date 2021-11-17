export enum Event {
  Vote = "card:vote",
  Result = "card:result",
  HistoryCatchup = "history:catchup",
  RoundCatchup = "round:catchup",
  RoundUpdate = "round:update",
  GameResult = "game:result",
}

export interface Round {
  votes: { [k: string]: string }
  status: number
  players: string[]
  decision?: string
}

export interface Card {
  id: string
  top: {
    right: string
    left: string
  }
  middle: string
  bottom: string
  rightId?: string
  leftId?: string
  type: "card" | "minigame"
  gameInfo?: any
}
