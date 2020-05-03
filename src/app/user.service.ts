import { ToastrService } from 'ngx-toastr';

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Profile } from './profile.model';
import { AngularFireDatabase } from '@angular/fire/database';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class UserService {
  firebaseRef = firebase.database().ref();
  profile = new  BehaviorSubject([]);

  constructor(
    private db: AngularFireDatabase, private toastr: ToastrService, private af: AngularFirestore, private fileStorage: AngularFireStorage
  //  public db: AngularFirestore
   ) { }


  getCurrentUser() {
    return new Promise<any>((resolve, reject) => {
       firebase.auth().onAuthStateChanged( user => {
        if (user) {
          localStorage.setItem('uId', user.uid);
          resolve(user);
        } else {
          reject('No user logged in');
        }
      });
    });
  }

  getUserData() {
    return new Promise<any>((resolve, reject) => {
      const user = firebase.auth().currentUser;
      if (user) {
        resolve(user);
      }
    });
  }

  updateCurrentUser(value) {
    return new Promise<any>((resolve, reject) => {
      const user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: value.displayName,
        // photoURL: user.photoURL
      }).then(res => {
        resolve(res);
      }, err => reject(err));
    });
  }

  getProfile(id) {
    return new Promise<any>((resolve, reject) => {
    firebase.database().ref('/profile/' + id).on('value', res => {
      console.log('res :', res.val());
      resolve(res.val());
    }, err => {
      reject(err);
    });
  });
  }

  createProfile(profile: Profile) {
    firebase.database().ref('profile/' + profile.id).set(profile)
    .then(_ => this.toastr.success('Profile Saved Successfully'))
    .catch(err => this.toastr.error(err));
  }

  updateProfile(profile: Profile) {
    firebase.database().ref('profile/' + profile.id).update(profile)
    .then(_ => this.toastr.success('Profile Updated Successfully'))
    .catch(err => this.toastr.error(err));
  }

  deleteProfile(Id: string) {
    firebase.database().ref('profile/' + Id).remove()
    .then(_ => console.log('Profile Deleted'))
    .catch(err => console.log(err));
}

/**
 * File uplaod using AngularFireStorage (into Storage)
 */
uploadFile(event) {
  const userId = localStorage.getItem('uId');
  const newFileKey = Math.random().toString(36).substring(2);
  this.fileStorage.upload('/userFiles/' + userId + '/' + newFileKey, event.target.files[0])
  .then(_ => {
    this.toastr.success('File Saved Successfully');
  })
  .catch(err => {
    this.toastr.error(err);
  });
}

}
