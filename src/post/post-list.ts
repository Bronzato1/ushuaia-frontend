import {inject} from "aurelia-framework";
import {Router} from "aurelia-router";
import {PostGateway} from "./post-gateway";
import {Post} from "./models";
import {Box} from "../dialogs/box";
import * as moment from "moment";
import 'moment/locale/fr'

@inject(Router, PostGateway, Box)
export class PostList{
    constructor(router: Router, postGateway: PostGateway, box: Box) {
        this.router = router;
        this.postGateway = postGateway;
        this.box = box;
    }
    private router: Router;
    private postGateway: PostGateway;
    private box: Box;
    private posts: Array<Post> = [];
    private activate() {
        return this.postGateway.getAll()
        .then(posts => {
            this.posts.splice(0);
            this.posts.push.apply(this.posts, posts);
        });
    }
    private showPostDetail(postId) {
        this.router.navigateToRoute('post-detail', {id: postId});
    }
    private createNewPost() {
        this.router.navigateToRoute('post-detail');
    }
    private deletePost(post: Post) {
      var message = 'Voulez-vous vraiment supprimer l\'élément ?';
      var title = 'Suppression';
      var buttonYes = 'Oui';
      var buttonNo = 'Non';

      this.box.showQuestion(message, title, buttonYes, buttonNo).whenClosed(response => 
        {
          if (!response.wasCancelled && response.output == buttonYes) 
            performTheDelete(this); 
        });

        async function performTheDelete(self: PostList) {
          await self.postGateway.deleteById(post.id);
          var pos = self.posts.findIndex(x => x.id == post.id);
          self.posts.splice(pos, 1);
        }
    }
}
