import { IChiTietSanXuat } from 'app/entities/chi-tiet-san-xuat/chi-tiet-san-xuat.model';
import { ISanXuatHangNgay } from 'app/entities/san-xuat-hang-ngay/san-xuat-hang-ngay.model';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'jhi-san-xuat-hang-ngay-detail',
  templateUrl: './san-xuat-hang-ngay-detail.component.html',
})
export class SanXuatHangNgayDetailComponent implements OnInit {
  predicate!: string;
  ascending!: boolean;
  sanXuatHangNgay: ISanXuatHangNgay | null = null;
  chiTietSanXuats: IChiTietSanXuat | null = null;
  resourceUrl = this.applicationConfigService.getEndpointFor('api/kich-ban/thong-so-kich-ban');

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected applicationConfigService: ApplicationConfigService,
    protected http: HttpClient
  ) {}

  ngOnInit(): void {
     this.activatedRoute.data.subscribe(({ sanXuatHangNgay }) => {
       this.sanXuatHangNgay = sanXuatHangNgay;
       console.log('sxhn: ', this.sanXuatHangNgay);
     });
     // lay thong tin thong so thiet bi
     if (this.sanXuatHangNgay?.id) {
       this.http.get<any>(`${this.resourceUrl}/${this.sanXuatHangNgay.id}`).subscribe(res => {
         this.chiTietSanXuats = res;
         console.log('res :', res);
         console.log('chi tiet san xuat :', this.chiTietSanXuats);
       });
     }
  }
  previousState(): void {
    window.history.back();
  }
}
