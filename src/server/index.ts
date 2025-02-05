import { j } from './jstack';
import { userRouter } from './routers/user-router';
import { jobRouter } from './routers/job-router';
import { resumeRouter } from './routers/resume-router';

const api = j
  .router()
  .basePath('/api')
  .use(j.defaults.cors)
  .onError((error, c) => {
    console.error(error);
    return c.json(
      {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      500
    );
  });

const appRouter = j.mergeRouters(api, {
  user: userRouter,
  job: jobRouter,
  resume: resumeRouter
});

export type AppRouter = typeof appRouter;
export default appRouter;
