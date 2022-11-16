import { describe, it, expect, vitest, beforeAll } from "vitest"
import { fireEvent, render } from "@testing-library/vue"
import ImageSelector from "../../components/ImageSelector.vue"
import {createI18n} from 'vue-i18n'


const Tick = async () => await new Promise(r => setTimeout(r)) 

const i18n = createI18n({
  legacy: true,
  locale: 'en',
  messages: {
    en: {
      'podcast.label.img': "labelimg"
    }
  },
})

describe("ImageSelector", () => {
  it("Empty displays click to add",async () => {
    const wrapper = render(ImageSelector, { props: { filename: "" }, 
      global:{ 
        plugins: [i18n],
    }})
    expect(wrapper.html()).toContain("labelimg");
  })
})