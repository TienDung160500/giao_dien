import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IKichBan } from '../kich-ban.model';

@Component({
  selector: 'jhi-kich-ban-detail',
  templateUrl: './kich-ban-detail.component.html',
})
export class KichBanDetailComponent implements OnInit {
  predicate!: string;
  ascending!: boolean;
  kichBan: IKichBan | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ kichBan }) => {
      this.kichBan = kichBan;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
