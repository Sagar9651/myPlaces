import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router, public fireBaseAuth: AngularFireAuth, private toastr: ToastrService) { }

doFacebookLogin() {
  return new Promise<any>((resolve, reject) => {
    let provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth()
    .signInWithPopup(provider)
    .then(res => {
      resolve(res);
    }, err => {
      console.log(err);
      reject(err);
    });
  });
}

// doTwitterLogin(){
//   return new Promise<any>((resolve, reject) => {
//     let provider = new firebase.auth.TwitterAuthProvider();
//     this.afAuth.auth
//     .signInWithPopup(provider)
//     .then(res => {
//       resolve(res);
//     }, err => {
//       console.log(err);
//       reject(err);
//     })
//   })
// }

signInWithGoogle() {
  return firebase.auth().signInWithPopup(
    new firebase.auth.GoogleAuthProvider()
  );
}

register(value) {
  return new Promise<any>((resolve, reject) => {
    firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
    .then(res => {
      resolve(res);
    }, err => reject(err));
  });
}

login(value) {
  return new Promise<any>((resolve, reject) => {
    firebase.auth().signInWithEmailAndPassword(value.email, value.password)
    .then(res => {
      resolve(res);
    }, err => reject(err));
  });
}

logOut() {
  return new Promise((resolve, reject) => {
    if (firebase.auth().currentUser) {
      firebase.auth().signOut().then( res => {
        localStorage.removeItem('uId');
        this.router.navigate(['/login']);
         // resolve();
      }, err => {
        console.log(err);
      });
    } else {

      reject();
    }
  });
}

  sendPasswordResetEmail(email) {
    firebase.auth().sendPasswordResetEmail(email).then( res => {
      this.toastr.success('Password link is sent to your Email ID, Please Check your mail');
    }, err => {
      this.toastr.error(err);
    });
  }

  confirmPasswordReset(code, password) {
    firebase.auth().confirmPasswordReset(code, password).then( res => {
      this.toastr.success('Password Changed Successfully, Please Login');
      this.router.navigate(['/login']);
    })
    .catch(err => {
      this.toastr.error(err);
     });
  }

}
