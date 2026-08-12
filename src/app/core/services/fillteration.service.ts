import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  selectedCategories=signal<string[]>([]);
  selectedBrands=signal<string[]>([]);
  selectedMinPrice=signal<number|null>(null);
  selectedMaxPrice=signal<number|null>(null);
  searchedInputValue=signal<string>("");
}
