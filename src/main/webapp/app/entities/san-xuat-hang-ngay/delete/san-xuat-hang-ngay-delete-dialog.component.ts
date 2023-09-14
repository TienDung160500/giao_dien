import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISanXuatHangNgay } from '../san-xuat-hang-ngay.model';
import { SanXuatHangNgayService } from '../service/san-xuat-hang-ngay.service';

@Component({
  templateUrl: './san-xuat-hang-ngay-delete-dialog.component.html',
})
export class SanXuatHangNgayDeleteDialogComponent {
  sanXuatHangNgay?: ISanXuatHangNgay;

  constructor(protected sanXuatHangNgayService: SanXuatHangNgayService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.sanXuatHangNgayService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
