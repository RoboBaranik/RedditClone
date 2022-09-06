import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitLayoutComponent } from './submit-layout.component';

describe('SubmitLayoutComponent', () => {
  let component: SubmitLayoutComponent;
  let fixture: ComponentFixture<SubmitLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
