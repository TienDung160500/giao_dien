import { IChiTietKichBan } from 'app/entities/chi-tiet-kich-ban/chi-tiet-kich-ban.model';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IThietBi } from 'app/entities/thiet-bi/thiet-bi.model';
import { Component, OnInit, Input } from '@angular/core';
import { HttpResponse, HttpClient } from '@angular/common/http';
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
  //------------------- url lay danh sach thong so theo ma thiet bi --------------------
  thietBiUrl = this.applicationConfigService.getEndpointFor('api/thiet-bi/danh-sach-thong-so-thiet-bi');
  // ----------------- url luu thong so kich ban theo ma thiet bi -----------------------
  chiTietKichBanUrl = this.applicationConfigService.getEndpointFor('api/kich-ban/them-moi-thong-so-kich-ban');

  isSaving = false;
  predicate!: string;
  ascending!: boolean;

  i = 0;

  editId: number | null = null;
  //--------------------------------------------- khoi tao input thong so kich ban
  @Input() idKichBan = '';
  @Input() maKichBan = '';
  @Input() thongSo = '';
  @Input() minValue = 0;
  @Input() maxValue = 0;
  @Input() trungBinh = 0;
  @Input() donVi = '';
  @Input() phanLoai = '';
  //----------------------------------------- khoi tao input kich ban
  @Input() maThietBi = '';
  @Input() loaiThietBi = '';
  @Input() maSanPham = '';
  @Input() versionSanPham = '';

  thietBisSharedCollection: IThietBi[] = [];
  kichBansSharedCollection: IKichBan[] = [];

  selectedValues: string | null = null;
  selectedParameter: string | null = null;

  form!: FormGroup;

  listOfChiTietKichBan: {
    idKichBan: number;
    maKichBan: string;
    thongSo: string | null | undefined;
    minValue: number;
    maxValue: number;
    trungBinh: number;
    donVi: string;
    phanLoai: string;
  }[] = [];
 
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

  constructor(
    protected kichBanService: KichBanService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService
  ) {
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

  //---------------------------- luu thong so kich ban chi tiet ---------------------------
  saveChiTietKichBan(): void {
    console.log(this.listOfChiTietKichBan);
    // //------------ cập nhật kich_ban_id trong table chi tiết kịch bản -------------
    // this.http.post<any>(this.chiTietKichBanUrl,this.listOfChiTietKichBan).subscribe(res=>{
    //   alert('thanh cong');
    //   this.previousState();
    // })
    // console.log(this.listOfChiTietKichBan);
  }

  // lấy id kịch bản
  subscribeToCreateResponse(result: Observable<HttpResponse<IKichBan>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(res => {
      console.log(res.body);
      // gán id kịch bản, mã kịch bản vào list chi tiết kịch bản request
      if (res.body?.id) {
        for (let i = 0; i < this.listOfChiTietKichBan.length; i++) {
          this.listOfChiTietKichBan[i].idKichBan = res.body.id;
          this.listOfChiTietKichBan[i].maKichBan = this.maKichBan;
        }
      }
      console.log('gan: ', this.listOfChiTietKichBan);
    });
  }

  subscribeToSaveResponse(result: Observable<HttpResponse<IKichBan>>): void {
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

  updateForm(kichBan: IKichBan): void {
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

  trackId(_index: number, item: IChiTietKichBan): number {
    return item.id!;
  }

  createFromForm(): IKichBan {
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

  //------------------------------ lay thong tin thiet bi thong qua ma thiet bi va loai thiet bi ------------------------------
  getThietBi(maThietBi: string): void {
    this.http.get<IChiTietKichBan[]>(`${this.thietBiUrl}/${maThietBi}`).subscribe((res: IChiTietKichBan[]) => {
      // khoi tao danh sach
      for (let i = 0; i < res.length; i++) {
        const newRows: {
          idKichBan: number;
          maKichBan: string;
          thongSo: string | null | undefined;
          minValue: number;
          maxValue: number;
          trungBinh: number;
          donVi: string;
          phanLoai: string;
        } = {
          idKichBan: 0,
          maKichBan: '',
          thongSo: '',
          minValue: 0,
          maxValue: 0,
          trungBinh: 0,
          donVi: '...',
          phanLoai: '...',
        };
        this.listOfChiTietKichBan.push(newRows);
        this.listOfChiTietKichBan[i].thongSo = res[i].thongSo;
      }
      //gan ten thong so cho danh sach
      // for(let i = 0; i< this.listOfChiTietKichBan.length;i++){
      //   this.listOfChiTietKichBan[i].thongSo = res[i].thongSo
      //   console.log(`list:${i} `,this.listOfChiTietKichBan[i].thongSo,` - res: ${i} `,res[i].thongSo)
      // }
    });
  }

  //----------------------------------------- them moi chi tiet kich ban --------------------------

  startEdit2(id: number): void {
    this.editId = id;
  }

  addRowThongSoKichBan(): void {
    const newRow = {
      idKichBan: 0,
      maKichBan: this.maKichBan,
      thongSo: '',
      minValue: 0,
      maxValue: 0,
      trungBinh: 0,
      donVi: '...',
      phanLoai: '...',
    };
    this.listOfChiTietKichBan.push(newRow);
    console.log('add row', this.listOfChiTietKichBan);
  }
}
