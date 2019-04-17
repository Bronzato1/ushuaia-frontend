var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "aurelia-router"], function (require, exports, aurelia_framework_1, aurelia_router_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var home = (function () {
        function home(Router) {
            this.router = Router;
        }
        home.prototype.letsgo = function () {
            this.router.navigate('page1');
        };
        home = __decorate([
            aurelia_framework_1.inject(aurelia_router_1.Router),
            __metadata("design:paramtypes", [aurelia_router_1.Router])
        ], home);
        return home;
    }());
    exports.home = home;
});
//# sourceMappingURL=home.js.map