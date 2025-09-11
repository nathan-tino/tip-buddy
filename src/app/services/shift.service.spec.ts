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
  
  describe('getShiftsSummary', () => {
    it('should fetch shifts and return summary', () => {
      const startDate = new Date('2024-07-01T00:00:00Z');
      const endDate = new Date('2024-07-07T00:00:00Z');
      const dummyShifts: GetShiftDto[] = [
        { id: 1, date: new Date('2024-07-01T10:00:00Z'), creditTips: 100, cashTips: 50, tipout: 20, hoursWorked: 8 },
        { id: 2, date: new Date('2024-07-02T12:00:00Z'), creditTips: 120, cashTips: 60, tipout: 25, hoursWorked: 7 }
      ];
      const expectedSummary = service.calculateShiftsSummary(dummyShifts);

      service.getShiftsSummary(startDate, endDate).subscribe(summary => {
        expect(summary).toEqual(expectedSummary);
      });

      const expectedUrl = `${apiUrl}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(dummyShifts);
    });
  });

  describe('calculateShiftsSummary', () => {
    it('should return correct summary for shifts', () => {
      const shifts: GetShiftDto[] = [
        { id: 1, date: new Date(), creditTips: 100, cashTips: 50, tipout: 20, hoursWorked: 8 },
        { id: 2, date: new Date(), creditTips: 120, cashTips: 60, tipout: 25, hoursWorked: 7 }
      ];
      const summary = service.calculateShiftsSummary(shifts);

      // Validate summary fields
      expect(summary.totalShifts).toBe(2);
      expect(summary.totalHoursWorked).toBe(15);
      expect(summary.shifts).toEqual(shifts);
      // Add more expectations as needed for other summary fields
    });
  });

  describe('calculateShiftsSummary edge cases', () => {
    it('should handle shifts with tipout, cashTips, creditTips, and hoursWorked set to 0', () => {
      const shifts: GetShiftDto[] = [
        { id: 1, date: new Date(), tipout: 0, cashTips: 0, creditTips: 0, hoursWorked: 0 },
        { id: 2, date: new Date(), tipout: 0, cashTips: 0, creditTips: 0, hoursWorked: 0 },
        { id: 3, date: new Date(), tipout: 0, cashTips: 0, creditTips: 0, hoursWorked: 0 }
      ];
      const summary = service.calculateShiftsSummary(shifts);
      expect(summary.totalTips).toBe(0);
      expect(summary.averageTipsPerShift).toBe(0);
      expect(summary.cashTipsTotal).toBe(0);
      expect(summary.creditTipsTotal).toBe(0);
      expect(summary.totalTipout).toBe(0);
      expect(summary.cashTipsPercentage).toBe(0);
      expect(summary.creditTipsPercentage).toBe(0);
      expect(summary.tipsPerHour).toBe(0);
      expect(summary.totalShifts).toBe(3);
      expect(summary.totalHoursWorked).toBe(0);
      expect(summary.shifts).toEqual(shifts);
    });

    it('should handle tipout fallback to 0 (|| 0)', () => {
      const shifts: GetShiftDto[] = [
        { id: 1, date: new Date(), tipout: 0, cashTips: 10, creditTips: 20, hoursWorked: 2 },
        { id: 2, date: new Date(), tipout: 5, cashTips: 15, creditTips: 25, hoursWorked: 3 }
      ];
      const summary = service.calculateShiftsSummary(shifts);
      // tipout: 0 + 5 = 5
      expect(summary.totalTipout).toBe(5);
      // cashTips: 10 + 15 = 25
      expect(summary.cashTipsTotal).toBe(25);
      // creditTips: (20 + 25) - 5 = 40
      expect(summary.creditTipsTotal).toBe(40);
      // totalTips: 25 + 40 = 65
      expect(summary.totalTips).toBe(65);
      // totalHoursWorked: 2 + 3 = 5
      expect(summary.totalHoursWorked).toBe(5);
      // averageTipsPerShift: 65 / 2 = 32.5
      expect(summary.averageTipsPerShift).toBe(32.5);
      // cashTipsPercentage: (25 / 65) * 100
      expect(summary.cashTipsPercentage).toBeCloseTo((25 / 65) * 100);
      // creditTipsPercentage: (40 / 65) * 100
      expect(summary.creditTipsPercentage).toBeCloseTo((40 / 65) * 100);
      // tipsPerHour: 65 / 5 = 13
      expect(summary.tipsPerHour).toBe(13);
      expect(summary.totalShifts).toBe(2);
      expect(summary.shifts).toEqual(shifts);
    });
  });

    it('should return all zero summary fields when shifts array is empty', () => {
      const summary = service.calculateShiftsSummary([]);
      expect(summary.totalTips).toBe(0);
      expect(summary.averageTipsPerShift).toBe(0);
      expect(summary.cashTipsTotal).toBe(0);
      expect(summary.creditTipsTotal).toBe(0);
      expect(summary.totalTipout).toBe(0);
      expect(summary.cashTipsPercentage).toBe(0);
      expect(summary.creditTipsPercentage).toBe(0);
      expect(summary.tipsPerHour).toBe(0);
      expect(summary.totalShifts).toBe(0);
      expect(summary.totalHoursWorked).toBe(0);
      expect(summary.shifts).toEqual([]);
    });
});
