import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesHomeComponent } from './roles-home.component';

describe('RolesHomeComponent', () => {
  let component: RolesHomeComponent;
  let fixture: ComponentFixture<RolesHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
