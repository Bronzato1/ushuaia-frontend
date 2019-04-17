import { Router, RouterConfiguration } from 'aurelia-router';

export class App {
  configureRouter(config: RouterConfiguration, router: Router) {
    config.map([
      { route: '', redirect: 'home'},
      { route: 'home',      name: 'home',           moduleId: 'home/home' },
      { route: 'page1',     name: 'page1',          moduleId: 'page1/page1' },
      { route: 'postlist',  name: 'post-list',      moduleId: 'post/post-list' },
      { route: 'postdetail',name: 'post-detail',    moduleId: 'post/post-detail' }
    ]);
    this.router = router;
  }
  private router: Router;
}
