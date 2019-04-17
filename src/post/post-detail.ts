import {PostGateway} from "./post-gateway";
import {inject} from "aurelia-framework";
import {Post} from "./models";
import {Box} from "../dialogs/box";

@inject(PostGateway, Box)
export class PostDetail {
    constructor(postGateway: PostGateway, box: Box) {
        this.postGateway = postGateway;
        this.box = box;
    }
    private postGateway: PostGateway;
    private box: Box;
    private post: Post;
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

        await fct.then(() => self.box.showNotification(msgSaved, title, buttonOk))
                 .catch(() => self.box.showError(msgError, title, [buttonOk]));
      }
    }
}
