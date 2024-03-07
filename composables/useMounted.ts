import type { RouteLocationNormalized, Router } from "vue-router";

export default function useMounted( refresh: Function, user: Ref<any> = ref(undefined), needsAuth: boolean = true) {
    const router = useRouter()
    const route = useRoute();
    
    return {
        on_mounted: () => {
            if (!user.value) {
                router.push({
                    path: "/admin/login",
                    query: { refresh: 'true', msg: 'login.sessionexpired' },
                })
            } else
                router.replace({
                    ...router.currentRoute,
                    query: {}
            })},
        on_before: () => {
            if (route.query.refresh) refresh();
        },
        on_user_changed: (newVal: Ref<any>) => {
            if (!newVal)
              router.push({
                path: "/admin/login",
                query: { msg: "login.sessionexpired" },
              })
        }
    }
}