import { describe, it, expect, vitest, beforeAll } from "vitest"
import { fireEvent, render } from "@testing-library/vue"
import NavBar from "../../components/NavBar.vue"
import { defineComponent } from "vue"
import { not } from "@vueuse/core"


const Tick = async () => await new Promise(r => setTimeout(r)) 

describe("NavBar", () => {
  const menu = [{
    id: 0,
    name: "menu1",
    description: "menu1",
    entries: [
      {
        id: 1,
        slug: "/hallo",
        name: "hallodu",
      },
    ],
  }]

  var nuxtlinkClicked = false
  
  beforeAll( () => {
    nuxtlinkClicked = false
    NavBar.components = { 
      "NuxtLink": defineComponent({
          props: [ "to" ],
          name: "NuxtLink",
          template: "<div @click='clicked'><slot/></div>",
          setup(props) {
            return {clicked: () => nuxtlinkClicked = true}
          }
      }) 
    }
  })

  it("Klick opens and closes menu",async () => {

    const wrapper = render(NavBar, { props: { menu }})
    const element = wrapper.getByTestId("NavBar.clickableElement")
    expect(wrapper.html()).not.toContain("menu1");
    await fireEvent(element,new MouseEvent('click'))
    expect(wrapper.html()).toContain("menu1");
    await fireEvent(element,new MouseEvent('click'))
    expect(wrapper.html()).not.toContain("menu1");
  })
  it("Klick outside the menue closes it",async () => {
    const wrapper = render(NavBar, { props: { menu } });
    const element = wrapper.getByTestId("NavBar.clickableElement")
    await fireEvent(element,new MouseEvent('click'))
    expect(wrapper.html()).toContain("menu1");
    await fireEvent.click(document)
    await fireEvent.click(document)
    expect(wrapper.html()).not.toContain("menu1");
  })
  it("Scroll the component closes options",async () => {
    const wrapper = render(NavBar, { props: { menu } });
    const element = wrapper.getByTestId("NavBar.clickableElement")
    await fireEvent(element,new MouseEvent('click'))
    expect(wrapper.html()).toContain("menu1");
    await fireEvent.scroll(document)
    await fireEvent(document,new Event('scroll', { bubbles: true }))
    expect(wrapper.html()).not.toContain("menu1");
  })
  it("Lets go of the event listener on documet when unrender", async () => {
    const addSpy = vitest.spyOn(document, 'addEventListener');
    const remSpy = vitest.spyOn(document, 'removeEventListener');
    const wrapper = render(NavBar, { props: { menu } });
    expect(addSpy).toHaveBeenCalled()
    await wrapper.unmount()
    expect(remSpy).toHaveBeenCalled()
  })
  it("Klick calls nuxt link",async () => {
    const wrapper = render(NavBar, { props: { menu }})
    var element = wrapper.getByTestId("NavBar.clickableElement")
    await fireEvent(element,new MouseEvent('click'))
    expect(wrapper.html()).toContain("menu1");
    element = wrapper.getByTestId("NavBar.menuItem")
    expect(nuxtlinkClicked).be.equal(false)
    await fireEvent(element,new MouseEvent('click'))
    expect(nuxtlinkClicked).be.equal(true)
  })
  it("Displays language menu, with propper current language",async () => {
    const wrapper = render(NavBar, { props: { menu, availableLocales: ['de','en'], locale: 'de' }, 
      global:{ 
        mocks: {
          $t: (s) => s + "#####"
      }}
    })
    var element = wrapper.getByTestId("NavBar.localeSelect")
    expect(element.value).to.equal("de");
    expect(element.options[element.selectedIndex].text).to.equal("de#####");
  })
  it("Click other language, emits localeChanged",async () => {
    const wrapper = render(NavBar, { props: { menu, availableLocales: ['de','en'], locale: 'de' }, 
      global:{ 
        mocks: {
          $t: (s) => s + "#####"
      }}
    })
    var element = wrapper.getByTestId("NavBar.localeSelect")
    fireEvent.change(element, { target: { value: 'en' } })
    expect(element.value).to.equal("en");
    expect(element.options[element.selectedIndex].text).to.equal("en#####");
    expect(wrapper.emitted()).to.haveOwnProperty('localeChanged');
    expect(wrapper.emitted()['localeChanged'][0][0]).to.equal('en')
  })
})