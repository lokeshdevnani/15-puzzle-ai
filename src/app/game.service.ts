import { Subject } from 'rxjs/Subject';
import { Block } from './block.class';
import { Injectable } from '@angular/core';

@Injectable()
export class GameService {
  movesList: Array<Object>;
  movesStream: Subject< Array<Object> >;

  constructor() {
    this.movesList = new Array<Object>();
    this.movesStream = new Subject<Object>();
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
}
