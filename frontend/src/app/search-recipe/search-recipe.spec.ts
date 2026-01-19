import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchRecipe } from './search-recipe';

describe('SearchRecipe', () => {
  let component: SearchRecipe;
  let fixture: ComponentFixture<SearchRecipe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchRecipe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchRecipe);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
