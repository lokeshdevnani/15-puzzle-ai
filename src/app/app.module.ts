import { GameService } from './game.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GridComponent } from './grid/grid.component';
import { BlockComponent } from './block/block.component';
import { MovesListComponent } from './moves-list/moves-list.component';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    BlockComponent,
    MovesListComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [GameService],
  bootstrap: [AppComponent]
})
export class AppModule { }
