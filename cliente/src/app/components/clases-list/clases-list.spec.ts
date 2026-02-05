import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // <---
import { RouterTestingModule } from '@angular/router/testing';
import { ClasesListComponent } from './clases-list';

describe('ClasesListComponent', () => {
  let component: ClasesListComponent;
  let fixture: ComponentFixture<ClasesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClasesListComponent, HttpClientTestingModule, RouterTestingModule] // <---
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
