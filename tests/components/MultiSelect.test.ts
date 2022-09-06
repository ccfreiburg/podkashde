import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import MultiSelect from "../../components/MultiSelect.vue";

describe("MultiSelect", () => {
  const options = [
    {
      value: 1, 
      text: "Eins"
    },
    {
      value: 2, 
      text: "Zwo"
    },
    {
      value: 3, 
      text: "Drei"
    }
  ]
  it("Title renders properly", () => {
    const wrapper = mount(MultiSelect, { props: { title: "ATitle" } });
    expect(wrapper.html()).toContain("ATitle");
  })
  it("Klick opens and closes selection",async () => {
    const wrapper = mount(MultiSelect, { props: { title: "ATitle", options } });
    const element = wrapper.find('[data-testid="MultiSelect.clickableElement"]')
    expect(wrapper.html()).not.toContain("Eins");
    element.trigger('click')
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toContain("Eins");
    expect(wrapper.html()).toContain("Zwo");
    expect(wrapper.html()).toContain("Drei");
    element.trigger('click')
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).not.toContain("Eins");
  })
  it("ShowAllways shows options from the beginning",async () => {
    const wrapper = mount(MultiSelect, { props: { title: "ATitle", options, showAllways: true } });
    expect(wrapper.html()).toContain("Eins");
    expect(wrapper.html()).toContain("Zwo");
    expect(wrapper.html()).toContain("Drei");
  })
  it.todo("Klick outside the component closes options",async () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const wrapper = mount(MultiSelect, { attachTo: div, props: { title: "ATitle", options } });
    const element = wrapper.find('[data-testid="MultiSelect.clickableElement"]')
    element.trigger('click')
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toContain("Eins");
    //('click')
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).not.toContain("Eins");
  })

})