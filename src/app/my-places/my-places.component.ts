import { ToastrService } from 'ngx-toastr';
import { AlertService } from './../alert.service';
import { Component, OnInit } from '@angular/core';
import { GeoserviceService } from '../geoservice.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-my-places',
  templateUrl: './my-places.component.html',
  styleUrls: ['./my-places.component.scss']
})
export class MyPlacesComponent implements OnInit {

  constructor(private geoervice: GeoserviceService, private modalService: NgbModal,
    private alertService: AlertService, private toastr: ToastrService) { }

  places: any[] = [];
  key: any;
  deleteId: any;
  userId: any;

  ngOnInit(): void {
    this.userId = localStorage.getItem('uId');
    this.getPlaces();
  }

  /**
   * Get All Saved Places (User wise)
   */
  getPlaces() {
    this.places = [];
    this.geoervice.getPlaces(this.userId).then(res => {
      Object.keys(res).map(x => {
        this.places.push({ x: res[x] });
        return this.places;
      });
    });
  }

  /**
   * Edit Place
   */
  editPopUp(editPOP, key) {
    this.key = JSON.stringify(key);
    this.modalService.open(editPOP, { centered: true, backdrop: 'static', size: 'xl', scrollable: true });
  }

  getAddress(place: object) {
    console.log(place);
  }

  /**
   * Delete Confirmation Modal
   */
  deleteConfirmation(deleteConfirmationpopup, record) {
    const obj = JSON.stringify(record);
    this.deleteId = JSON.parse(obj).key;
    this.modalService.open(deleteConfirmationpopup, { centered: true, backdrop: 'static' });
  }

  /**
   * Delete Place
   */
  deletePlace() {
    this.geoervice.deletePlace(this.deleteId);
    this.modalService.dismissAll();
    this.getPlaces();
  }
}
