import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-game-over-dialog',
  templateUrl: './game-over-dialog.component.html',
  styleUrls: ['./game-over-dialog.component.css']
})
export class GameOverDialogComponent {

  /**
   * Modal heading input
   */
  @Input() heading = 'Congratulation!';

  /**
   * Modal body text input
   */
  @Input() bodyText = 'You have won the game.';

  /**
   * Positive button text input for modal
   */
  @Input() yesButtonText = 'Yes';

  /**
   * Close button text input fof modal
   */
  @Input() noButtonText = 'Close';


  /**
   * Modal constructor
   * @param activeModal as NbgActiveModal
   */
  constructor(public activeModal: NgbActiveModal) { }

}
