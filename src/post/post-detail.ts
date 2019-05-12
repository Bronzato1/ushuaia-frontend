import { PostGateway } from "./post-gateway";
import { inject, bindable } from "aurelia-framework";
import { DialogService } from 'aurelia-dialog';
import { Router } from "aurelia-router";
import { Post } from "./models";
import { Box } from "../dialogs/box";
import { ColorizeCode } from '../ColorizeCodeDialog/colorizeCode';
import environment from 'environment';
import secret from 'secret';
import * as moment from "moment";
import * as CodeMirror from 'codemirror';
import * as $ from 'jquery';

@inject(PostGateway, Router, Box, DialogService)
export class PostDetail {
  @bindable datepicker;
  private postGateway: PostGateway;
  private router: Router;
  private box: Box;
  private dialogService: DialogService;
  private post: Post;
  constructor(postGateway: PostGateway, router: Router, box: Box, dialogService: DialogService) {
    this.postGateway = postGateway;
    this.router = router;
    this.box = box;
    this.dialogService = dialogService
    this.injectCustomDialogForColorizeCode();
    this.injectCustomPopupForTesting();
  }
  private froalaConfig = {
    key: secret.froalaKey,
    toolbarInline: false,
    charCounterCount: false,
    imageUploadURL: 'http://localhost:5000/api/froala/UploadImage',
    fileUploadURL: 'http://localhost:5000/api/froala/UploadFile',
    imageManagerLoadURL: 'http://localhost:5000/api/froala/LoadImages',
    imageManagerDeleteURL: 'http://localhost:5000/api/froala/DeleteImage',
    imageManagerDeleteMethod: 'POST',
    codeMirror: CodeMirror,
    htmlUntouched: true,
    toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', '|', 'fontFamily', 'fontSize', 'color', 'inlineClass', 'inlineStyle', 'paragraphStyle', 'lineHeight', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', 'insertLink', 'insertImage', 'insertVideo', 'embedly', 'insertFile', 'insertTable', '|', 'emoticons', 'fontAwesome', 'insertHR', 'selectAll', 'clearFormatting', '|', 'html', '|', 'undo', 'redo', 'myButton', 'colorizeCode'],
    codeBeautifierOptions: {
      end_with_newline: true,
      indent_inner_html: true,
      extra_liners: "['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', ul', 'ol', 'table', 'dl']",
      brace_style: 'expand',
      indent_char: ' ',
      indent_size: 4,
      wrap_line_length: 0
    }
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
  private injectCustomPopupForTesting() {
    // Define popup template.
    $.extend((<any>$).FroalaEditor.POPUP_TEMPLATES, {
      'customPlugin.popup': '[_BUTTONS_][_CUSTOM_LAYER_]'
    });

    // Define popup buttons.
    $.extend((<any>$).FroalaEditor.DEFAULTS, {
      popupButtons: ['popupClose', '|', 'popupButton1', 'popupButton2'],
    });

    // The custom popup is defined inside a plugin (new or existing).
    (<any>$).FroalaEditor.PLUGINS.customPlugin = function (editor) {
      // Create custom popup.
      function initPopup () {
        // Load popup template.
        var template = (<any>$).FroalaEditor.POPUP_TEMPLATES.customPopup;
        if (typeof template == 'function') template = template.apply(editor);

                // Popup buttons.
                var popup_buttons = '';

                // Create the list of buttons.
                if (editor.opts.popupButtons.length > 1) {
                  popup_buttons += '<div class="fr-buttons">';
                  popup_buttons += editor.button.buildList(editor.opts.popupButtons);
                  popup_buttons += '</div>';
                }

                // Custom layer.
                var custom_layer = '<div class="fr-my-layer fr-layer fr-active" id="fr-my-layer-' + editor.id + '"><div class="fr-input-line"><textarea id="fr-my-layer-text-' + editor.id + '"  placeholder="' + editor.language.translate('Alternate Text') + '" tabIndex="1"></textarea></div></div>';

                // Load popup template.
                var template:any = {
                  buttons: popup_buttons,
                  custom_layer: custom_layer
                };

                // Create popup.
                var $popup = editor.popups.create('customPlugin.popup', template);

                return $popup;


      }

      // Show the popup
      function showPopup () {
        // Get the popup object defined above.
        var $popup = editor.popups.get('customPlugin.popup');

        // If popup doesn't exist then create it.
        // To improve performance it is best to create the popup when it is first needed
        // and not when the editor is initialized.
        if (!$popup) $popup = initPopup();

        // Set the editor toolbar as the popup's container.
        editor.popups.setContainer('customPlugin.popup', editor.$tb);

        // If the editor is not displayed when a toolbar button is pressed, then set BODY as the popup's container.
        // editor.popups.setContainer('customPlugin.popup', $('body'));

        // Trigger refresh for the popup.
        // editor.popups.refresh('customPlugin.popup');

        // This custom popup is opened by pressing a button from the editor's toolbar.
        // Get the button's object in order to place the popup relative to it.
        var $btn = editor.$tb.find('.fr-command[data-cmd="myButton"]');

        // Compute the popup's position.
        var left = $btn.offset().left + $btn.outerWidth() / 2;
        var top = $btn.offset().top + (editor.opts.toolbarBottom ? 10 : $btn.outerHeight() - 10);

        // Show the custom popup.
        // The button's outerHeight is required in case the popup needs to be displayed above it.
        editor.popups.show('customPlugin.popup', left, top, $btn.outerHeight());
      }

      // Hide the custom popup.
      function hidePopup () 
      {
        var stringOfLines = $("#fr-my-layer-text-" + editor.id).val();
        var arrayOfLines = (<any>stringOfLines).trim().split('\n');
        var arrayOfCodeTags = [];

        for (var line in arrayOfLines)
          arrayOfCodeTags.push(`<code>` + arrayOfLines[line] +`</code>`);

        var html = arrayOfCodeTags.join(`\n`);

        // coloring syntax
        html = html.replace('function', '<span style="color: rgb(84, 172, 210);">function</span>');
        html = html.replace('var', '<span style="color: rgb(84, 172, 210);">var</span>');
        html = html.replace('console.log', '<span style="color: rgb(255, 65, 230);">console.log</span>');

        var m = html.match(/"((?:\\.|[^"\\])*)"/)[0];

        // Attention, il y a 2 espaces invisibles dans le code ci-dessous... '‪'
        // Pour contrer un bug de retour à la ligne dans le code hmtl généré
        editor.html.insert(`\n\n<pre class="block-code">‪\n` + html + `\n‪</pre>\n\n`);
        editor.popups.hide('customPlugin.popup');
      }

      // Methods visible outside the plugin.
      return {
        showPopup: showPopup,
        hidePopup: hidePopup
      }
    };

    // Define an icon and command for the button that opens the custom popup.
    (<any>$).FroalaEditor.DefineIcon('buttonIcon', { NAME: 'star'});
    (<any>$).FroalaEditor.RegisterCommand('myButton', {
      title: 'Show Popup',
      icon: 'buttonIcon',
      undo: false,
      focus: false,
      popup: true,
      // Buttons which are included in the editor toolbar should have the plugin property set.
      plugin: 'customPlugin',
      callback: function () {
        if (!this.popups.isVisible('customPlugin.popup')) {
          this.customPlugin.showPopup();
        }
        else {
          if (this.$el.find('.fr-marker')) {
            this.events.disableBlur();
            this.selection.restore();
          }
          this.popups.hide('customPlugin.popup');
        }
      }
    });

    // Define custom popup close button icon and command.
    (<any>$).FroalaEditor.DefineIcon('popupClose', { NAME: 'plus' });
    (<any>$).FroalaEditor.RegisterCommand('popupClose', {
      title: 'Insert',
      undo: false,
      focus: false,
      refreshAfterCallback: true,
      callback: function () {
        this.customPlugin.hidePopup();
      }
    });
  }
  private injectCustomDialogForColorizeCode() {
    var self = this;
    (<any>$).FroalaEditor.DefineIcon('colorizeCode', {NAME: 'info'});
    (<any>$).FroalaEditor.RegisterCommand('colorizeCode', {
      title: 'Colorize code',
      focus: false,
      undo: false,
      refreshAfterCallback: false,
      callback: function () {
        self.dialogService.open({ viewModel: ColorizeCode, model: { } }).whenClosed(response => {
          if (!response.wasCancelled) {
            self.post.content = self.post.content + response.output;
          }
        });
      }      
    });
  }
}
