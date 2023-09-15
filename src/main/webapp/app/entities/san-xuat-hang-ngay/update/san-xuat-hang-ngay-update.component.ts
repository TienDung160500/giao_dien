import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IChiTietKichBan } from 'app/entities/chi-tiet-kich-ban/chi-tiet-kich-ban.model';
import { IThietBi } from 'app/entities/thiet-bi/thiet-bi.model';
import { Component, OnInit, Input } from '@angular/core';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ISanXuatHangNgay, SanXuatHangNgay } from '../san-xuat-hang-ngay.model';
import { SanXuatHangNgayService } from '../service/san-xuat-hang-ngay.service';

@Component({
  selector: 'jhi-san-xuat-hang-ngay-update',
  templateUrl: './san-xuat-hang-ngay-update.component.html',
  styleUrls: ['./san-xuat-hang-ngay-update.component.css'],
})
export class SanXuatHangNgayUpdateComponent implements OnInit {
  kichBanUrl = this.applicationConfigService.getEndpointFor('api/kich-ban/thong-so-kich-ban/ma-kich-ban');
  chiTietSanXuatUrl = this.applicationConfigService.getEndpointFor('api/san-xuat-hang-ngay/them-moi-thong-so-san-xuat');
  isSaving = false;
  predicate!: string;
  ascending!: boolean;
  i = 0;

  idSanXuatHangNgay?: number | null | undefined;

  sanXuatHangNgay: ISanXuatHangNgay[] = [];
  chiTietKichBan: IChiTietKichBan[] = [];

  selectedValues: string | null = null;
  selectedParameter: string | null = null;

  //--------------------------------------------- khoi tao input thong so kich ban
  @Input() idKichBan = '';
  @Input() maKichBan = '';
  @Input() thongSo = '';
  @Input() minValue = '';
  @Input() maxValue = '';
  @Input() trungBinh = '';
  @Input() donVi = '';
  @Input() phanLoai = '';
  //----------------------------------------- khoi tao input kich ban sản xuất hàng ngày
  @Input() maThietBi = '';
  @Input() loaiThietBi = '';
  @Input() maSanPham = '';
  @Input() versionSanPham = '';
  thietBisSharedCollection: IThietBi[] = [];
  // sanXuatHangNgay: ISanXuatHangNgay[] = [];
  // chiTietKichBan: IChiTietKichBan[] = [];

  listOfChiTietKichBan?: [
    {
      idSanXuatHangNgay: number ,
      maKichBan: string,
      thongSo: string,
      minValue: number,
      maxValue: number,
      trungBinh: number,
      donVi: string,
      phanLoai: string,
    },
  ];
  editForm = this.fb.group({
    id: [],
    maKichBan: [],
    maThietBi: [],
    loaiThietBi: [],
    dayChuyen: [],
    maSanPham: [],
    versionSanPham: [],
    ngayTao: [],
    timeUpdate: [],
    trangThai: [],
  });

  constructor(
    protected sanXuatHangNgayService: SanXuatHangNgayService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected applicationConfigService: ApplicationConfigService,
    protected http: HttpClient
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sanXuatHangNgay }) => {
      if (sanXuatHangNgay.id === undefined) {
        const today = dayjs().startOf('day');
        sanXuatHangNgay.ngayTao = today;
        sanXuatHangNgay.timeUpdate = today;
      }
      this.updateForm(sanXuatHangNgay);
    });
  }

  getChiTietKichBan(maKichBan: string): void {
    this.http.get<IChiTietKichBan>(`${this.kichBanUrl}/${maKichBan}`).subscribe(res => {
      this.listOfChiTietKichBan = res as any;
      console.log(this.listOfChiTietKichBan);
      console.log('res: ', res);
    });
  }

  trackId(_index: number, item: IChiTietKichBan): number {
    return item.id!;
  }

  previousState(): void {
    window.history.back();
  }

  trackThietBiById(_index: number, item: IThietBi): number {
    return item.id!;
  }

  save(): void {
    this.isSaving = true;
    const sanXuatHangNgay = this.createFromForm();
    if (sanXuatHangNgay.id !== undefined) {
      this.subscribeToSaveResponse(this.sanXuatHangNgayService.update(sanXuatHangNgay));
    } else {
      this.subscribeToSaveResponse(this.sanXuatHangNgayService.create(sanXuatHangNgay));
    }
  }

  onChangeValues(): void {
    console.log('Selected Values:', this.selectedValues);
  }

  onChangeParameter(): void {
    console.log('Selected Parameter:', this.selectedParameter);
  }
  saveChiTietSanXuat(): void {
    //------------ cập nhật kich_ban_id trong table chi tiết sản xuất -------------
    this.http.post<any>(this.chiTietSanXuatUrl, this.listOfChiTietKichBan).subscribe(res => {
      alert('thanh cong');
      this.previousState();
    });
    console.log(this.listOfChiTietKichBan);
  }

  subscribeToCreateResponse(result: Observable<HttpResponse<ISanXuatHangNgay>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(res => {
      console.log(res.body);
      // gán id kịch bản, mã kịch bản vào list chi tiết kịch bản request
      if (res.body?.id) {
        if (this.listOfChiTietKichBan) {
          for (let i = 0; i < this.listOfChiTietKichBan.length; i++) {
            this.listOfChiTietKichBan[i].idSanXuatHangNgay = res.body.id;
            this.listOfChiTietKichBan[i].maKichBan = this.maKichBan;
          }
        }
      }
      console.log('gan: ', this.listOfChiTietKichBan);
    });
  }

  subscribeToSaveResponse(result: Observable<HttpResponse<ISanXuatHangNgay>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  onSaveSuccess(): void {
    this.previousState();
  }

  onSaveError(): void {
    // Api for inheritance.
  }

  onSaveFinalize(): void {
    this.isSaving = false;
  }

  updateForm(sanXuatHangNgay: ISanXuatHangNgay): void {
    this.editForm.patchValue({
      id: sanXuatHangNgay.id,
      maKichBan: sanXuatHangNgay.maKichBan,
      maThietBi: sanXuatHangNgay.maThietBi,
      loaiThietBi: sanXuatHangNgay.loaiThietBi,
      dayChuyen: sanXuatHangNgay.dayChuyen,
      maSanPham: sanXuatHangNgay.maSanPham,
      versionSanPham: sanXuatHangNgay.versionSanPham,
      ngayTao: sanXuatHangNgay.ngayTao ? sanXuatHangNgay.ngayTao.format(DATE_TIME_FORMAT) : null,
      timeUpdate: sanXuatHangNgay.timeUpdate ? sanXuatHangNgay.timeUpdate.format(DATE_TIME_FORMAT) : null,
      trangThai: sanXuatHangNgay.trangThai,
    });
  }

  createFromForm(): ISanXuatHangNgay {
    return {
      ...new SanXuatHangNgay(),
      id: this.editForm.get(['id'])!.value,
      maKichBan: this.editForm.get(['maKichBan'])!.value,
      maThietBi: this.editForm.get(['maThietBi'])!.value,
      loaiThietBi: this.editForm.get(['loaiThietBi'])!.value,
      dayChuyen: this.editForm.get(['dayChuyen'])!.value,
      maSanPham: this.editForm.get(['maSanPham'])!.value,
      versionSanPham: this.editForm.get(['versionSanPham'])!.value,
      ngayTao: this.editForm.get(['ngayTao'])!.value ? dayjs(this.editForm.get(['ngayTao'])!.value, DATE_TIME_FORMAT) : undefined,
      timeUpdate: this.editForm.get(['timeUpdate'])!.value ? dayjs(this.editForm.get(['timeUpdate'])!.value, DATE_TIME_FORMAT) : undefined,
      trangThai: this.editForm.get(['trangThai'])!.value,
    };
  }

  addRowThongSoKichBan(): void {
  const newRow = {
    idSanXuatHangNgay:0,
      maKichBan: this.maKichBan,
      thongSo: '...',
      minValue: 0,
      maxValue: 0,
      trungBinh: 0,
      donVi: '...',
      phanLoai: '...'
  };
  if(this.listOfChiTietKichBan){
  this.listOfChiTietKichBan.push(newRow);
  console.log('add row', this.listOfChiTietKichBan);
  }
}

}