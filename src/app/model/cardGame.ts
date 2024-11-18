export class CardGame {
    allCards: number[] = [];
    player1Cards: number[]= [];
    player2Cards: number[]= [];
    currentCardP1: number |undefined;
    currentCardP2: number |undefined;
    scorePlayer1: number = 0;
    scorePlayer2: number = 0;

    
    constructor(){
        this.initialize();
    }
    
    initialize(): void {
        this.allCards = Array.from({length: 52 }, (_, i) => i + 1);
        this.shuffleAndDistribute();
    }

    private shuffleAndDistribute(): void {
        for (let i = this.allCards.length - 1; i > 0; i--) { 
            const j = Math.floor(Math.random() * (i + 1)); 
            [this.allCards[i], this.allCards[j]] = [this.allCards[j], this.allCards[i]]; 
        }
        this.player1Cards = this.allCards.slice(0,26);
        this.player2Cards = this.allCards.slice(26);
    }

    playCard(numPlayer:number) : void {
        if (numPlayer == 1){
            this.currentCardP1 = this.player1Cards.shift() ?? 0;
        }else {
            this.currentCardP2 = this.player2Cards.shift() ?? 0;
        }
    }

    playRound() : number{
        if(this.currentCardP1 && this.currentCardP2){
            if(this.currentCardP1  > this.currentCardP2){
                this.scorePlayer1++;
                return 1;
            }else {
                this.scorePlayer2++;
                return 2;
            }
        }else{
            return 0;
        }
    }

    playersStillGotCard() : boolean {
        return this.player1Cards.length > 0;
    }
}