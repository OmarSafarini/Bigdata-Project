import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecommendedComponent } from './recommended';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('RecommendedComponent', () => {
  let component: RecommendedComponent;
  let fixture: ComponentFixture<RecommendedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecommendedComponent], 
      imports: [CommonModule, FormsModule] 
    }).compileComponents();

    fixture = TestBed.createComponent(RecommendedComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
