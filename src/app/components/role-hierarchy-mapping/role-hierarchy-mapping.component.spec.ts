import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleHierarchyMappingComponent } from './role-hierarchy-mapping.component';

describe('RoleHierarchyMappingComponent', () => {
  let component: RoleHierarchyMappingComponent;
  let fixture: ComponentFixture<RoleHierarchyMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleHierarchyMappingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoleHierarchyMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
