# What Now?

## Inspiration

Inspired by [What Next? Boardgame](https://boardgamegeek.com/boardgame/342443/what-next), [Reigns](https://store.steampowered.com/app/474750/Reigns/), and [Jackbox](https://www.jackboxgames.com/).

## Description

Players join a lobby on their phones like Jackbox, and then play through a "choose your own adventure", voting together on options by swiping, and playing mini games that affect how it progresses.

## Tech Components

### Development

```sh
git clone git@github.com:maael/what-now.git
cd what-now
yarn prep
yarn dev
```

This will start the backend at http://localhost:8081, and the frontend at http://localhost:3000.

### Client

[Next.js](https://nextjs.org/) client with [Tailwind](https://tailwindcss.com/) for styling, deployed to [Vercel](https://vercel.com/).

### Server

[Socket.io](https://socket.io/) server deployed to [Heroku](https://www.heroku.com/).

## Game State/Screens

```
                    ┌────┐
                 ┌──┤Join├──┐
                 │  └────┘  │
                 │          │
 ┌┬─────┬┐   ┌───▼──────────┴───┐
 ││Start│┼───►Waiting for Player│
 └┴─────┴┘   └────────┬─────────┘
                      │
                ┌─────▼────┐
                │Start Game│
                └─────┬────┘
                      │
             ┌────────▼─────────┐
┌─────┬──────►Assign Lead Player│
│     │      └────────┬─────────┘
│     │               │
│     │        ┌──────▼──────┐
│     │        │Vote Decision│
│     │        └──────┬──────┘
│     │               │
│ ┌───┴────┐    ┌─────▼──────┐     ┌───────────────┐
│ │Get Item◄────┤Resolve Vote├─────►Start Mini Game│
│ └────────┘    └─────┬──────┘     └──────┬────────┘
│                     │                   │
│                     │             ┌─────▼──────┐
│                     │             │Resolve Game│
│                     │             └─────┬──────┘
│            ┌────────▼─────────┐         │
└────────────┤Draw Next Decision◄─────────┘
             └──────────────────┘
```

## Tech Questions

- How much game state to have in client?
- How to handle game state in server? Worth using a state machine?
- How to handle reconnects?
- How to handle others viewing the active mini game?
  - Stream screen or replay events.

## Mini games

- [ ] Sliding tile picture
- [ ] Free the tile sliding game
- [ ] Reaction time target tap game
- [ ] Memory see and repeat game
- [ ] Slide and land in zone game
- [ ] Slide and land in moving zone game
- [ ] Tap amount in X time
- [ ] Flip coin
- [ ] Memory matching card game
- [ ] Item hunt in picture
- [ ] Path through maze game
- [ ] Spin tiles to connect pipe game
- [ ] Use shapes to make a shape outline
- [ ] Phone tilting/gyro marble maze game
