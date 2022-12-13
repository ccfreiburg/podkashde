import IMenuSection from '~~/base/types/IMenuSection';

export function initDefaultMenu(): Object {
  var id = 0;
  const menuResult = {
    defaultBase: '/',
    keys: [
      {
        order: id++,
        name: 'menu.admin',
        description: 'menu.adminsub',
        entries: [
          {
            order: id++,
            slug: 'admin/login',
            name: 'menu.login',
            onlyNotLoggedIn: '',
          },
          {
            order: id++,
            slug: '#logout',
            name: 'menu.logout',
            onlyLoggedIn: '',
          },
          {
            order: id++,
            slug: 'admin/setpassword',
            name: 'menu.changepassword',
            onlyLoggedIn: '',
          },
          {
            order: id++,
            slug: 'admin/invitation',
            name: 'menu.invitataion',
            onlyAdmin: '',
          },
          {
            order: id++,
            slug: 'admin/import',
            name: 'menu.import',
            onlyAdmin: '',
          },
        ],
      },
      {
        order: id++,
        name: 'menu.podcasts',
        description: 'menu.podcastsub',
        entries: [
          {
            order: id++,
            slug: 'podcasts',
            name: 'menu.list',
          },
          {
            order: id++,
            slug: 'recent',
            name: 'menu.recent',
          },
          {
            order: id++,
            slug: 'serie',
            name: 'menu.series',
          },
          {
            order: id++,
            slug: 'admin/new-podcast',
            name: 'menu.new',
            onlyLoggedIn: '',
          },
          {
            order: id++,
            slug: 'admin/new-serie',
            name: 'menu.newseries',
            onlyLoggedIn: '',
          },
        ],
      },
    ]
  }
  return menuResult;
}

export function getDefaultMenu(
  menudata: Object,
  username: string
): Object {
  const loggin = username.length > 0;
  const admin = username.startsWith('admin');
  const menuResult = {
    defaultBase: menudata.defaultBase,
    keys: menudata.keys.map((section) => {
      return {
        order: section.order,
        name: section.name,
        description: section.description,
        entries: section.entries.filter(
          (entry) =>
            (entry.hasOwnProperty('onlyLoggedIn') && loggin) ||
            (entry.hasOwnProperty('onlyNotLoggedIn') && !loggin) ||
            (entry.hasOwnProperty('onlyAdmin') && admin) ||
            !(
              entry.hasOwnProperty('onlyLoggedIn') ||
              entry.hasOwnProperty('onlyNotLoggedIn') ||
              entry.hasOwnProperty('onlyAdmin')
            )
        ),
      }
    })
  }
  return menuResult;
}

export async function getMenu(
  url: string,
): Promise<Object> {
  const menudata = await $fetch<IMenuSection>(url);
  return menudata;
}
