import { describe, it, expect, vitest } from "vitest";

import { mount, shallowMount } from "@vue/test-utils";
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
  it("Klick outside the component closes options",async () => {
    const wrapper = shallowMount(MultiSelect, { attachTo: document.body, props: { title: "ATitle", options } });
    const element = wrapper.find('[data-testid="MultiSelect.clickableElement"]')
    element.trigger('click')
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toContain("Eins");
    document.dispatchEvent(new Event('click'))
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).not.toContain("Eins");

  })
  it("Scroll the component closes options",async () => {
    const wrapper = shallowMount(MultiSelect, { attachTo: document.body, props: { title: "ATitle", options } });
    const element = wrapper.find('[data-testid="MultiSelect.clickableElement"]')
    element.trigger('click')
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toContain("Eins");
    document.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).not.toContain("Eins");

  })
  it("Lets go of the event listener on documet when unmount", async () => {
    Object.defineProperty(global, 'document', { ...document})
    document.removeEventListener = vitest.fn()
    document.addEventListener = vitest.fn()
    const wrapper = shallowMount(MultiSelect, { attachTo: document.body, props: { title: "ATitle", options } });
    expect(document.addEventListener).toHaveBeenCalled()
    await wrapper.unmount()
    expect(document.removeEventListener).toHaveBeenCalled()
    Object.defineProperty(window, 'document', { value: document })
  })
  it("selecting option fires emit", async () => {
    const wrapper = mount(MultiSelect, { props: { title: "ATitle", options, showAllways: true } });
    const element = wrapper.findAll('input')[1]
    expect(element.exists()).toBe(true)
    await (element as any).setChecked()
    expect(wrapper.emitted()).to.haveOwnProperty('checked');
    expect(wrapper.emitted()['checked'][0][0]).toContain(2)
  })
  it.todo("mount with selected option shows element selected", async () => {
    const checkedList = [2];
    const wrapper = mount(MultiSelect, { props: { title: "ATitle", options, checkedList, showAllways: true } });
    const elements = wrapper.findAll('input[type="checkbox"]');
    expect(elements.map((v) => (v.element as any).value)).toEqual(options.map((v)=>v.value.toString()))
    const checkedElements = elements.filter((el) => (el as any).checked)
    expect(elements).toBe(1)
  })
  it.todo("mount with multiple selected option shows element")
})