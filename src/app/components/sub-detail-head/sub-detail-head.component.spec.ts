import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubDetailHeadComponent } from './sub-detail-head.component';

describe('SubDetailHeadComponent', () => {
  let component: SubDetailHeadComponent;
  let fixture: ComponentFixture<SubDetailHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubDetailHeadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubDetailHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
