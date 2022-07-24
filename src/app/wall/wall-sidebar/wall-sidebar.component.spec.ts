import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WallSidebarComponent } from './wall-sidebar.component';

describe('WallSidebarComponent', () => {
  let component: WallSidebarComponent;
  let fixture: ComponentFixture<WallSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WallSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WallSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
