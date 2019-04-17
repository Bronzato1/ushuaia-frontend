import {Aurelia} from 'aurelia-framework'
import environment from './environment';
import "froala-editor/js/froala_editor.pkgd.min";

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('resources')
    .plugin('aurelia-dialog')
    .plugin('aurelia-froala-editor', config => {
      config.options({
        toolbarInline: true
      })
    });

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => aurelia.setRoot('global/app'));
}
