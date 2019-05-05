import { PostGateway } from "./post-gateway";
import { inject, bindable } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Post } from "./models";
import { Box } from "../dialogs/box";
import environment from 'environment';
import secret from 'secret';
import * as moment from "moment";
import 'moment/locale/fr';

@inject(PostGateway, Router, Box)
export class PostDetail {
  @bindable datepicker;
  private postGateway: PostGateway;
  private router: Router;
  private box: Box;
  private post: Post;
  private froalaConfig = {
    key: secret.froalaKey,
    toolbarInline: true,
    charCounterCount: false,
    imageUploadURL: 'http://localhost:5000/api/froala/UploadImage',
    fileUploadURL: 'http://localhost:5000/api/froala/UploadFile',
    imageManagerLoadURL: 'http://localhost:5000/api/froala/LoadImages',
    imageManagerDeleteURL: 'http://localhost:5000/api/froala/DeleteImage',
    imageManagerDeleteMethod: 'POST',
    //htmlAllowedTags: ['.*'],
    //pastePlain: false    
  }
  
  private froalaEvents = {
    'image.uploaded': this.imageUploaded,
    'image.removed': this.imageRemoved,
    'image.file.unlink': this.imageFileUnlink
  }
  private activate(params, config) {
    var self = this;
    if (params && params.id)
      loadThePost();

    async function loadThePost() {
      var post = await self.postGateway.getById(params.id);
      self.post = post;
      config.navModel.setTitle(post.title);
    }
  }
  private imageUploaded(e, editor, response) {
    // Parse response to get image url.
    var resp = JSON.parse(response);
    var img_url = environment.backendUrl + resp.link;

    // Insert image.
    editor.image.insert(img_url, false, null, editor.image.get(), response);
    return false;
  }
  private imageRemoved(e, editor, $img) {
    $.ajax({
      // Request method.
      method: "POST",

      // Request URL.
      url: environment.backendUrl + "api/froala/DeleteImage",

      // Request params.
      data: {
        src: $img.attr('src')
      }
    })
      .done(function (data) {
        console.log('image was deleted');
      })
      .fail(function (err) {
        console.log('image delete problem: ' + JSON.stringify(err));
      })
  }
  private imageFileUnlink(e, editor, link) {
    $.ajax({
      // Request method.
      method: "POST",

      // Request URL.
      url: environment.backendUrl + "api/froala/DeleteFile",

      // Request params.
      data: {
        src: link.getAttribute('href')
      }
    })
      .done(function (data) {
        console.log('file was deleted');
      })
      .fail(function (err) {
        console.log('file delete problem: ' + JSON.stringify(err));
      })
  }
  private attached() {
    $(document).ready(() => {
      $('[autofocus]').focus();
    });
  }
  private savePost() {
    saveThePost(this);

    async function saveThePost(self: PostDetail) {
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
