import { AlertService } from './alert.service';
import { GeoFire } from 'geofire';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { BehaviorSubject, from } from 'rxjs';
import * as firebase from 'firebase';
import { MyPlaces } from './my-places.model';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class GeoserviceService {

  dbRef: any;
  geoFire: any;

  hits = new BehaviorSubject([]);
  constructor(private db: AngularFireDatabase, private toastr: ToastrService) {
    const firebaseRef = firebase.database().ref();
    this.geoFire = new GeoFire(firebaseRef);

    const ref = this.geoFire.ref();  // ref === firebaseRef

    this.db.list(ref);
  }

  setLocation(key: string, coords: Array<number>) {
    this.geoFire.set(key, coords)
      .then(_ => console.log('location Updated'))
      .catch(err => console.log(err));
  }

  getLocation(radius: number, coords: Array<number>) {
    this.geoFire.query({
      center: coords,
      radius: radius
    })
      .on('key_entered', (key, loc, dist) => {
        const hit = {
          location: loc,
          distance: dist
        };
        const currentHits = this.hits.value;
        currentHits.push(hit);
        this.hits.next(currentHits);
      });
  }

  saveMyPlaces(place) {
    const newPlaceKey = firebase.database().ref().child('myPlaces').push().key;
    const updates = {};
    place.key = newPlaceKey;
    updates['/myPlaces/' + place.userId + '/' + newPlaceKey] = place;
    firebase.database().ref().update(updates)
      .then(_ => {
        this.toastr.success('Place Saved Successfully');
      })
      .catch(err => {
        this.toastr.error(err);
      });
  }

  getPlaces(id) {
    return new Promise<any>((resolve, reject) => {
      firebase.database().ref('/myPlaces/' + id).on('value', res => {
        resolve(res.val());
      }, err => {
        reject(err);
      });
    });
  }

  updatePlace(place) {
    return new Promise<any>((resolve, reject) => {
      firebase.database().ref('/myPlaces/' + place.userId + '/' + place.key).update(place)
        .then(res => {
          resolve(res);
        }, err => {
          resolve(err);
        })
        .catch(err => this.toastr.error(err));
    });
  }

  deletePlace(Id) {
    return new Promise<any>((resolve, reject) => {
      const userId = localStorage.getItem('uId');
      firebase.database().ref('/myPlaces/' + userId + '/' + Id).remove()
        .then(res => {
          this.toastr.success('Place Deleted Successfully');
        })
        .catch(err => {
          this.toastr.error(err);
        });
    });
  }
}
