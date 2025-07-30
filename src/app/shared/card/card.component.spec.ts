import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';

@Component({
  template: `<app-card><p class="test-content">Hello from inside card</p></app-card>`
})
class TestHostComponent {}

describe('CardComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent],
      declarations: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should render projected content', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const projectedContent = compiled.querySelector('.test-content');
    expect(projectedContent).toBeTruthy();
    expect(projectedContent?.textContent).toContain('Hello from inside card');
  });
});
