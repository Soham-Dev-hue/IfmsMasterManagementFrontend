import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MajorHeadComponent } from './major-head.component';

describe('MajorHeadComponent', () => {
  let component: MajorHeadComponent;
  let fixture: ComponentFixture<MajorHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MajorHeadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MajorHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
