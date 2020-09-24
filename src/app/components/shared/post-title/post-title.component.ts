import { Component, Input, OnInit } from '@angular/core';
import { PostModel } from 'src/app/services/shared/post-model';
import { PostService } from 'src/app/services/shared/post.service';
import { faComments } from '@fortawesome/free-solid-svg-icons';


@Component({
  //inject it into home.component.html
  selector: 'app-post-title',
  templateUrl: './post-title.component.html',
  styleUrls: ['./post-title.component.css']
})
export class PostTitleComponent implements OnInit {

   //we import icons from fontawesome lib and assign them to a local variables
   faComments = faComments;

 @Input() posts$: Array<PostModel>;

  constructor(private postService: PostService) { 
    this.postService.getAllPosts().subscribe(
      post=>{
        this.posts$ = post;
      }
    )
  }

  ngOnInit(): void {
  }

}
