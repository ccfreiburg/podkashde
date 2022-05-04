import { mount } from "@vue/test-utils";
import PodcastDetail from "@/components/PodcastDetail.vue";


describe("Podcast Detail", () => {
  it ( "renders empty image area with text", () => {
    const wrapper = mount(PodcastDetail, {})
    expect(wrapper.text()).toContain('hier klicken');
  })
})
