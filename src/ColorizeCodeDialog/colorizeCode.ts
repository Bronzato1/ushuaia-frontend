import {DialogController} from 'aurelia-dialog';
import { inject, bindable } from "aurelia-framework";
import * as CodeMirror from 'codemirror';

@inject(DialogController)
export class ColorizeCode {
  constructor(dialogController: DialogController) {
    this.dialogController = dialogController;
  }
  private dialogController;
  private sourceCodeTextArea;
  private innerHtmlForOutput;
  private innerHtmlForNumbers;
  private modes = [
    { id: 'xml', name: 'HTML'},
    { id: 'css', name: 'CSS'},
    { id: 'javascript', name: 'JavaScript'},
    { id: 'x-csharp', name: 'C sharp'}
  ];
  private themes = [
    { id: 'default', name: 'Default' },
    { id: 'ambiance', name: 'Ambiance' },
    { id: 'paraiso-dark', name: 'Paraiso dark' },
  ];
  private selectedMode = this.modes[0];
  private selectedTheme = this.themes[0];
  private colorizeCodeNow() {
    var accum = [], gutter = [], size = 0;
    var callback = function(string, style) {
      
      string = string.replace(/</g, '&lt;').replace(/>/g, '&gt;');

      if (string == "\n") {
            accum.push("<br>");
            gutter.push('<span>'+(++size)+'</span><br>');
      }
      else if (style)
          accum.push("<span class=\"cm-" + (style) + "\">" + (string) + "</span>");
      else
          accum.push((string));
    }

    // Remove extra leading and ending spaces or newlines.
    this.sourceCodeTextArea = $.trim(this.sourceCodeTextArea) + '\n';
    
    var source = this.sourceCodeTextArea;
    var mode = this.selectedMode.id;

    CodeMirror.runMode(source, `text/${mode}`, callback);
    
    this.innerHtmlForOutput = accum.join('');
    this.innerHtmlForNumbers = gutter.join('');
  }
  private ok()
  {
    var data = document.getElementsByClassName('block-code')[0];
    this.dialogController.ok('<br>' + (<any>data).outerHTML + '<br>');
  }
  private cancel() {
    this.dialogController.cancel();
  }
}
