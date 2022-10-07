import { describe, it, expect, vitest } from "vitest";
import { fireEvent, render } from "@testing-library/vue";
import MultiSelect from "../../components/MultiSelect.vue";

const Tick = async () => await new Promise(r => setTimeout(r)) 


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
    await fireEvent(document,new MouseEvent('click', { bubbles: true }))
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
    const addSpy = vitest.spyOn(window, 'addEventListener');
    const remSpy = vitest.spyOn(window, 'removeEventListener');
    const wrapper = render(MultiSelect, { props: { title: "ATitle", options }});
    expect(addSpy).toHaveBeenCalled()
    await wrapper.unmount()
    expect(remSpy).toHaveBeenCalled()
  })
  it("selecting option fires emit", async () => {
    const wrapper = render(MultiSelect, { props: { title: "ATitle", options, showAllways: true } });
    const element = wrapper.getAllByRole('checkbox')[1]
    await fireEvent(element,new MouseEvent('click'))
    expect(wrapper.emitted()).to.haveOwnProperty('checked');
    expect(wrapper.emitted()['checked'][0][0]).toContain(2)
  })
  it("render with selected option shows element selected", async () => {
    const checkedList = [2];
    const wrapper = render(MultiSelect, { props: { title: "ATitle", options, checkedList, showAllways: true } });
    const elements = wrapper.getAllByRole("checkbox");
    await Tick()
    expect((elements[1] as any).value).toBe("2")
    expect((elements[1] as any).checked).toBe(true)
    expect((elements[0] as any).checked).toBe(false)
    expect((elements[2] as any).checked).toBe(false)
  })
  it("render with multiple selected option shows element", async () => {
    const checkedList = [2,3];
    const wrapper = render(MultiSelect, { props: { title: "ATitle", options, checkedList, showAllways: true } });
    const elements = wrapper.getAllByRole("checkbox");
    await Tick()
    expect((elements[1] as any).value).toBe("2")
    expect((elements[1] as any).checked).toBe(true)
    expect((elements[0] as any).checked).toBe(false)
    expect((elements[2] as any).checked).toBe(true)
  })
  it("selects all when button clicked", async () => {
    const wrapper = render(MultiSelect, { props: { title: "ATitle", options, showAllways: true } });
    await Tick()
    const element = wrapper.getByTestId("MultiSelect.selectAll")
    await fireEvent.click(element)
    await Tick()
    const elements = wrapper.getAllByRole("checkbox");
    await Tick()
    expect((elements[0] as any).checked).toBe(true)
    expect((elements[1] as any).checked).toBe(true)
    expect((elements[2] as any).checked).toBe(true)
  })
  it("deselects all when button clicked",async () => {
    const checkedList = [2,3];
    const wrapper = render(MultiSelect, { props: { title: "ATitle", options, checkedList, showAllways: true } });
    const element = wrapper.getByTestId("MultiSelect.deselectAll")
    await fireEvent.click(element)
    await Tick()
    const elements = wrapper.getAllByRole("checkbox");
    await Tick()
    expect((elements[0] as any).checked).toBe(false)
    expect((elements[1] as any).checked).toBe(false)
    expect((elements[2] as any).checked).toBe(false)
  })
  it("inverts selection when button clicked",async () => {
    const checkedList = [1];
    const wrapper = render(MultiSelect, { props: { title: "ATitle", options, checkedList, showAllways: true } });
    const element = wrapper.getByTestId("MultiSelect.invertSelection")
    await fireEvent.click(element)
    await Tick()
    expect(wrapper.emitted()).to.haveOwnProperty('checked');
    expect(wrapper.emitted()['checked'][0][0]).toContain(2)
  })
})