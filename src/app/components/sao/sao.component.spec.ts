import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaoComponent } from './sao.component';

describe('SaoComponent', () => {
  let component: SaoComponent;
  let fixture: ComponentFixture<SaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
