import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoaComponent } from './hoa.component';

describe('HoaComponent', () => {
  let component: HoaComponent;
  let fixture: ComponentFixture<HoaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
