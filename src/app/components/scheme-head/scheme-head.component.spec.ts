import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeHeadComponent } from './scheme-head.component';

describe('SchemeHeadComponent', () => {
  let component: SchemeHeadComponent;
  let fixture: ComponentFixture<SchemeHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchemeHeadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SchemeHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
