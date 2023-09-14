import { IThietBi } from 'app/entities/thiet-bi/thiet-bi.model';
import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IKichBan, KichBan } from '../kich-ban.model';
import { KichBanService } from '../service/kich-ban.service';

@Component({
  selector: 'jhi-kich-ban-update',
  templateUrl: './kich-ban-update.component.html',
  styleUrls: ['./kich-ban-update.component.css'],
})
export class KichBanUpdateComponent implements OnInit {
  isSaving = false;
  predicate!: string;
  ascending!: boolean;

  idThongSoKichBan?: number | null | undefined;
  i = 0;

  thietBisSharedCollection: IThietBi[] = [];
  kichBansSharedCollection: IKichBan[] = [];

  selectedValues: string | null = null;
  selectedParameter: string | null = null;

  form!: FormGroup;

  listOfThongSo = [
    {
      idThongSoKichBan: this.idThongSoKichBan,
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
    updateBy: [],
    trangThai: [],
  });

  constructor(protected kichBanService: KichBanService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {
    this.form = this.fb.group({
      maKichBan: null,
      tenKichBan: null,
      maThietBi: null,
      loaiThietBi: null,
      maSanPham: null,
      verSanPham: null,
    });
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ kichBan }) => {
      if (kichBan.id === undefined) {
        const today = dayjs().startOf('day');
        kichBan.ngayTao = today;
        kichBan.timeUpdate = today;
      }

      this.updateForm(kichBan);
    });
  }

  addRow(): void {
    const newRow = {
      idThongSoKichBan: this.idThongSoKichBan,
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
    console.log('Selected Status:', this.selectedValues);
  }

  onChangeParameter(): void {
    console.log('Selected Parameter:', this.selectedParameter);
  }

  onMaKichBanChange(): void {
    const selectedMaKichBan = this.form.get('maKichBan')?.value;
    console.log(selectedMaKichBan);

    const selectedThietBi = this.kichBansSharedCollection.find(item => item.id === selectedMaKichBan);
    console.log(selectedThietBi);

    if (selectedThietBi) {
      // Cập nhật các giá trị khác trong form
      this.form.patchValue({
        maThietBi: selectedThietBi.maThietBi,
        loaiThietBi: selectedThietBi.loaiThietBi,
        maSanPham: selectedThietBi.maSanPham,
        versionSanPham: selectedThietBi.versionSanPham,
      });
    } else {
      this.form.patchValue({
        maThietBi: null,
        loaiThietBi: null,
        maSanPham: null,
        versionSanPham: null,
      });
    }
  }

  previousState(): void {
    window.history.back();
  }

  trackThietBiById(_index: number, item: IThietBi): number {
    return item.id!;
  }

  save(): void {
    this.isSaving = true;
    const kichBan = this.createFromForm();
    if (kichBan.id !== undefined) {
      this.subscribeToSaveResponse(this.kichBanService.update(kichBan));
    } else {
      this.subscribeToSaveResponse(this.kichBanService.create(kichBan));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IKichBan>>): void {
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

  protected updateForm(kichBan: IKichBan): void {
    this.editForm.patchValue({
      id: kichBan.id,
      maKichBan: kichBan.maKichBan,
      maThietBi: kichBan.maThietBi,
      loaiThietBi: kichBan.loaiThietBi,
      dayChuyen: kichBan.dayChuyen,
      maSanPham: kichBan.maSanPham,
      versionSanPham: kichBan.versionSanPham,
      ngayTao: kichBan.ngayTao ? kichBan.ngayTao.format(DATE_TIME_FORMAT) : null,
      timeUpdate: kichBan.timeUpdate ? kichBan.timeUpdate.format(DATE_TIME_FORMAT) : null,
      updateBy: kichBan.updateBy,
      trangThai: kichBan.trangThai,
    });
  }

  protected createFromForm(): IKichBan {
    return {
      ...new KichBan(),
      id: this.editForm.get(['id'])!.value,
      maKichBan: this.editForm.get(['maKichBan'])!.value,
      maThietBi: this.editForm.get(['maThietBi'])!.value,
      loaiThietBi: this.editForm.get(['loaiThietBi'])!.value,
      dayChuyen: this.editForm.get(['dayChuyen'])!.value,
      maSanPham: this.editForm.get(['maSanPham'])!.value,
      versionSanPham: this.editForm.get(['versionSanPham'])!.value,
      ngayTao: this.editForm.get(['ngayTao'])!.value ? dayjs(this.editForm.get(['ngayTao'])!.value, DATE_TIME_FORMAT) : undefined,
      timeUpdate: this.editForm.get(['timeUpdate'])!.value ? dayjs(this.editForm.get(['timeUpdate'])!.value, DATE_TIME_FORMAT) : undefined,
      updateBy: this.editForm.get(['updateBy'])!.value,
      trangThai: this.editForm.get(['trangThai'])!.value,
    };
  }
}
