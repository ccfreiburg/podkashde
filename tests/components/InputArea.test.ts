import { describe, it, expect } from "vitest"
import { fireEvent, render } from "@testing-library/vue"
import InputArea from "../../components/InputArea.vue"
import type {IValidationError} from "~~/base/types/IValidationError"
import {createI18n} from 'vue-i18n'


const Tick = async () => await new Promise(r => setTimeout(r)) 

const i18n = createI18n({
  legacy: true,
  locale: 'en',
  messages: {
    en: {
      'i18naddress.label': "label",
      'error': "error"
    }
  },
})

const options = { 
  props: { 
    name: "ElementName",
    label: "i18naddress.label",
    errors: [],
    value: ""
  }, 
  global:{ 
    plugins: [i18n],
  }
}


describe("InputArea", () => {
  it("displays label", () => {   
    const wrapper = render(InputArea, options)
    expect(wrapper.html()).toContain("label");
    expect(wrapper.html()).not.toContain("error");
  })
  it("displays error when given", () => {   
    const opts = { props: {...options.props}, global: {...options.global} }
    opts.props.errors = [{ field: "ElementName", text: "error"} ] as Array<IValidationError>;
    const wrapper = render(InputArea, opts)
    expect(wrapper.html()).toContain("label");
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