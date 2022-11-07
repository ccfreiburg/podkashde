
export function useRouteBack() {
  const router = useRouter();
  const backroute = useState<string>('backroute', () => "/")

  if (!router.options.history.state.back?.toString().includes("login"))
    backroute.value = router.options.history.state.back?.toString() + "?refresh=true";

  return () => router.push(backroute.value)
}
