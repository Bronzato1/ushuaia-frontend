import {inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Post} from './models';
import environment from 'environment';

@inject(HttpClient)
export class PostGateway {
  constructor(httpClient:HttpClient) {
    this.httpClient = httpClient.configure(config => {
      config
        .useStandardConfiguration()
        .withBaseUrl(environment.postsUrl);
    });
  }
  private httpClient: HttpClient;
  getAll(): Promise<Post[]> {
    return this.httpClient.fetch(`api/post/`)
      .then(response => response.json())
      .then(dto => dto.map(Post.fromObject));
  }
  getById(id): Promise<Post> {
    return this.httpClient.fetch(`api/post/${id}`)
      .then(response => response.json())
      .then(Post.fromObject);
  }
  updateById(id, post: Post): Promise<void> {
    return this.httpClient.fetch(`api/post/${id}`, { method: 'put', body: json(post) })
    .then(saved => 
      { 
        console.log('Result ' + saved.status + ': ' + saved.statusText);
        return Promise.resolve();
      })
    .catch(error => 
      {
        console.log('Result ' + error.status + ': ' + error.statusText);
        return Promise.reject();
      });
  }
  createById(post: Post): Promise<void | Post> {
    return this.httpClient.fetch(`api/post`, {
      method: 'post',
      body: json(post)
    })
    .then(response => response.json())
    .then(Post.fromObject)
    .catch(error => 
      {
        console.log('Result ' + error.status + ': ' + error.statusText);
      });
  }
  deleteById(id): Promise<void> {
    return this.httpClient.fetch(`api/post/${id}`, {
      method: 'delete'
    })
    .then(done => 
      {
        console.log('Result ' + done.status + ': ' + done.statusText);
      })
    .catch(error => 
      {
        console.log('Result ' + error.status + ': ' + error.statusText);
      });
  }
}
