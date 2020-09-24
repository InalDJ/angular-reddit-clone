import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreatePostPayload } from 'src/app/components/post/create-post/create-post.payload';
import { PostModel } from './post-model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  

  postsUrl = 'http://localhost:8080/api/posts';


  constructor(private http: HttpClient) { }

  getAllPosts(): Observable<Array<PostModel>>{
    return this.http.get<Array<PostModel>>(this.postsUrl);
  }

  createPost(postPayload: CreatePostPayload): Observable<any> {
    console.log(postPayload.description)
    return this.http.post(this.postsUrl,postPayload);
  }



}
