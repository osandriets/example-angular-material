import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroEditComponent } from './hero-edit.component';

describe('ItemEditComponent', () => {
  let component: HeroEditComponent;
  let fixture: ComponentFixture<HeroEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeroEditComponent],
    });
    fixture = TestBed.createComponent(HeroEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
