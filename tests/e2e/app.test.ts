import { describe, expect, it } from 'vitest'
import { setup, $fetch, url } from '@nuxt/test-utils-edge'

describe('App', async () => {
  await setup({
    server: true
  })
  it('my test', async () => {
    const thePage = url('/page')
    const html = await $fetch('/')
    expect(html).toContain("Podcasts")
})
})