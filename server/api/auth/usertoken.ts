import { createUserWithToken } from "~~/server/services/userService";

export default defineEventHandler( async (event) => {
  const query = getQuery(event);
  console.log(query)
  const user = await createUserWithToken({ username: query.username as string},query.type as string);
  return user.token
});

