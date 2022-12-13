import { describe, it, expect, vitest, beforeAll } from "vitest"
import { fireEvent, render } from "@testing-library/vue"
import NavBar from "../../components/NavBar.vue"
import { defineComponent } from "vue"
import {createI18n} from 'vue-i18n'

const Tick = async () => await new Promise(r => setTimeout(r)) 

const i18n = createI18n({
  legacy: true,
  locale: 'en',
  messages: {
    en: {
      de: "de",
      en: "en"
    },
    en: {
      de: "de",
      en: "en"
    },
  },
})

describe.skip("NavBar", () => {
  const menu = [{
    name: "menu1",
    description: "menu1",
    entries: [
      {
        order: 1,
        slug: "/hallo",
        name: "hallodu",
      },
      {
        order: 2,
        slug: "#bye",
        name: "bye",
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

  it.only("Klick opens and closes menu",async () => {
    const wrapper = render(NavBar, { props: { menu }, 
      global: {
        plugins: [i18n],
    }})
    const element = wrapper.getByTestId("NavBar.clickableElement")
    expect(wrapper.html()).not.toContain("menu1");
    await fireEvent(element,new MouseEvent('click'))
    expect(wrapper.html()).toContain("menu1");
    await fireEvent(element,new MouseEvent('click'))
    expect(wrapper.html()).not.toContain("menu1");
  })
  it("Klick outside the menue closes it",async () => {
    const wrapper = render(NavBar, { props: { menu }, 
      global: {
        plugins: [i18n],
    }})
    const element = wrapper.getByTestId("NavBar.clickableElement")
    await fireEvent(element,new MouseEvent('click'))
    expect(wrapper.html()).toContain("menu1");
    await fireEvent.click(document)
    await fireEvent.click(document)
    expect(wrapper.html()).not.toContain("menu1");
  })
  it("Scroll the component closes options",async () => {
    const wrapper = render(NavBar, { props: { menu }, 
      global: {
        plugins: [i18n],
    }})
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
    const wrapper = render(NavBar, { props: { menu }, 
      global: {
        plugins: [i18n],
    }})
    expect(addSpy).toHaveBeenCalled()
    await wrapper.unmount()
    expect(remSpy).toHaveBeenCalled()
  })
  it("Klick calls nuxt link",async () => {
    const wrapper = render(NavBar, { props: { menu }, 
      global: {
        plugins: [i18n],
    }})
    var element = wrapper.getByTestId("NavBar.clickableElement")
    await fireEvent(element,new MouseEvent('click'))
    expect(wrapper.html()).toContain("menu1");
    element = wrapper.getByTestId("NavBar.menuItem")
    expect(nuxtlinkClicked).be.equal(false)
    await fireEvent(element,new MouseEvent('click'))
    expect(nuxtlinkClicked).be.equal(true)
  })
  it("Klick on a menu item where the slug starts with # emits event",async () => {
    const wrapper = render(NavBar, { props: { menu }, 
      global: {
        plugins: [i18n],
    }})
    var element = wrapper.getByTestId("NavBar.clickableElement")
    await fireEvent(element,new MouseEvent('click'))
    expect(wrapper.html()).toContain("bye");
    element = wrapper.getByTestId("NavBar.menuItemEvent")
    await fireEvent(element,new MouseEvent('click'))
    expect(wrapper.emitted()).to.haveOwnProperty('menuItemClicked');
    expect(wrapper.emitted()['menuItemClicked'][0][0]).to.equal('#bye')
  })  
  it("Displays language menu, with propper current language",async () => {
    const wrapper = render(NavBar, { props: { menu, availableLocales: ['de','en'], locale: 'de' }, 
    global: {
      plugins: [i18n],
    }})
    var element = wrapper.getByTestId("NavBar.localeSelect")
    expect(element.value).to.equal("de");
    expect(element.options[element.selectedIndex].text).to.equal("de");
  })
  it("Click other language, emits localeChanged",async () => {
    const wrapper = render(NavBar, { props: { menu, availableLocales: ['de','en'], locale: 'de' }, 
    global: {
      plugins: [i18n],
    }})
    var element = wrapper.getByTestId("NavBar.localeSelect")
    fireEvent.update(element, 'en')
    expect(element.value).to.equal("en");
    expect(element.options[element.selectedIndex].text).to.equal("en");
    expect(wrapper.emitted()).to.haveOwnProperty('localeChanged');
    expect(wrapper.emitted()['localeChanged'][0][0]).to.equal('en')
  })
})