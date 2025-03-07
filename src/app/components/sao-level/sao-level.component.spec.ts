import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaoLevelComponent } from './sao-level.component';

describe('SaoLevelComponent', () => {
  let component: SaoLevelComponent;
  let fixture: ComponentFixture<SaoLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaoLevelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaoLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
