import { TestBed } from '@angular/core/testing';

import { CardHolderService } from './card-holder.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe('CardHolderService', () => {
  let service: CardHolderService;
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CardHolderService]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CardHolderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
