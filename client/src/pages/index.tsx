import { useRouter } from 'next/router'
import * as React from 'react'
import CardSwiper from '~/components/primitives/CardSwiper'
import PlayerAvatar from '~/components/primitives/PlayerAvatar'
import { SERVER_URL } from '~/util'

export default function Index() {
  const [name, setName] = React.useState('')
  const [code, setCode] = React.useState('')
  const { push } = useRouter()
  return (
    <main className="max-w-5xl py-5 m-auto">
      <h1 className="text-5xl uppercase">What now?</h1>
      <p className="text-xl">A game where you and your friends choose your own adventure!</p>
      <form
        className="flex flex-col justify-center max-w-xl gap-2 px-10 py-5 m-auto my-6 bg-purple-700 rounded-lg shadow-md"
        onSubmit={async (e) => {
          e.preventDefault()
          const res = await fetch(`${SERVER_URL}/translate?code=${code}`)
          const data = await res.json()
          push(`/g/${data.route}`)
        }}
      >
        <h2 className="text-3xl uppercase">Join a game</h2>
        <PlayerAvatar className="relative m-auto -mt-4 top-4" name={name} />
        <input
          className="px-4 py-2 text-black rounded-sm shadow-sm"
          name="name"
          placeholder="Name..."
          value={name}
          autoCorrect="off"
          autoComplete="off"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="px-4 py-2 text-black rounded-sm shadow-sm"
          name="code"
          placeholder="Code..."
          value={code}
          autoCorrect="off"
          autoComplete="off"
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          className="px-4 py-2 mt-2 font-bold text-black uppercase transition-all transform bg-purple-300 rounded-sm shadow-md hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:pointer-events-none"
          type="submit"
          disabled={!!(!code.trim() || !name.trim())}
        >
          Join
        </button>
      </form>
      <div className="flex items-center justify-center pt-10">
        <CardSwiper />
      </div>
    </main>
  )
}
