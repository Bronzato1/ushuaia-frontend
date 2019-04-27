import {PostGateway} from "../post/post-gateway";
import { inject } from "aurelia-framework";

@inject(PostGateway)
export class Administration {
    constructor(postGateway: PostGateway) {
        this.postGateway = postGateway;
    }
    private postGateway: PostGateway;
    private testDownload() {
        this.postGateway.downloadZip();
    }

}