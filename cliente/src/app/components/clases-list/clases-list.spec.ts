import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasesList } from './clases-list';

describe('ClasesList', () => {
  let component: ClasesList;
  let fixture: ComponentFixture<ClasesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClasesList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClasesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
