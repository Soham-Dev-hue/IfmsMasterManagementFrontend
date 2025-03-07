import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IfscComponent } from './ifsc.component';

describe('IfscComponent', () => {
  let component: IfscComponent;
  let fixture: ComponentFixture<IfscComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IfscComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IfscComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
