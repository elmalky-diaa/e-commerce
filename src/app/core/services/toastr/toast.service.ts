import { inject, Service } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Service()
export class ToastService {
  private readonly toastrService = inject(ToastrService);

  success(msg: string) {
    this.toastrService.success(msg);
  }

  error(msg: string) {
    this.toastrService.error(msg);
  }
}
