// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { spaceRouter } from "./space";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("spaces.", spaceRouter)


// export type definition of API
export type AppRouter = typeof appRouter;
