import { PuzzlegamePage } from './app.po';

describe('puzzlegame App', () => {
  let page: PuzzlegamePage;

  beforeEach(() => {
    page = new PuzzlegamePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
