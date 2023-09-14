import { IThongSoMay } from 'app/entities/thong-so-may/thong-so-may.model';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Component, Input, OnInit } from '@angular/core';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IThietBi, ThietBi } from '../thiet-bi.model';
import { ThietBiService } from '../service/thiet-bi.service';

@Component({
  selector: 'jhi-thiet-bi-update',
  templateUrl: './thiet-bi-update.component.html',
  styleUrls: ['./thiet-bi-update.component.css'],
})
export class ThietBiUpdateComponent implements OnInit {
  resourceUrl = this.applicationConfigService.getEndpointFor('api/thiet-bi/cap-nhat');
  resourceUrlAdd = this.applicationConfigService.getEndpointFor('api/thiet-bi/them-moi-thong-so-thiet-bi');
  predicate!: string;
  ascending!: boolean;
  isSaving = false;

  i = 0;
  editId: number | null = null;

  selectedStatus: string | null = null;
  selectedStatusAdd: string | null = null;
  // --------------------- khai bao input
  @Input() id = '';
  @Input() status = '';
  @Input() moTa = '.';
  @Input() thongSo = '.';
  @Input() phanLoai = '.';
  @Input() maThietBi = '';
  @Input() loaiThietBi = '';
  // khai bao bien luu thong tin idThietBi
  idThietBi?: number |null |undefined

  thietBisSharedCollection: IThietBi[] = [];

  searchResults?: IThietBi |null |undefined;

  form: FormGroup;
  listOfThietBi = [
    {
      idThietBi:this.idThietBi,
      thongSo: '.',
      moTa: '',
      status: this.selectedStatusAdd,
      phanLoai: '.',
      maThietBi: this.maThietBi,
      loaiThietBi: this.loaiThietBi,
    },
  ];
  
  editForm = this.fb.group({
    id: [],
    maThietBi: [],
    loaiThietBi: [],
    dayChuyen: [],
    ngayTao: [],
    timeUpdate: [],
    updateBy: [],
    status: [],
  });

  constructor(
    protected thietBiService: ThietBiService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService
  ) {
    this.form = this.fb.group({
      maThietBi: ['', Validators.required],
      loaiThietBi: ['', Validators.required],
      updateBy: ['', Validators.required],
      trangThai: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ thietBi }) => {
      if (thietBi.id === undefined) {
        const today = dayjs().startOf('day');
        thietBi.ngayTao = today;
        thietBi.timeUpdate = today;
      }

      this.updateForm(thietBi);
    });
  }

  onChangeSearch(): void {
    console.log('Selected Status:', this.selectedStatus);
  }

  onChangeStatus(): void {
    console.log('Selected StatusAdd:', this.selectedStatusAdd);
  }

  trackId(_index: number, item: IThietBi): number {
    return item.id!;
  }

  previousState(): void {
    window.history.back();
  }

  trackThietBiById(_index: number, item: IThietBi): number {
    return item.id!;
  }

  save(): void {
    // console.log("ma thiet bi", this.maThietBi);
    // console.log("loai thiet bi", this.loaiThietBi);
    this.listOfThietBi[0].maThietBi= this.maThietBi;
    this.listOfThietBi[0].loaiThietBi= this.loaiThietBi;
    this.isSaving = true;
    const thietBi = this.createFromForm();
    if (thietBi.id !== undefined) {
      this.subscribeToSaveResponse(this.thietBiService.update(thietBi));
    } else {
      this.subscribeToCreateResponse(this.thietBiService.create(thietBi));
    }
  }

  saveThongSoThietBi(): void {
    // console.log(this.listOfThietBi);
    this.http.post<any>(this.resourceUrlAdd,this.listOfThietBi).subscribe(res => {
      console.log("res", res)
      console.log('save', this.listOfThietBi);
      this.previousState();
    });
  }

  subscribeToSaveResponse(result: Observable<HttpResponse<IThietBi>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }
  subscribeToCreateResponse(result: Observable<HttpResponse<IThietBi>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe((res) =>(
      // luu thong tin id thiet bi
      this.idThietBi = res.body?.id,
      this.listOfThietBi[0].idThietBi = this.idThietBi
      // console.log('response: ',this.listOfThietBi)  
    ));
  }

  onSaveSuccess(): void {
    this.previousState
  }

  onSaveError(): void {
    // Api for inheritance.
  }

  onSaveFinalize(): void {
    this.isSaving = false;
  }

  updateForm(thietBi: IThietBi): void {
    this.editForm.patchValue({
      id: thietBi.id,
      maThietBi: thietBi.maThietBi,
      loaiThietBi: thietBi.loaiThietBi,
      dayChuyen: thietBi.dayChuyen,
      ngayTao: thietBi.ngayTao ? thietBi.ngayTao.format(DATE_TIME_FORMAT) : null,
      timeUpdate: thietBi.timeUpdate ? thietBi.timeUpdate.format(DATE_TIME_FORMAT) : null,
      updateBy: thietBi.updateBy,
      status: thietBi.status,
    });
  }

  createFromForm(): IThietBi {
    return {
      ...new ThietBi(),
      id: this.editForm.get(['id'])!.value,
      maThietBi: this.editForm.get(['maThietBi'])!.value,
      loaiThietBi: this.editForm.get(['loaiThietBi'])!.value,
      dayChuyen: this.editForm.get(['dayChuyen'])!.value,
      ngayTao: this.editForm.get(['ngayTao'])!.value ? dayjs(this.editForm.get(['ngayTao'])!.value, DATE_TIME_FORMAT) : undefined,
      timeUpdate: this.editForm.get(['timeUpdate'])!.value ? dayjs(this.editForm.get(['timeUpdate'])!.value, DATE_TIME_FORMAT) : undefined,
      updateBy: this.editForm.get(['updateBy'])!.value,
      status: this.editForm.get(['status'])!.value,
    };
  }

  startEdit2(id: number): void {
    this.editId = id;
  }

  stopEdit(): void {
    if (this.editId !== null) {
      this.http.post<any>(this.resourceUrl, this.listOfThietBi[this.editId + 1]).subscribe(
        response => {
          console.log('update thanh cong', response);
        },
        error => {
          console.error('update fail', error);
        }
      );
      this.editId = null;
    }
    this.editId = null;
  }

  addRow(): void {
    const newRow = {
      idThietBi: this.idThietBi,
      thongSo: '.',
      moTa: '',
      phanLoai: '.',
      status: this.selectedStatusAdd,
      maThietBi: this.maThietBi,
      loaiThietBi: this.loaiThietBi,
    };

    this.listOfThietBi = [...this.listOfThietBi, newRow];
    console.log('add row', this.listOfThietBi);
    this.i++;
  }

  // sua lai xoa theo stt va ma thong so (id )
  // deleteRow(id: string): void {
  //   this.listOfThietBi = this.listOfThietBi.filter(d => d.id !== this.id && d.idThongSo !== this.idThongSo);
  // }
}
