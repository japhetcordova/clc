import "server-only";

import { createTRPCContext, createCallerFactory } from "./trpc";
import { appRouter } from "./root";

const createCaller = createCallerFactory(appRouter);

export const trpcServer = async () => {
    const context = await createTRPCContext();
    return createCaller(context);
};
