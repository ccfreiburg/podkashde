import { describe, it, expect, vitest } from "vitest";

import { fireEvent, render } from "@testing-library/vue";
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
    const wrapper = render(MultiSelect, { props: { title: "ATitle" } });
    expect(wrapper.html()).toContain("ATitle");
  })
  it("Klick opens and closes selection",async () => {
    const wrapper = render(MultiSelect, { props: { title: "ATitle", options } });
    const element = wrapper.getByTestId("MultiSelect.clickableElement")
    expect(wrapper.html()).not.toContain("Eins");
    await fireEvent(element,new MouseEvent('click'))
    expect(wrapper.html()).toContain("Eins");
    expect(wrapper.html()).toContain("Zwo");
    expect(wrapper.html()).toContain("Drei");
    await fireEvent(element,new MouseEvent('click'))
    expect(wrapper.html()).not.toContain("Eins");
  })
  it("ShowAllways shows options from the beginning",async () => {
    const wrapper = render(MultiSelect, { props: { title: "ATitle", options, showAllways: true } });
    expect(wrapper.html()).toContain("Eins");
    expect(wrapper.html()).toContain("Zwo");
    expect(wrapper.html()).toContain("Drei");
  })
  it("Klick outside the component closes options",async () => {
    const wrapper = render(MultiSelect, { props: { title: "ATitle", options } });
    const element = wrapper.getByTestId("MultiSelect.clickableElement")
    await fireEvent(element,new MouseEvent('click'))
    expect(wrapper.html()).toContain("Eins");
    await fireEvent(element,new MouseEvent('click'))
    expect(wrapper.html()).not.toContain("Eins");
  })
  it("Scroll the component closes options",async () => {
    const wrapper = render(MultiSelect, { props: { title: "ATitle", options } });
    const element = wrapper.getByTestId("MultiSelect.clickableElement")
    await fireEvent(element,new MouseEvent('click'))
    expect(wrapper.html()).toContain("Eins");
    await fireEvent(document,new Event('scroll', { bubbles: true }))
    expect(wrapper.html()).not.toContain("Eins");
  })
  it("Lets go of the event listener on documet when unrender", async () => {
    document.removeEventListener = vitest.fn()
    document.addEventListener = vitest.fn()
    const wrapper = render(MultiSelect, { props: { title: "ATitle", options }, container: document.body});
    expect(document.addEventListener).toHaveBeenCalled()
    await wrapper.unmount()
    expect(document.removeEventListener).toHaveBeenCalled()
  })
  it.todo("selecting option fires emit", async () => {
    const wrapper = render(MultiSelect, { props: { title: "ATitle", options, showAllways: true } });
    const element = wrapper.getAllByRole('input')[1]
    await (element as any).setChecked()
    expect(wrapper.emitted()).to.haveOwnProperty('checked');
    expect(wrapper.emitted()['checked'][0][0]).toContain(2)
  })
  it.todo("render with selected option shows element selected", async () => {
    const checkedList = [2];
    const wrapper = render(MultiSelect, { props: { title: "ATitle", options, checkedList, showAllways: true } });
    const elements = wrapper.getAllByRole("checkbox");
    expect(elements.map((v) => (v as any).value)).toEqual(options.map((v)=>v.value.toString()))
    const checkedElements = elements.filter((el) => (el as any).checked)
    expect(checkedElements.length).toBe(1)
  })
  it.todo("render with multiple selected option shows element")
})