import { TestBed } from '@angular/core/testing';

import { GeoserviceService } from './geoservice.service';

describe('GeoserviceService', () => {
  let service: GeoserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeoserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
