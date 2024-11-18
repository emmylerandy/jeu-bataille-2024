import { CardGame } from './cardGame';

describe('CardGame', () => {
  let cardGame: CardGame;

  beforeEach(() => {
    cardGame = new CardGame();
  });

  it('should initialize with 52 cards and distribute 26 cards to each player', () => {
    expect(cardGame.allCards.length).toBe(52);
    expect(cardGame.player1Cards.length).toBe(26);
    expect(cardGame.player2Cards.length).toBe(26);
  });

  it('should shuffle cards randomly', () => {
    const initialOrder = Array.from({ length: 52 }, (_, i) => i + 1);
    expect(cardGame.allCards).not.toEqual(initialOrder); 
  });

  it('should play a card for player 1 when calling playCard(1)', () => {
    const initialLength = cardGame.player1Cards.length;
    cardGame.playCard(1);

    expect(cardGame.currentCardP1).toBeDefined();
    expect(cardGame.player1Cards.length).toBe(initialLength - 1);
  });

  it('should play a card for player 2 when calling playCard(2)', () => {
    const initialLength = cardGame.player2Cards.length;
    cardGame.playCard(2);

    expect(cardGame.currentCardP2).toBeDefined();
    expect(cardGame.player2Cards.length).toBe(initialLength - 2);
  });

  it('should play a round and update score of player 1 if the card of player 1 is superior', ()=>{
    cardGame.currentCardP1 = 5;
    cardGame.currentCardP2 = 2;

    const result = cardGame.playRound();
    expect(result).toEqual(1);
    expect(cardGame.scorePlayer1).toBe(1);
    expect(cardGame.scorePlayer2).toBe(0);
  });

  it('should play a round and update score of player 2 if the card of player 2 is superior', ()=>{
    cardGame.currentCardP1 = 3;
    cardGame.currentCardP2 = 15;

    const result = cardGame.playRound();
    expect(result).toEqual(2);
    expect(cardGame.scorePlayer1).toBe(0);
    expect(cardGame.scorePlayer2).toBe(1);
  });

  it('should return true if players still have cards', () => {
    expect(cardGame.playersStillGotCard()).toBe(true);
  });

  it('should return false if player 1 has no cards left', () => {
    cardGame.player1Cards = [];
    expect(cardGame.playersStillGotCard()).toBe(false);
  });

});