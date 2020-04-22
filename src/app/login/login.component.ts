import { UserService } from './../user.service';
import { Router } from '@angular/router';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../alert.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  Login: any = {};
  signUpObj: any = {};
  socialAccount: string;
  emailID: any;
  errorMessage: any;
  constructor(private modalService: NgbModal, private authService: AuthService, private router: Router,
              private alertService: AlertService, private toastr: ToastrService, private userService: UserService) { }

  ngOnInit(): void {
  }

  /**
   * Open Registration Modal
   */
  signUp(registration) {
    this.modalService.open(registration, { centered: true, backdrop: 'static' });
  }

  /**
   *  User Login functionality
   */
  login() {
    let value = { email: '', password: '' };
    value.email = this.Login.emailId;
    value.password = this.Login.password;
    this.authService.login(value)
      .then(res => {
        this.toastr.success('Login Successfully');
        this.router.navigate(['default-layout/home']);
      }, err => {
        this.toastr.error('Please Enter Valid Email ID and Password');
        this.errorMessage = err.message;
      });
  }

  socialMediaLogin(socialAcc) {
    if (socialAcc === 'Google') {
      this.authService.signInWithGoogle().then(res => {
        if (res != null) {
          this.isLoggedIn();
        }
      });
    } else if (socialAcc === 'Facebook') {
      this.authService.doFacebookLogin().then(res => {
        if (res != null) {
          this.isLoggedIn();
        }
      });
    } else {
      this.toastr.info('This functionality is under development, Please try after some time');
    }
  }

  /**
   * User Registration Functionality
   */
  registerUser() {
    if (this.signUpObj.password.length < 6) {
      let value = { firstName: '', lastName: '', email: '', password: '' };
      value.email = this.signUpObj.emailId;
      value.password = this.signUpObj.password;
      this.authService.register(value)
        .then(res => {
          this.toastr.success('Registration Successfull,Please Login');
          this.modalService.dismissAll();
        }, err => {
          this.toastr.error(err);
        });
    } else {
      this.toastr.error('Password Length must be 6 digit');
    }
  }

  /**
   * Forget Password Modal (email) open
   */
  forgetPasswordPopUp(forgetPass) {
    this.modalService.open(forgetPass, { centered: true, backdrop: 'static' });
  }

  /**
   * Send Password Reset Email to user
   */
  foregetPassword() {
    if (this.emailID != null && this.emailID !== undefined) {
      this.authService.sendPasswordResetEmail(this.emailID);
    } else {
      this.toastr.error('Email ID is required');
    }
  }

  isLoggedIn() {
    this.userService.getCurrentUser().then(user => {
      this.toastr.success('Login Successfully');
      this.router.navigate(['default-layout/home']);
    }, err => {
      this.toastr.error(err);
      this.errorMessage = err.message;
    });
  }

}
