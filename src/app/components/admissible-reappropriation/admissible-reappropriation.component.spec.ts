import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissibleReappropriationComponent } from './admissible-reappropriation.component';

describe('AdmissibleReappropriationComponent', () => {
  let component: AdmissibleReappropriationComponent;
  let fixture: ComponentFixture<AdmissibleReappropriationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmissibleReappropriationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdmissibleReappropriationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
