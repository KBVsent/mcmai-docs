<script setup lang="ts">
  import { onBeforeUnmount, onMounted } from 'vue'

  let startTimer: number | undefined
  let resetConfetti: (() => void) | undefined
  let isUnmounted = false

  const getLogoOrigin = () => {
    const logo = document.querySelector<HTMLElement>('.VPHomeHero .image-src')
    if (!logo) return { x: 0.5, y: 0.6 }

    const { left, top, width, height } = logo.getBoundingClientRect()
    return {
      x: (left + width / 2) / window.innerWidth,
      y: (top + height / 2) / window.innerHeight,
    }
  }

  const startConfetti = async () => {
    const { default: confetti } = await import('canvas-confetti')
    if (isUnmounted) return

    resetConfetti = confetti.reset
    confetti({
      particleCount: 100,
      spread: 170,
      origin: getLogoOrigin(),
      disableForReducedMotion: true,
    })
  }

  const scheduleConfetti = () => {
    // Keep the full effect, but move its initialization away from hydration and
    // the browser's first rendering pass. This is especially important in iOS
    // Safari where canvas setup and page compositing otherwise happen together.
    startTimer = window.setTimeout(() => void startConfetti(), 250)
  }

  onMounted(() => {
    if (document.readyState === 'complete') {
      scheduleConfetti()
    } else {
      window.addEventListener('load', scheduleConfetti, { once: true })
    }
  })

  onBeforeUnmount(() => {
    isUnmounted = true
    window.removeEventListener('load', scheduleConfetti)
    if (startTimer !== undefined) window.clearTimeout(startTimer)
    resetConfetti?.()
  })
</script>

<template></template>
