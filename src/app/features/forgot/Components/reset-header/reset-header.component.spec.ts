import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetHeaderComponent } from './reset-header.component';

describe('ResetHeaderComponent', () => {
  let component: ResetHeaderComponent;
  let fixture: ComponentFixture<ResetHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetHeaderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
