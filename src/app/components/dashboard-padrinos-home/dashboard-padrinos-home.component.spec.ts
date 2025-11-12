import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPadrinosHomeComponent } from './dashboard-padrinos-home.component';

describe('DashboardPadrinosHomeComponent', () => {
  let component: DashboardPadrinosHomeComponent;
  let fixture: ComponentFixture<DashboardPadrinosHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPadrinosHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardPadrinosHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
