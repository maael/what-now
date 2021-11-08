import * as React from 'react'
import PlayerAvatar from '~/components/primitives/PlayerAvatar'

export default function Index() {
  const [name, setName] = React.useState('')
  return (
    <main className="max-w-5xl m-auto py-5">
      <h1 className="text-5xl uppercase">What now?</h1>
      <p className="text-xl">A game where you and your friends choose your own adventure!</p>
      <form
        className="flex flex-col justify-center gap-2 my-6 max-w-xl m-auto bg-purple-700 px-10 py-5 rounded-lg shadow-md"
        onSubmit={(e) => {
          e.preventDefault()
          // Get url for code, send player to game
        }}
      >
        <h2 className="text-3xl uppercase">Join a game</h2>
        <PlayerAvatar className="relative top-4 m-auto -mt-4" name={name} />
        <input
          className="py-2 px-4 rounded-sm shadow-sm text-black"
          placeholder="Name..."
          value={name}
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
          onChange={(e) => setName(e.target.value)}
          name="name"
        />
        <input
          className="py-2 px-4 rounded-sm shadow-sm text-black"
          name="code"
          placeholder="Code..."
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
        />
        <button
          className="bg-purple-300 py-2 px-4 rounded-sm shadow-md font-bold text-black uppercase mt-2 transform transition-all hover:scale-105 hover:shadow-lg"
          type="submit"
        >
          Join
        </button>
      </form>
    </main>
  )
}
