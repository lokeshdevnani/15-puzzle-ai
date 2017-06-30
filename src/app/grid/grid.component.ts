import { Solution } from './../Solution';
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

  click(block: any) {
    const xdiff = Math.abs(block.x - this.blank.x),
        ydiff = Math.abs(block.y - this.blank.y);

    if ( xdiff + ydiff === 1 ) {
      this.gameService.updateMoves(block, this.blank);
      this.movesCount++;
      [block.x, block.y, this.blank.x, this.blank.y] = [this.blank.x, this.blank.y, block.x, block.y];
      this.storeState();
    } else {
      block.errMove = true;
      setTimeout( () => block.errMove = false, 1000);
    }
  }

  solve() {
    const sol = new Solution();
    sol.input(this.blocks, this.blank, 4);
    alert('Please wait while the solution is being computed...');
    const res = sol.solve();
    if (res === false) {
      alert('Sorry, No solution found. Perhaps, it requires more computing resources and time.');
      return;
    }
    alert('Solution found..');
    this.emulate(res.path);
  }

  emulate(path: string) {
    console.log(path);

      const fx = (c) => {
        let x = this.blank.y, y = this.blank.x;
        if ( c === 'D' ) {
          y++;
        } else if ( c === 'U' ) {
          y--;
        } else if ( c === 'L' ) {
          x--;
        } else if ( c === 'R' ) {
          x++;
        }

        let found = -1;
        for (let i = 0; i < this.blocks.length; i++ ) {
          if (this.blocks[i].x === x && this.blocks[i].y === y) {
            found = i;
          }
        }
        if (found > -1) {
          [this.blocks[found].y, this.blocks[found].x, this.blank.y, this.blank.x] =
          [this.blank.x, this.blank.y, this.blocks[found].x, this.blocks[found].y];
        }
      };

    for ( let p = 0; p < path.length; p++ ) {
      const ch = path[p];

      setTimeout( function(){
        fx(ch);
      }, 300 * p );
    }
  }

  solveFast() {
    this.arrange([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    this.movesCount = 0;
    this.time = 0;
    this.gameService.clearMoves();
    this.resetTimer(false);
    this.storeState();
  }


  shuffle() {
    this.arrange( this.shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]) );
    // this.arrange([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0]);
    // this.arrange([1,0,3,4,5,2,6,8,9,11,7,12,13,10,14,15]);
    this.movesCount++;
  }

  arrange(arr) {
    for (let i = 0; i < 16; i++) {
      if ( arr[i] === 0 ) {
        this.blank.x = i % 4;
        this.blank.y = Math.floor(i / 4);
        continue;
      }
      this.blocks[ arr[i] - 1 ].x = i % 4;
      this.blocks[ arr[i] - 1 ].y = Math.floor(i / 4);
    }
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
