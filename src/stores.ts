import { writable } from 'svelte/store'
import type { HueBridge, User } from './types'

export const userStore = writable<User>(null)
export const lightsStore = writable<Light[]>([])
export const plugsStore = writable<Plug[]>([])
export const bridgeStore = writable<HueBridge[]>(null)