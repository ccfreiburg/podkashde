import type { RouteLocationNormalized, Router } from "vue-router";

export default function useMounted( refresh: Function = ()=>{}, user: Ref<any> = ref(undefined), needsAuth: boolean = true) {
    
    return {
        on_mounted: () => {
            const router = useRouter()
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
            const route = useRoute();
            if (route.query.refresh) refresh();
        },
        on_user_changed: (newVal: any) => {
            const router = useRouter()
            if (!newVal)
              router.push({
                path: "/admin/login",
                query: { msg: "login.sessionexpired" },
              })
        }
    }
}