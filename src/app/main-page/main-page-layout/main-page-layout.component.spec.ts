import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPageLayoutComponent } from './main-page-layout.component';

describe('MainPageComponent', () => {
  let component: MainPageLayoutComponent;
  let fixture: ComponentFixture<MainPageLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainPageLayoutComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPageLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
