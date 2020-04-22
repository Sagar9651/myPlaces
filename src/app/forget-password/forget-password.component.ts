import { ToastrService } from 'ngx-toastr';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  constructor(private auhtService: AuthService, private route: ActivatedRoute, private toastr: ToastrService) { }

  code: any;
  password: any;
  confirmPassword: any;
  ngOnInit(): void {
    // get code for Password reset
    this.code = this.route.snapshot.queryParams['oobCode'];
  }

  /**
   * Password Reset
   */
  confirmPasswordReset() {
    if (this.password == this.confirmPassword) {
      this.auhtService.confirmPasswordReset(this.code, this.password);
    } else {
      this.password = '';
      this.confirmPassword = '';
      this.toastr.error('Password Not Matched, Please Enter again');
    }
  }

}
