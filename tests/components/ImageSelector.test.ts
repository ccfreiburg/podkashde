import { describe, it, expect, vitest, beforeAll } from "vitest"
import { fireEvent, render } from "@testing-library/vue"
import ImageSelector from "../../components/ImageSelector.vue"


const Tick = async () => await new Promise(r => setTimeout(r)) 

describe("ImageSelector", () => {
  it("Empty displays click to add",async () => {
    const wrapper = render(ImageSelector, { props: { filename: "" }, 
    global:{ 
      mocks: {
        $t: (s) => s 
    }}
  })
    expect(wrapper.html()).toContain("podcast.label.img");
  })
})