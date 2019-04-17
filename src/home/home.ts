import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

@inject(Router)
export class home {
    constructor(Router: Router) {
        this.router = Router;
    }
    private router: Router;
    private letsgo() {
      this.router.navigate('page1');
    }
}
