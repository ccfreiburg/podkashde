import { describe, expect, it } from 'vitest'
import { setup, $fetch, url } from '@nuxt/test-utils-edge'

describe('App', async () => {
  await setup({
    server: true
  })
  it('my test', async () => {
    const html = await $fetch('/podcasts')
    expect(html).toContain("Podcasts")
})
})