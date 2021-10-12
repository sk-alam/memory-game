import { LoadingService } from './../../services/loading.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent {

  /**
   * Loading componet for page loading spinner
   * @param loadingService as LoadingService
   */
  constructor(private loadingService: LoadingService) { }

  /**
   * Laoding indicator observable
   */
  loading$ = this.loadingService.loading$;

}
