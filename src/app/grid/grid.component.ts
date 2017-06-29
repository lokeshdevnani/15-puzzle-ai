import { Block } from './../block.class';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {

  blocks: Array<Block>;
  blank: Block;
  movesCount: number;
  time: number;


  constructor() {
    let i;
    this.blocks = new Array<Block>();
    for (i = 0; i < 15; i++) {
      this.blocks.push(new Block(i + 1, i % 4, Math.floor(i / 4) ));
    }
    this.blank = new Block(0, 3, 3);
    this.time = 0;

    this.shuffle();
   }

  ngOnInit() {
  }

  click(block: Block) {
    console.log(block);
    const xdiff = Math.abs(block.x - this.blank.x),
        ydiff = Math.abs(block.y - this.blank.y);

    if ( xdiff + ydiff === 1 ) {
      [block.x, block.y, this.blank.x, this.blank.y] = [this.blank.x, this.blank.y, block.x, block.y];
      this.movesCount++;
    }
  }

  solve() {
    this.arrange([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
  }


  shuffle() {
    this.arrange( this.shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]) );
  }

  arrange(arr) {
    for (let i = 0; i < 15; i++) {
      this.blocks[i].x = arr[i] % 4;
      this.blocks[i].y = Math.floor(arr[i] / 4);
    }
    this.blank.x = arr[15] % 4;
    this.blank.y = Math.floor(arr[15] / 4);
    this.movesCount = 0;
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
