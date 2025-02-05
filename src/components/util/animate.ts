import gsap from 'gsap'

import s from '../../components/loader/loader.module.scss'

export function animateIn() {
  const tl = gsap.timeline()
  const className = [`.${s.bar}`, `.${s.bars}`]
  tl.set(className, { yPercent: 0, height: '100%' }).to(className, {
    yPercent: -100,
    height: 0,
    transformOrigin: 'top',
    ease: 'expo.inOut',
    duration: 1,
    stagger: { amount: 0.8 },
    delay: 0
  })
}

export function animateOut(href, router) {
  const tl = gsap.timeline()
  const className = [`.${s.bar}`, `.${s.bars}`]
  tl.set(className, { yPercent: 0, height: '100svh' }).to(className, {
    yPercent: 100,
    transformOrigin: 'top',
    ease: 'expo.inOut',
    duration: 1,
    stagger: { amount: 0.8 },
    onComplete: () => {
      router.push(href)
    }
  })
}
