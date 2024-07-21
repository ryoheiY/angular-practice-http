import {inject, Injectable, signal} from '@angular/core';

import {Place} from './place.model';
import {catchError, map, Observable, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);

  loadedUserPlaces = this.userPlaces.asReadonly();
  private httpClient = inject(HttpClient);

  loadAvailablePlaces(): Observable<Place[]> {
    return this.fetchPlaces("http://localhost:3000/places", "Something wrong went!");
  }

  loadUserPlaces() {
    return this.fetchPlaces("http://localhost:3000/user-places", "Something wrong went!");
  }

  addPlaceToUserPlaces(placeId: string) {
    return this.httpClient.put(`http://localhost:3000/user-places/`, {
      placeId
    })
  }

  removeUserPlace(place: Place) {
  }

  private fetchPlaces(url: string, errorMessage: string): Observable<Place[]> {
    return this.httpClient
      .get<{ places: Place[] }>(url)
      .pipe(
        map(resData => resData.places),
        catchError((error) => {
          console.error(error);
          return throwError(() => new Error(errorMessage))
        })
      )
  }
}
