import { IChiTietKichBan } from 'app/entities/chi-tiet-kich-ban/chi-tiet-kich-ban.model';
import { IThietBi } from 'app/entities/thiet-bi/thiet-bi.model';
import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
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
  isSaving = false;
  predicate!: string;
  ascending!: boolean;
  i = 0;

  idSanXuatHangNgay?: number | null | undefined;

  thietBisSharedCollection: IThietBi[] = [];
  sanXuatHangNgay: ISanXuatHangNgay[] = [];
  chiTietKichBan: IChiTietKichBan[] = [];

  selectedValues: string | null = null;
  selectedParameter: string | null = null;

  listOfThongSo = [
    {
      idSanXuatHangNgay: this.idSanXuatHangNgay,
      thongSo: '.',
      Min: '',
      Max: '.',
      trungBinh: '.',
      donVi: this.selectedValues,
      phanLoai: this.selectedParameter,
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

  editFormSXHN = this.fb.group({
    id: [],
    maKichBan: [],
    hangMkb: [],
    thongSo: [],
    minValue: [],
    maxValue: [],
    trungbinh: [],
    donVi: [],
    phanLoai: [],
    kichBan: [],
  });

  constructor(
    protected sanXuatHangNgayService: SanXuatHangNgayService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
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

  addRow(): void {
    const newRow = {
      idSanXuatHangNgay: this.idSanXuatHangNgay,
      thongSo: '.',
      Min: '.',
      Max: '.',
      trungBinh: '.',
      donVi: this.selectedValues,
      phanLoai: this.selectedParameter,
    };

    this.listOfThongSo = [...this.listOfThongSo, newRow];
    console.log('add row', this.listOfThongSo);
    this.i++;
  }

  onChangeValues(): void {
    console.log('Selected Values:', this.selectedValues);
  }

  onChangeParameter(): void {
    console.log('Selected Parameter:', this.selectedParameter);
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISanXuatHangNgay>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(sanXuatHangNgay: ISanXuatHangNgay): void {
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

  protected createFromForm(): ISanXuatHangNgay {
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
}
