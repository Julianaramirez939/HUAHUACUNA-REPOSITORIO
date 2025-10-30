import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueHacemosComponent } from './que-hacemos.component';

describe('QueHacemosComponent', () => {
  let component: QueHacemosComponent;
  let fixture: ComponentFixture<QueHacemosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueHacemosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueHacemosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
