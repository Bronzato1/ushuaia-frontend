import {PostGateway} from "../post/post-gateway";
import { inject } from "aurelia-framework";

@inject(PostGateway)
export class Administration {
    constructor(postGateway: PostGateway) {
        this.postGateway = postGateway;
    }
    private postGateway: PostGateway;
    private zipFile: any;
    private exportData() {
        this.postGateway.downloadZip();
    }
    private importData() {
        this.postGateway.uploadZip(this.zipFile);
    }

}