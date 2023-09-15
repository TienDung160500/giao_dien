import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IKichBan } from '../kich-ban.model';
import { KichBanService } from '../service/kich-ban.service';

@Component({
  templateUrl: './kich-ban-delete-dialog.component.html',
})
export class KichBanDeleteDialogComponent {
  kichBan?: IKichBan;
  resourceUrlAdd = this.applicationConfigService.getEndpointFor('api/kich-ban/del-kich-ban');

  constructor(
    protected kichBanService: KichBanService,
    protected activeModal: NgbActiveModal,
    protected applicationConfigService: ApplicationConfigService,
    protected http: HttpClient
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.http.delete(`${this.resourceUrlAdd}/${id}`).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
