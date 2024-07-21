import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';

import {Place} from '../place.model';
import {PlacesComponent} from '../places.component';
import {PlacesContainerComponent} from '../places-container/places-container.component';
import {PlacesService} from "../places.service";

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],

})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isLoading = signal(false);
  error = signal("");
  private destroyRef = inject(DestroyRef);
  private placesService = inject(PlacesService);

  ngOnInit(): void {
    this.isLoading.set(true);
    const subscription = this.placesService.loadAvailablePlaces()
      .subscribe({
        next: places => {
          this.places.set(places)
        },
        error: err => {
          console.log(err);
          this.error.set(err.message);

        },
        complete: (() => {
          this.isLoading.set(false);
        })
      })

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }

  onSelectPlace(selectedPlace: Place) {
    this.placesService.addPlaceToUserPlaces(selectedPlace).subscribe({
      next: (resData) => console.log(resData),
    });
  }


}
