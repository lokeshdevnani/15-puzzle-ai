import { GameService } from './../game.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-moves-list',
  templateUrl: './moves-list.component.html',
  styleUrls: ['./moves-list.component.css']
})
export class MovesListComponent implements OnInit {
  movesList: Array<Object>;

  constructor(
    private gameService: GameService
  ) {
    this.movesList = new Array<Object>();
  }

  ngOnInit() {
    this.gameService.getMovesList()
      .subscribe( (moves) => {
        this.movesList = moves;
      });
  }

}
