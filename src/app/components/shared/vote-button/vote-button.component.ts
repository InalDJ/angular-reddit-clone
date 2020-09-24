import { Component, Input, OnInit } from '@angular/core';
import { PostModel } from 'src/app/services/shared/post-model';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';


@Component({
  //inject it into post-title.component.html
  selector: 'app-vote-button',
  templateUrl: './vote-button.component.html',
  styleUrls: ['./vote-button.component.css']
})
export class VoteButtonComponent implements OnInit {

  //to display post count inside vote-button.component
  //we add INput
  @Input() post: PostModel;

  faArrowUp =  faArrowUp;
  faArrowDown = faArrowDown;

  constructor() { }

  ngOnInit(): void {
  }

}
