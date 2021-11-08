import * as React from 'react'
import stc from 'string-to-color'
import tc from 'tinycolor2'
import cls from 'classnames'

export default function PlayerAvatar({
  name,
  className,
  style,
  ...props
}: { name: string } & React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      className={cls(
        'rounded-full w-24 h-24 bg-gray-300 shadow-md border-2 border-gray-500 flex justify-center items-center text-4xl text-gray-500 select-none overflow-hidden',
        className
      )}
      style={{
        backgroundImage: name ? `url(https://avatars.dicebear.com/api/croodles-neutral/${name}.svg)` : '',
        backgroundColor: name ? stc(name) : '',
        borderColor: name ? tc(stc(name)).darken(20).toString() : '',
        textIndent: name ? -999 : 0,
        ...style,
      }}
      {...props}
    >
      ?{' '}
    </div>
  )
}
