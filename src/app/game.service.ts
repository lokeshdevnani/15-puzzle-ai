import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { Block } from './block.class';
import { Injectable, OnInit } from '@angular/core';


@Injectable()
export class GameService {
  movesList: Array<Object>;
  movesStream: Subject< Array<Object> >;
  timer: Observable<any>;
  time: number;

  constructor() {
    this.movesList = new Array<Object>();
    this.movesStream = new Subject<Object>();
    this.time = 0;
    this.timer = Observable.timer(0, 1000)
              .map((x) => this.time = this.time + 1 );
   }

  updateMoves(block: Block, blank: Block) {
    const move = {
       number: block.number,
       from: {x: block.x, y: block.y },
       to: {x: blank.x, y: blank.y }
      };
    this.movesList.push(move);
    this.movesStream.next(this.movesList);
  }

  clearMoves() {
    this.movesList = new Array<Object>();
    this.movesStream.next(this.movesList);
  }

  getMovesList() {
    return this.movesStream;
  }

  getTimer() {
    this.time = 0;
    return this.timer;
  }
}
