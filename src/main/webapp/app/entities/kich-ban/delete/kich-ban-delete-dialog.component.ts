import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IKichBan } from '../kich-ban.model';
import { KichBanService } from '../service/kich-ban.service';

@Component({
  templateUrl: './kich-ban-delete-dialog.component.html',
})
export class KichBanDeleteDialogComponent {
  kichBan?: IKichBan;

  constructor(protected kichBanService: KichBanService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.kichBanService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
