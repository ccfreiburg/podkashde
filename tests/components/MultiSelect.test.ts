import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import MultiSelect from "../../components/MultiSelect.vue";

describe("MultiSelect", () => {
  it("Title renders properly", () => {
    const wrapper = mount(MultiSelect, { props: { title: "ATitle" } });
    expect(wrapper.html()).toContain("ATitle");
  });
});