import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasesListComponent } from './clases-list';

describe('ClasesListComponent', () => {
  let component: ClasesListComponent;
  let fixture: ComponentFixture<ClasesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClasesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClasesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
