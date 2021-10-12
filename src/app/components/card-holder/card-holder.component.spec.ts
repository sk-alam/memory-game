import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModal, NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GameOverDialogComponent } from '../game-over-dialog/game-over-dialog.component';

import { CardHolderComponent } from './card-holder.component';

describe('CardHolderComponent', () => {
  let component: CardHolderComponent;
  let fixture: ComponentFixture<CardHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardHolderComponent, GameOverDialogComponent ],
      imports: [
        NgbModule,
        HttpClientTestingModule
      ],
      providers: [
        NgbActiveModal,
        NgbModal
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
