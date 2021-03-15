import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaisSmall, Pais } from '../interfaces/paises.interface';
import { combineLatest, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaisesService {
  private _baseUrl: string = 'https://restcountries.eu/rest/v2';
  private _regiones: string[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
  ];

  get regiones(): string[] {
    return [...this._regiones];
  }

  constructor(private http: HttpClient) {}

  getPaisesByRegion(region: string): Observable<PaisSmall[]> {
    const url: string = `${this._baseUrl}/region/${region}?fields=alpha3Code;name`;
    return this.http.get<PaisSmall[]>(url);
  }

  getPaisByCode(code: string): Observable<Pais | null> {
    if (!code) {
      return of(null);
    }
    const url: string = `${this._baseUrl}/alpha/${code}`;
    return this.http.get<Pais>(url);
  }

  getPaisByCodeSmall(code: string): Observable<PaisSmall> {
    const url: string = `${this._baseUrl}/alpha/${code}?fields=alpha3Code;name`;
    return this.http.get<Pais>(url);
  }

  getPaisByCodes(borders: string[]): Observable<PaisSmall[]> {
    if (!borders) {
      return of([]);
    }

    const peticiones: Observable<PaisSmall>[] = [];

    borders.forEach((codigo) => {
      const peticion = this.getPaisByCodeSmall(codigo);
      peticiones.push(peticion);
    });

    return combineLatest(peticiones);
  }
}
