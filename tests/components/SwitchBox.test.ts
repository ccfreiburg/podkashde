import { describe, it, expect, vitest } from "vitest";
import { fireEvent, render } from "@testing-library/vue";
import SwitchBox from "../../components/SwitchBox.vue";

const Tick = async () => await new Promise(r => setTimeout(r)) 

const labelChecked = "checkedLabel"
const labelUnChecked = "uncheckedLabel"

describe("MultiSelect", () => {

  it("After mount with checked it contains the lable", () => {
    const wrapper = render(SwitchBox, { props: { checked: true, labelChecked, labelUnChecked} });
    const label = wrapper.getByTestId("SwitchBox.label")
    expect(label.innerHTML).to.equal(labelChecked);
  })
  it("Klick changes the lable to the unchecked value",async () => {
    const wrapper = render(SwitchBox, { props: { checked: true, labelChecked, labelUnChecked} });
    const label = wrapper.getByTestId("SwitchBox.label")
    expect(label.innerHTML).to.equal(labelChecked);
    const element = wrapper.getByTestId("SwitchBox.toggle")
    await fireEvent(element,new MouseEvent('click'))
    expect(label.innerHTML).to.equal(labelUnChecked);
  })
  it("If no unckecked label is given the checkedlabel is used all times",async () => {
    const wrapper = render(SwitchBox, { props: { checked: true, labelChecked} });
    const label = wrapper.getByTestId("SwitchBox.label")
    expect(label.innerHTML).to.equal(labelChecked);
    const element = wrapper.getByTestId("SwitchBox.toggle")
    await fireEvent(element,new MouseEvent('click'))
    expect(label.innerHTML).to.equal(labelChecked);
  })
  it("Klick twice returns the lable to the checked value again",async () => {
    const wrapper = render(SwitchBox, { props: { checked: true, labelChecked, labelUnChecked} });
    const label = wrapper.getByTestId("SwitchBox.label")
    expect(label.innerHTML).to.equal(labelChecked);
    const element = wrapper.getByTestId("SwitchBox.toggle")
    await fireEvent(element,new MouseEvent('click'))
    await fireEvent(element,new MouseEvent('click'))
    expect(label.innerHTML).to.equal(labelChecked);
  })
  it("Disabled is true then click changes nothing",async () => {
    const wrapper = render(SwitchBox, { props: { checked: false, disabled: true, labelChecked, labelUnChecked} });
    const label = wrapper.getByTestId("SwitchBox.label")
    expect(label.innerHTML).to.equal(labelUnChecked);
    const element = wrapper.getByTestId("SwitchBox.toggle")
    await fireEvent(element,new MouseEvent('click'))
    expect(label.innerHTML).to.equal(labelUnChecked);
  })
  
})