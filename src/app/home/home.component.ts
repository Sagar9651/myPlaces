/// <reference types='@types/googlemaps' />
import { AlertService } from './../alert.service';
import { Component, OnInit, NgZone, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { from } from 'rxjs';
import { GeoserviceService } from '../geoservice.service';
import { MyPlaces } from '../my-places.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
/**
 * Need a Billing for Google Map API
 * Current limit is 1 API call per day (Place Search);
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @Input() adressType: string;
  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  @ViewChild('search') addresstext: any;

  autocompleteInput: any;
  search: any;
  zoom: number;
  latitude: number;
  longitude: number;
  latlongs: any = [];
  latlong: any = {};
  searchKey: FormControl;
  locArray: any[] = [];
  isHidden: boolean = true;
  PlaceName: string;
  placeAddress: string;
  isEdit: boolean = false;
  keyForPlace: string;
  placeObject: MyPlaces = new MyPlaces();

  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private geoService: GeoserviceService,
    private modalService: NgbModal, private toastr: ToastrService) { }


  ngOnInit(): void {
    this.latlongs = [];
    this.zoom = 8;
    this.searchKey = new FormControl();

    // check is it for Update OR save
    if (this.adressType != null) {
      const obj = JSON.parse(this.adressType);
      this.keyForPlace = obj.key;
      this.longitude = obj.longitude;
      this.latitude = obj.lattitude;
      const latlong = {
        latitude: this.latitude,
        longitude: this.longitude
      };
      this.latlongs.push(latlong);
      this.isEdit = true;
    } else {
      this.isEdit = false;
      this.getCureentPosition();
      this.geoService.hits.subscribe(hits => this.latlongs = hits);
    }

    // Autocomplete Place Search
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement, {
        types: [],
      });

      // Event Listener for Place search change, get Location details
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          const latlong = {                       // to display location marks in Map
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng()
          };
          this.PlaceName = place.name;
          this.placeAddress = place.formatted_address;
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.locArray[0] = place.geometry.location.lat();
          this.locArray[1] = place.geometry.location.lng();
          this.latlongs.push(latlong);
          this.isHidden = false;
          this.invokeEvent(place);
          // Not necessary (for Geo FireBase)
          this.geoService.getLocation(50, [place.geometry.location.lat(), place.geometry.location.lng()]);
          this.searchKey.reset();
        });
      });
    });
  }

  /**
   * Get Users current location
   * Render Location into google Map
   */
  getCureentPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.longitude = position.coords.longitude;
        this.latitude = position.coords.latitude;
        this.zoom = 8;
        const latlong = {
          latitude: this.latitude,
          longitude: this.longitude
        };
        this.latlongs.push(latlong);
      });
    }
  }

  /**
   * Save to my Places
   */
  saveToMyPlaces() {
    this.placeObject.userId = localStorage.getItem('uId');
    this.placeObject.address = this.placeAddress;
    this.placeObject.placeName = this.PlaceName;
    this.placeObject.lattitude = this.latitude;
    this.placeObject.longitude = this.longitude;
    this.placeObject.openingHours = '9 AM to 8PM';    // open time not getting (temp data)
    this.geoService.saveMyPlaces(this.placeObject);
  }

  /**
   * Event for myPlaces (update location)
   */
  invokeEvent(place) {
    this.setAddress.emit(place);
  }

  /**
   * Update Location into DataBase
   */
  updatePlace() {
    this.placeObject.userId = localStorage.getItem('uId');
    this.placeObject.address = this.placeAddress;
    this.placeObject.placeName = this.PlaceName;
    this.placeObject.lattitude = this.latitude;
    this.placeObject.longitude = this.longitude;
    this.placeObject.key = this.keyForPlace;
    this.placeObject.openingHours = '9 AM to 8PM';
    this.geoService.updatePlace(this.placeObject).then(res => {
      console.log(res);
      if (res != null) {
        this.modalService.dismissAll();
        this.toastr.success('Place Updated Successfully');
      } else {
        this.modalService.dismissAll();
        this.toastr.error('Some went Wrong, Please try again');
      }
    });
  }

}
