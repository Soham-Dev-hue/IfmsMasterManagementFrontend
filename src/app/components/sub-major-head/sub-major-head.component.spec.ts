import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubMajorHeadComponent } from './sub-major-head.component';

describe('SubMajorHeadComponent', () => {
  let component: SubMajorHeadComponent;
  let fixture: ComponentFixture<SubMajorHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubMajorHeadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubMajorHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
