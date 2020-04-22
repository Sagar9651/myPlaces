import { AlertService } from './../alert.service';
import { Profile } from './../profile.model';
import { UserService } from './../user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userData = { displayName: '', phoneNumber: '', email: '' };
  displayName: any;
  userId: any;
  profile: Profile = new Profile();
  constructor(private userService: UserService, private alertService: AlertService) { }

  ngOnInit(): void {
    // Get Logged in User Profile Data
    this.userService.getUserData().then(res => {
      this.userData.displayName = res.displayName;
      this.userData.phoneNumber = res.phoneNumber;
      this.userId = res.uid;
      this.userData.email = res.email;
      this.userService.getProfile(this.userId).then(respo => {
        if (respo != null) {
          this.profile = respo;
        } else {
          this.profile.name = '';
          this.profile.phoneNumber = null;
          this.profile.emailId =  this.userData.email;
          this.profile.address = '';
          this.profile.city = '';
          this.profile.country = '';
          this.profile.zipCode = null;
          this.profile.aboutMe = '';
        }
      });
    });
  }

  /**
   * Save Profile Information (Overwrite the data)
   */
  SaveProfile() {
    this.profile.id = this.userId;
    this.userService.createProfile(this.profile);
    this.updateAuthProfile();
  }

  /**
   * Update Authorization field
   */
  updateAuthProfile() {
    let value = { displayName: '' };
    value.displayName = this.profile.name;
    this.userService.updateCurrentUser(value).then(res => {
      console.log(res);
    });
  }

  // Not Used
  updateProfile() {
    this.profile.id = this.userId;
    this.userService.updateProfile(this.profile);
  }

}
