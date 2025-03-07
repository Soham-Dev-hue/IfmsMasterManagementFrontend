import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MajorHeadRangeByTypeComponent } from './major-head-range-by-type.component';

describe('MajorHeadRangeByTypeComponent', () => {
  let component: MajorHeadRangeByTypeComponent;
  let fixture: ComponentFixture<MajorHeadRangeByTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MajorHeadRangeByTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MajorHeadRangeByTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
