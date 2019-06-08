import { Router, RouterConfiguration } from 'aurelia-router';

export class App {
  configureRouter(config: RouterConfiguration, router: Router) {
    config.map([
      { route: '', redirect: 'postlist'},
      { route: 'postlist',      name: 'post-list',      moduleId: 'post/post-list' },
      { route: 'postdetail',    name: 'post-detail',    moduleId: 'post/post-detail' },
      { route: 'postview',      name: 'post-view',      moduleId: 'post/post-view' }
    ]);
    this.router = router;
  }
  private router: Router;
}
