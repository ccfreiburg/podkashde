import { describe, it, expect } from "vitest"
import { fireEvent, render } from "@testing-library/vue"
import {createI18n} from 'vue-i18n'
import ListPaginator, {pageLabelList} from "../../components/ListPaginator.vue"
import { NUM_PAGINATION_LINKS } from "../../base/Constants"

const Tick = async () => await new Promise(r => setTimeout(r)) 

const i18n = createI18n({
  legacy: true,
  locale: 'en',
  messages: {
    en: {
      "paginator": {
        "next": "Next",
        "previous": "Previous",
        "status": "Next",
        "statusshort": "Da"
      }    
    }
  },
})

const options = { 
  props: { 
    value: 2,
    max: 29,
  }, 
  global:{ 
    plugins: [i18n],
  }
}



describe("Paginator", () => {
  function resizeWindow(width: Number) {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 150,
    }) 
    window.dispatchEvent(new Event('resize'));
  }

  it("paginator is rendered", () => {   
    const wrapper = render(ListPaginator, options)
    expect(wrapper.html()).toContain("Next");
  })

  it("paginator small window prev button", async () => {  
    const wrapper = render(ListPaginator, options)
    const prevButton = wrapper.getByTestId("ListPaginator.sm_previous")
    await fireEvent(prevButton,new MouseEvent('click'))
    expect(wrapper.emitted()).to.haveOwnProperty('update:value');
    expect(wrapper.emitted()['update:value'][0][0]).to.equal(1)
    await fireEvent(prevButton,new MouseEvent('click'))
    expect(wrapper.emitted()['update:value']).toHaveLength(1)
  })
  it("paginator small window next button", async () => {  
    const wrapper = render(ListPaginator, options)
    const nextButton = wrapper.getByTestId("ListPaginator.sm_next")
    await fireEvent(nextButton,new MouseEvent('click'))
    expect(wrapper.emitted()).to.haveOwnProperty('update:value');
    expect(wrapper.emitted()['update:value'][0][0]).to.equal(3)
    await fireEvent(nextButton,new MouseEvent('click'))
    expect(wrapper.emitted()['update:value']).toHaveLength(1)    
  })
  it("paginator big window prev button", async () => {  
    const wrapper = render(ListPaginator, options)
    const prevButton = wrapper.getByTestId("ListPaginator.lg_previous")
    await fireEvent(prevButton,new MouseEvent('click'))
    expect(wrapper.emitted()).to.haveOwnProperty('update:value');
    expect(wrapper.emitted()['update:value'][0][0]).to.equal(1)
    await fireEvent(prevButton,new MouseEvent('click'))
    expect(wrapper.emitted()['update:value']).toHaveLength(1)
  })
  it("paginator big window next button", async () => {  
    const wrapper = render(ListPaginator, options)
    const nextButton = wrapper.getByTestId("ListPaginator.lg_next")
    await fireEvent(nextButton,new MouseEvent('click'))
    expect(wrapper.emitted()).to.haveOwnProperty('update:value');
    expect(wrapper.emitted()['update:value'][0][0]).to.equal(3)
    await fireEvent(nextButton,new MouseEvent('click'))
    expect(wrapper.emitted()['update:value']).toHaveLength(1)    
  })
  it("pageLabelList 0 returns empty list", ()=> {
    const actual = pageLabelList(0,0)
    expect(actual).toHaveLength(0)
  })
  it("pageLabelList 1 returns 0", ()=> {
    const actual = pageLabelList(0,0)
    expect(actual).toHaveLength(0)
  })
  it("pageLabelList 2 returns 2 buttons", ()=> {
    const actual = pageLabelList(1,2)
    expect(actual).toHaveLength(2)
  })
  it("pageLabelList NUM_PAGINATION_LINKS returns buttons with numbers", ()=> {
    const actual = pageLabelList(1,NUM_PAGINATION_LINKS)
    expect(actual).toHaveLength(NUM_PAGINATION_LINKS)
    expect(actual.filter((e) => e=="...")).toHaveLength(0)
  })
  it("pageLabelList too many pages returns ... in the middle", ()=> {
    const actual = pageLabelList(1,NUM_PAGINATION_LINKS+1)
    expect(actual).toHaveLength(NUM_PAGINATION_LINKS)
    expect(actual.filter((e) => e=="...")).toHaveLength(1)
  })
  it("pageLabelList too many pages selected in the middle has ... twice", ()=> {
    const actual = pageLabelList(5,NUM_PAGINATION_LINKS*4)
    expect(actual).toHaveLength(NUM_PAGINATION_LINKS)
    expect(actual.filter((e) => e=="...")).toHaveLength(2)
  })
  it.each([
   [1, 19, [1,2,3,4,5,"...",19]],
   [4, 19, [1,2,3,4,5,"...",19]],
   [5, 19, [1,"...",4,5,6,"...",19]],
   [15, 19, [1,"...",14,15,16,"...",19]],
   [16, 19, [1,"...",15,16,17,18,19]],
   [19, 19, [1,"...",15,16,17,18,19]] 
  ])("", (page, max, expected) => {
    const actual = pageLabelList(page,max) 
    expect(actual).toStrictEqual(expected)
  })
})