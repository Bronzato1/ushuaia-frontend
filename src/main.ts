import { Aurelia } from 'aurelia-framework'
import environment from './environment';

// Codemirror
import 'codemirror/addon/runmode/runmode';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/ambiance.css';
import 'codemirror/theme/paraiso-dark.css';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/css/css';

// Froala
import 'froala-editor/css/plugins/code_view.min.css';
import 'froala-editor/js/froala_editor.pkgd.min';
import 'froala-editor/js/plugins/code_view.min';
import 'froala-editor/js/plugins/code_beautifier.min';

// Datepicker
import 'eonasdan-bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css';
import 'aurelia-bootstrap-datetimepicker/bootstrap-datetimepicker-bs4.css';

// Moment
import 'moment/locale/fr';

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
