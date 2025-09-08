import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ShiftService } from './shift.service';
import { GetShiftDto } from '../dtos/get-shift.dto';
import { CreateShiftDto } from '../dtos/create-shift.dto';
import { UpdateShiftDto } from '../dtos/update-shift.dto';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ShiftService', () => {
  let service: ShiftService;
  let httpMock: HttpTestingController;

  const apiUrl = 'https://localhost:7001/api/shifts';

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [ShiftService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});

    service = TestBed.inject(ShiftService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getShifts', () => {
    it('should fetch all shifts without query params', () => {
      const dummyShifts: GetShiftDto[] = [
        {
          id: 1,
          date: new Date('2024-07-01T10:00:00Z'),
          creditTips: 100,
          cashTips: 50,
          tipout: 20,
          hoursWorked: 8
        },
        {
          id: 2,
          date: new Date('2024-07-02T12:00:00Z'),
          creditTips: 120,
          cashTips: 60,
          tipout: 25
        }
      ];

      service.getShifts().subscribe(shifts => {
        expect(shifts.length).toBe(2);
        expect(shifts).toEqual(dummyShifts);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(dummyShifts);
    });

    it('should include startDate and endDate in query params', () => {
      const startDate = new Date('2024-07-01T00:00:00Z');
      const endDate = new Date('2024-07-07T00:00:00Z');
      const expectedUrl = `${apiUrl}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;

      service.getShifts(startDate, endDate).subscribe();

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('addShift', () => {
    it('should POST a new shift', () => {
      const newShift: CreateShiftDto = {
        date: new Date('2024-07-29T15:00:00Z'),
        creditTips: 100,
        cashTips: 50,
        tipout: 10,
        hoursWorked: 7
      };

      const createdShift: GetShiftDto = {
        id: 3,
        ...newShift
      };

      service.addShift(newShift).subscribe(result => {
        expect(result).toEqual(createdShift);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newShift);
      req.flush(createdShift);
    });
  });

  describe('deleteShift', () => {
    it('should DELETE shift by ID', () => {
      const id = 1;

      service.deleteShift(id).subscribe(response => {
        expect(response).toEqual({});
      });

      const req = httpMock.expectOne(`${apiUrl}/${id}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('editShift', () => {
    it('should PUT updated shift data', () => {
      const id = 2;
      const updatedShift: UpdateShiftDto = {
        id: id,
        date: new Date('2024-07-30T10:00:00Z'),
        creditTips: 150,
        cashTips: 70,
        tipout: 20,
        hoursWorked: 6
      };

      service.editShift(id, updatedShift).subscribe(response => {
        expect(response).toEqual({});
      });

      const req = httpMock.expectOne(`${apiUrl}/${id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedShift);
      req.flush({});
    });
  });

  describe('sortByDateAscending', () => {
    it('should sort shifts by date ascending', () => {
      const a: GetShiftDto = {
        id: 1,
        date: new Date('2024-07-01T10:00:00Z'),
        creditTips: 50,
        cashTips: 30,
        tipout: 10
      };

      const b: GetShiftDto = {
        id: 2,
        date: new Date('2024-07-02T10:00:00Z'),
        creditTips: 60,
        cashTips: 40,
        tipout: 15
      };

      const result = service.sortByDateAscending(a, b);
      expect(result).toBeLessThan(0); // a comes before b
    });
  });
});
