import { CARD_FACE_IMAGE_URL } from './../../app.constants';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CardHolderService } from 'src/app/services/card-holder.service';
import { map, takeUntil } from 'rxjs/operators';
import { Card } from 'src/app/card-face-model';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GameOverDialogComponent } from '../game-over-dialog/game-over-dialog.component';
import { STATE } from '../../app.constants';

@Component({
  selector: 'app-card-holder',
  templateUrl: './card-holder.component.html',
  styleUrls: ['./card-holder.component.css'],
  animations: [
    // animations when cards are switching between states
    trigger('flipCard', [
      state(`${STATE.default}`, style({
        transform: 'none',
      })),
      state(`${STATE.flipped}`, style({
        transform: 'perspective(600px) rotateY(180deg)'
      })),
      transition(`${STATE.default} => ${STATE.flipped}`, [
        animate('400ms')
      ]),
      transition(`${STATE.flipped} => ${STATE.default}`, [
        animate('400ms')
      ])
    ])
  ]
})
export class CardHolderComponent implements OnInit, OnDestroy {
  readonly CardFaceUrl = CARD_FACE_IMAGE_URL;

  /**
   * CardHolderComponet constructor
   * @param service as CardHolderService
   * @param modal bootstrap pop up modal
   */
  constructor(private service: CardHolderService, private modal: NgbModal) { }

  /**
   * Player 1 text
   */
  readonly player1 = 'Player 1';

  /**
   * Player 2 text
   */
  readonly player2 = 'Player 2';

  /**
   * Selected cards array - holding temporary 2 cards
   */
  selectedCards: Card[] = [];

  /**
   * All cards array - holds cards data after subcription
   */
  allCards: Card[] = [];

  /**
   * Finalise observable to unsubscribe other variable
   */
  finalise$ = new Subject();

  /**
   * Selected player after each tern
   */
  selectedPlayer = '';

  /**
   * First player score
   */
  player1Points = 0;

  /**
   * Second player score
   */
  player2Points = 0;

  /**
   * Cards ids those already flipped over
   */
  flippedCardIds = new Set();

  /**
   * Live hook for initialise component
   */
  ngOnInit(): void {

    /**
     * Initialise player
     */
    this.switchPlayer();

    /**
     * Face all cards data from server set the allCards data
     */
    this.service.getCardFaces().pipe(
      takeUntil(this.finalise$),
      map(data => data)
    ).subscribe(card => {
      this.allCards = this.initialiseCard(card);
    });
  }

  /**
   * Destory live hook
   */
  ngOnDestroy(): void {
    this.finalise$.next();
    this.finalise$.complete();
  }

  /**
   * Initialised cards on component load
   */
  private initialiseCard(data: Card[]): any {
    const duplicateCardsData: Card[] = [];
    data.forEach(d => {
     d.state = STATE.default;
     // Double up same card object
     duplicateCardsData.push({...d});
     duplicateCardsData.push({...d});
    });
    // Suffle cards
    return this.suffleData(duplicateCardsData);
  }

  /**
   * Suffle cards in random order
   * @param data - array
   * @return array
   */
  private suffleData(data: any[]): any[] {
    return data.map(a => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map(a => a[1]);
  }

  /**
   * Handle card click - after first card clicked, seletced fliiped and set the card state to flipped.
   * After second card slected compare 2 cards id and if matched then flipeed both of them othrwise
   * make fafe down both cards by setting the status to default.
   * @param indx any
   */
  cardClicked(indx: any): void {
    const selectedCard = this.allCards[indx] ;
    if( this.flippedCardIds.has(selectedCard.id) ) { return; }
    if (selectedCard.state === STATE.default && this.selectedCards.length < 2) {
      this.selectedCards.push(selectedCard);
      selectedCard.state = STATE.flipped;
      if (this.selectedCards.length === 2) {
        this.checkCardMatch();
      }
    } else if (selectedCard.state === STATE.flipped) {
      selectedCard.state = STATE.default;
      this.selectedCards.pop();
    }
  }


  /**
   * Check the cards are matched after selected two cards
   */
  checkCardMatch(): void {
    setTimeout(() => {
      const firstSelectedCard = this.selectedCards[0];
      const secondSelectedCard = this.selectedCards[1];
      const nextState = firstSelectedCard.id === secondSelectedCard.id ? STATE.flipped : STATE.default;
      firstSelectedCard.state = secondSelectedCard.state = nextState;

      // When both cards matched then empty the slected cards array to insert new selected cards
      this.selectedCards = [];

      // If two crds id are same then update the player score and if all cards are flipped
      // then pop up modal fo restart the game
      if (nextState === STATE.flipped) {
        this.updateScore();
        this.flippedCardIds.add(firstSelectedCard.id);
        if (this.flippedCardIds?.size === this.allCards?.length / 2) {
          this.openGemeOverDailog();
        }
      }

      // Swtich palyer
      this.switchPlayer();
    }, 50);
  }

  /**
   * Switching between players after each tern
   */
  private switchPlayer(): void {
    let switchedPlayer = '';
    if (this.selectedPlayer === this.player1) {
      switchedPlayer = this.player2;
    } else {
      switchedPlayer = this.player1;
    }
    this.selectedPlayer = switchedPlayer;
  }

  /**
   * Open dialog aftef all cards flipped
   */
  openGemeOverDailog(): void {
    const wonPlayer = this.player1Points > this.player2Points ? this.player1 : this.player2;
    const wonPoints = this.player1Points > this.player2Points ? this.player1Points : this.player2Points;
    const modalRef = this.modal.open(GameOverDialogComponent,
      { backdrop: 'static', size: 'lg', keyboard: false, centered: true });
    modalRef.componentInstance.heading = `Congratulation ${wonPlayer}!`;
    modalRef.componentInstance.bodyText = ` You have won the game. Your score is ${wonPoints}`;
    modalRef.componentInstance.yesButtonText = 'Start over';

   // Restart the game
    modalRef.result.then(data => {
      this.flippedCardIds.clear();
      this.resetScore();
      this.ngOnInit();
    });
  }

  /**
   * Update player scores
   */
  updateScore(): void {
    if (this.selectedPlayer === this.player1) {
      this.player1Points++;
    } else if (this.selectedPlayer === this.player2) {
      this.player2Points++;
    }
  }

  /**
   * Reset all scores
   */
  private resetScore(): void {
    this.player1Points = this.player2Points = 0;
  }
}
