import { Box } from './../dialogs/box';
import { PostGateway } from "../post/post-gateway";
import { inject } from "aurelia-framework";
import { Router } from "aurelia-router";

@inject(Router, PostGateway, Box)
export class Administration {
  private postGateway: PostGateway;
  private router: Router;
  private box: Box;
  private zipFile: any;
  constructor(router: Router, postGateway: PostGateway, box: Box) {
    this.router = router;
    this.postGateway = postGateway;
    this.box = box;
  }
  private attached(){
    var self = this;
    $(document).ready(() => {
      $('#fileChooser').change(function() {
        self.importData();
    });
    });
  }
  private exportData() {
      this.postGateway.downloadZip();
  }
  private importData() {
    if (!this.zipFile) {
      $("#fileChooser").click();
      return;
    }
      
    this.postGateway.uploadZip(this.zipFile);
  }
  private clearAllData() {
    var message = 'Cette opération est irréversible. Etes-vous sur ?';
    var title = 'Suppression totale';
    var buttonOk = 'Ok';
    var buttonCancel = 'Annuler';

    this.box.showQuestion(message, title, buttonOk, buttonCancel).whenClosed((response) => 
    { 
      if (!response.wasCancelled && response.output == buttonOk)
        this.postGateway.clearAllData();
    });
  }
  private showPostList() {
    this.router.navigateToRoute('post-list');
  }
}
