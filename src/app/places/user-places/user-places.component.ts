import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';

import {PlacesContainerComponent} from '../places-container/places-container.component';
import {PlacesComponent} from '../places.component';
import {Place} from "../place.model";
import {PlacesService} from "../places.service";

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isLoading = signal(false);
  error = signal("");
  private destroyRef = inject(DestroyRef);
  private placesService = inject(PlacesService);

  ngOnInit(): void {
    this.isLoading.set(true);
    const subscription = this.placesService.loadUserPlaces()
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
}
