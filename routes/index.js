import routerHome from '#root/routes/home.js';

export default (app) => {
  app.use('/', routerHome);
};
