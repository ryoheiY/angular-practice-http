import {inject, Injectable, signal} from '@angular/core';

import {Place} from './place.model';
import {catchError, map, Observable, tap, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ErrorService} from "../shared/error.service";

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  private errorService = inject(ErrorService);

  loadedUserPlaces = this.userPlaces.asReadonly();
  private httpClient = inject(HttpClient);

  loadAvailablePlaces(): Observable<Place[]> {
    return this.fetchPlaces("http://localhost:3000/places", "Something wrong went!");
  }

  loadUserPlaces() {
    return this.fetchPlaces(
      "http://localhost:3000/user-places", "Something wrong went!")
      .pipe(tap({
        next: userPlaces => {this.userPlaces.set(userPlaces)}
      }));
  }

  addPlaceToUserPlaces(place: Place) {
    const prevPlaces = this.userPlaces();

    if(!prevPlaces.some(p => p.id === place.id)) {
      this.userPlaces.update(prevPlaces => [...prevPlaces, place]);
    }

    return this.httpClient.put(`http://localhost:3000/user-places/`, {
      placeId: place.id,
    })
      .pipe(
        catchError(() => {
          this.userPlaces.set(prevPlaces);
          this.errorService.showError("Failed to store place")
          return throwError(() => new Error('Failed to store place'));
        })
      )
  }

  removeUserPlace(place: Place) {
    const prevPlaces = this.userPlaces();
    console.log(prevPlaces);

    if(prevPlaces.some(p => p.id === place.id)) {
      this.userPlaces.set(prevPlaces.filter(prevPlace => prevPlace.id !== place.id));
      console.log(this.userPlaces());
    }

    return this.httpClient
      .delete(`http://localhost:3000/user-places/${place.id}`)
      .pipe(
        catchError(() => {
          this.userPlaces.set(prevPlaces);
          this.errorService.showError("Failed to delete place")
          return throwError(() => new Error('Failed to delete place'));
        })
      );
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
