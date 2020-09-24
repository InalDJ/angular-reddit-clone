import { Component, OnInit } from '@angular/core';
import { SubredditModel } from 'src/app/services/subreddit/subreddit.response';
import { SubredditService } from 'src/app/services/subreddit/subreddit.service';



@Component({
  selector: 'app-subreddit-side-bar',
  templateUrl: './subreddit-side-bar.component.html',
  styleUrls: ['./subreddit-side-bar.component.css']
})
export class SubredditSideBarComponent implements OnInit {
  
  subreddits: Array<SubredditModel>;

  //if there are many subreddits the section will be bloated 
  //it's better to hide most of them and add "view all" button
  displayViewAll: boolean;

  constructor(private subredditService: SubredditService) {
    this.subredditService.getAllSubreddits().subscribe(data => {
      //check how many subreddits we have
      if(data.length >= 4){
        this.subreddits = data.splice(0, 3);
        this.displayViewAll = true;
      } else {
        this.subreddits = data;
      }
    })
   }

  ngOnInit(): void {
  }

}
