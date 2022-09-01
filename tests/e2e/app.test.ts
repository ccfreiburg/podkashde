import { describe, it } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils-edge'

describe('App', async () => {
  await setup({
    server: true
  })
  it('my test', () => {
    // ...
    const html = $fetch('/').then(()=>{ 
    console.log(html)
  })
})
})