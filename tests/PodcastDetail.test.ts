import { describe, expect, it } from 'vitest'
import { $fetch, createContext } from '@nuxt/test-utils-edge'

describe('ssr', async () => {

  it('renders the index page', async () => {
    let context = createContext();
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/');

    expect(html).toContain('Podcast')
  })
})