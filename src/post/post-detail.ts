import {PostGateway} from "./post-gateway";
import {inject, bindable} from "aurelia-framework";
import {Router} from "aurelia-router";
import {Post} from "./models";
import {Box} from "../dialogs/box";
import * as moment from "moment";
import 'moment/locale/fr'

@inject(PostGateway, Router, Box)
export class PostDetail {
    constructor(postGateway: PostGateway, router: Router, box: Box) {
        this.postGateway = postGateway;
        this.router = router;
        this.box = box;
    }
    private postGateway: PostGateway;
    private router: Router;
    private box: Box;
    private post: Post;
    @bindable datepicker;
    private activate(params, config) {
      var self = this;
      if (params && params.id)
          loadThePost();

        async function loadThePost()
        {
          var post = await self.postGateway.getById(params.id);
          self.post = post;
          config.navModel.setTitle(post.title);
        }
    }
    private attached() {
      $(document).ready(() => 
      {
        $('[autofocus]').focus();
      });
    }
    private savePost() {
      saveThePost(this);
      
      async function saveThePost(self: PostDetail)
      {
        var fct: any;
        var msgSaved = 'Les données ont été enregistrées';
        var msgError = 'Une erreur s\'est produite';
        var title = 'Confirmation';
        var buttonOk = 'Ok';

        if (self.post.id)
          fct = self.postGateway.updateById(self.post.id, self.post);
        else
          fct = self.postGateway.createById(self.post);

        await fct.then(() => self.box.showNotification(msgSaved, title, buttonOk)
                                     .whenClosed(() => self.router.navigate('postList')))
                 .catch(() => self.box.showError(msgError, title, [buttonOk]));
      }
    }
    private showPostList() {
      this.router.navigateToRoute('post-list');
    }
    private datepickerChanged() {
      this.datepicker.events.onHide = (e) => console.log('onHide');
      this.datepicker.events.onShow = (e) => console.log('onShow');
      this.datepicker.events.onChange = (e) => console.log('onChange');
      this.datepicker.events.onError = (e) => console.log('onError');
      this.datepicker.events.onUpdate = (e) => console.log('onUpdate');
    }
}
