import { SESSION_AP } from "~~/base/Constants"
import { IUser } from "~~/base/types/IUser"
import { LOGIN_AP, LOGOUT_AP } from "../base/Constants"

export const useAuthCookie = () => useCookie('auth_token')

export async function useUser(): Promise<IUser> {
  const authCookie = useAuthCookie().value
  const user = useState<IUser>('user')

  if (authCookie && !user.value) {

    const { data } = await useFetch(SESSION_AP, {
      headers: useRequestHeaders(['cookie'])
    })
    if (data.value)
      user.value = data.value as IUser
    else
      user.value = null
  }

  return user.value
}

export async function userLogout() {
  await useFetch(LOGOUT_AP)
  useState('user').value = null
  await useRouter().push('/')
}

export async function loginAlex() {
}


export async function loginWithEmail(email: string, password: string) {
    const user = await $fetch<IUser>(LOGIN_AP, { method: 'POST', body: { email: email, password: password } })
    useState('user').value = user
    await useRouter().push("/")
}