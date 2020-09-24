import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubredditModel } from 'src/app/services/subreddit/subreddit.response'

@Injectable({
  providedIn: 'root'
})
export class SubredditService {


  subredditsUrl = 'http://localhost:8080/api/subreddit';
  

  constructor(private httpClient: HttpClient) { }

  getAllSubreddits(): Observable<Array<SubredditModel>>{
    return this.httpClient.get<Array<SubredditModel>>(this.subredditsUrl)
  }

  createSubreddit(subredditModel: SubredditModel): Observable<SubredditModel>{
    return this.httpClient.post<SubredditModel>(this.subredditsUrl, subredditModel);
  }
}
