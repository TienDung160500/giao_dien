import { IChiTietSanXuat } from 'app/entities/chi-tiet-san-xuat/chi-tiet-san-xuat.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISanXuatHangNgay } from '../san-xuat-hang-ngay.model';

@Component({
  selector: 'jhi-san-xuat-hang-ngay-detail',
  templateUrl: './san-xuat-hang-ngay-detail.component.html',
})
export class SanXuatHangNgayDetailComponent implements OnInit {
  predicate!: string;
  ascending!: boolean;
  sanXuatHangNgay: ISanXuatHangNgay | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sanXuatHangNgay }) => {
      this.sanXuatHangNgay = sanXuatHangNgay;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
