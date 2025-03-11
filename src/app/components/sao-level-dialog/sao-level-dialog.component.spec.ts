import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaoLevelDialogComponent } from './sao-level-dialog.component';

describe('SaoLevelDialogComponent', () => {
  let component: SaoLevelDialogComponent;
  let fixture: ComponentFixture<SaoLevelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaoLevelDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaoLevelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
