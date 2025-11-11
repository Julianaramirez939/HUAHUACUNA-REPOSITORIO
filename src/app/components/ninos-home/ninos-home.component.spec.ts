import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NinosHomeComponent } from './ninos-home.component';

describe('NinosHomeComponent', () => {
  let component: NinosHomeComponent;
  let fixture: ComponentFixture<NinosHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NinosHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NinosHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
