import { Block } from './../block.class';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.css']
})
export class BlockComponent implements OnInit {

  @Input()
  block: Block;

  constructor() { }

  ngOnInit() {
  }

}
