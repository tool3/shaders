/* eslint-disable react/no-unknown-property */
'use client'

import CanvasWithModel from '~/components/mincanvas/minicanvas'
import Earth from '~/components/shaders/earth'

import s from './page.module.scss'

export default function Page() {
  return (
    <CanvasWithModel initZoom={50} panel className={s.page} minDistance={3}>
      <Earth />
    </CanvasWithModel>
  )
}
