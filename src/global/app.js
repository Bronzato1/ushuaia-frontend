define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var App = (function () {
        function App() {
        }
        App.prototype.configureRouter = function (config, router) {
            config.map([
                { route: '', redirect: 'home' },
                { route: 'home', name: 'home', moduleId: 'home' },
                { route: 'page1', name: 'page1', moduleId: 'page1' }
            ]);
            this.router = router;
        };
        return App;
    }());
    exports.App = App;
});
//# sourceMappingURL=app.js.map