import { describe, it, expect } from "vitest"
import { fireEvent, render } from "@testing-library/vue"
import InputArea from "../../components/InputArea.vue"
import IValidationError from "~~/base/types/IValidationError"


const Tick = async () => await new Promise(r => setTimeout(r)) 

const options = { 
  props: { 
    name: "ElementName",
    label: "i18naddress.label",
    errors: [],
    value: ""
  }, 
  global:{ 
    mocks: {
      $t: (s) => s 
  }}
}

describe("InputArea", () => {
  it("displays label", () => {   
    const wrapper = render(InputArea, options)
    expect(wrapper.html()).toContain("i18naddress.label");
    expect(wrapper.html()).not.toContain("error");
  })
  it("displays error when given", () => {   
    const opts = { props: {...options.props}, global: {...options.global} }
    opts.props.errors = [{ field: "ElementName", text: "error"} ] as Array<IValidationError>;
    const wrapper = render(InputArea, opts)
    expect(wrapper.html()).toContain("i18naddress.label");
    expect(wrapper.html()).toContain("error");
  })
  it("displays textarea when type is set", () => {   
    const opts = { props: {...options.props}, global: {...options.global} }
    opts.props["type"] = "textarea"
    const wrapper = render(InputArea, opts)
    const element = wrapper.getByRole("textbox")
    expect(element.nodeName).toBe("TEXTAREA");
  })
  it("displays input on default", () => {   
    const wrapper = render(InputArea, options)
    const element = wrapper.getByRole("textbox")
    expect(element.nodeName).toBe("INPUT");
  })
})