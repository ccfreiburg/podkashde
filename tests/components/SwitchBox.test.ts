import { describe, it, expect, vitest } from "vitest";
import { fireEvent, render } from "@testing-library/vue";
import SwitchBox from "../../components/SwitchBox.vue";

const Tick = async () => await new Promise(r => setTimeout(r)) 

const labelChecked = "checkedLabel"
const labelUnChecked = "uncheckedLabel"

describe("MultiSelect", () => {

  it("After mount with checked it contains the lable", () => {
    const wrapper = render(SwitchBox, { props: { checked: true, labelChecked, labelUnChecked} });
    expect(wrapper.html()).toContain(labelChecked);
  })
  it("Klick changes the lable to the unchecked value",async () => {
    const wrapper = render(SwitchBox, { props: { checked: true, labelChecked, labelUnChecked} });
    expect(wrapper.html()).toContain(labelChecked);
    const element = wrapper.getByTestId("SwitchBox.toggle")
    await fireEvent(element,new MouseEvent('click'))
    expect(wrapper.html()).toContain(labelUnChecked);
  })
  it("Klick twice returns the lable to the checked value again",async () => {
    const wrapper = render(SwitchBox, { props: { checked: true, labelChecked, labelUnChecked} });
    expect(wrapper.html()).toContain(labelChecked);
    const element = wrapper.getByTestId("SwitchBox.toggle")
    await fireEvent(element,new MouseEvent('click'))
    await fireEvent(element,new MouseEvent('click'))
    expect(wrapper.html()).toContain(labelChecked);
  })
  
})