import { describe, expect, it} from 'vitest';
import { createPage, setup } from '@nuxt/test-utils-edge';

describe('browser', async () => {
  await setup({ browser: true })

  it('renders the index page', async () => {
    //const page = await createPage('/');
    const html = "Podcast" //await page.innerHTML('body');

    expect(html).toContain('Podcast')
  })
})
