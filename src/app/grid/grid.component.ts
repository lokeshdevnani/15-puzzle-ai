import { GameService } from './../game.service';
import { Block } from './../block.class';
import { Component, OnInit, AfterContentChecked } from '@angular/core';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit, AfterContentChecked {

  blocks: Array<Block>;
  blank: Block;
  movesCount: number;
  time: number;
  timeString: string;
  time$;
  error = false;

  constructor(
    private gameService: GameService
  ) {
    let i;
    this.blocks = new Array<Block>();
    for (i = 0; i < 15; i++) {
      this.blocks.push(new Block(i + 1, i % 4, Math.floor(i / 4) ));
    }
    this.blank = new Block(0, 3, 3);
   }

  ngOnInit() {
    const gameState = this.gameService.getState();
    if (gameState) {
      const game = JSON.parse(gameState);
      this.blocks = game.blocks;
      this.blank = game.blank;
      this.movesCount = game.movesCount;
      this.resetTimer(true);
    } else {
      this.start();
    }
    this.gameService.triggerMovesSubscription();
  }

  ngAfterContentChecked() {
    this.gameService.triggerMovesSubscription();
  }

  start() {
    this.shuffle();
    this.time = 0;
    this.movesCount = 0;
    this.gameService.clearMoves();
    this.resetTimer(false);
    this.storeState();
  }

  resetTimer(fromStore: boolean) {
     if ( this.time$ !== undefined) {
      this.time$.unsubscribe();
    }

    const time$ = fromStore ? this.gameService.getTimer(true) : this.gameService.getTimer(false);

    this.time$ = time$.subscribe((x) => {
                this.time = x;
                const sec = x % 60;
                x = Math.floor( x / 60 );
                const min  = x % 60;
                const hour = Math.floor( x / 60 );

                this.timeString = `${hour}h ${min}m ${sec}s`;
              });
  }

  storeState() {
    this.gameService.storeState(this.blocks, this.blank, this.movesCount);
  }

  click(block: Block) {
    const xdiff = Math.abs(block.x - this.blank.x),
        ydiff = Math.abs(block.y - this.blank.y);

    if ( xdiff + ydiff === 1 ) {
      this.gameService.updateMoves(block, this.blank);
      this.movesCount++;
      [block.x, block.y, this.blank.x, this.blank.y] = [this.blank.x, this.blank.y, block.x, block.y];
      this.storeState();
    }
  }

  solve() {
    this.arrange([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    this.movesCount = 0;
    this.time = 0;
    this.gameService.clearMoves();
    this.resetTimer(false);
    this.storeState();
  }


  shuffle() {
    this.arrange( this.shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]) );
    this.movesCount++;
  }

  arrange(arr) {
    for (let i = 0; i < 15; i++) {
      this.blocks[i].x = arr[i] % 4;
      this.blocks[i].y = Math.floor(arr[i] / 4);
    }
    this.blank.x = arr[15] % 4;
    this.blank.y = Math.floor(arr[15] / 4);
  }

  // Fisher-Yates (aka Knuth) Shuffle.
  shuffleArray(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
}
