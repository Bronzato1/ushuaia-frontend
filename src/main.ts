import { Aurelia } from 'aurelia-framework'
import environment from './environment';
import 'froala-editor/js/froala_editor.pkgd.min';
import 'eonasdan-bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css';
import 'aurelia-bootstrap-datetimepicker/bootstrap-datetimepicker-bs4.css';

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('resources')
    .plugin('aurelia-dialog')
    .plugin('aurelia-bootstrap-datetimepicker', (config) => {
      config.extra.bootstrapVersion = 4;
      config.extra.buttonClass = 'btn btn-outline-secondary';
      config.options.keyBinds = null;
    })
    .plugin('aurelia-froala-editor', config => {
      config.options({
        charCounterCount: false
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
