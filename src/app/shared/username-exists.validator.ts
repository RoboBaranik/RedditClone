import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { map, Observable } from "rxjs";
import { User } from "../auth/user";
import { DatabaseService } from "./database.service";

@Injectable({ providedIn: 'root' })
export class UsernameExistsValidator implements AsyncValidator {
  constructor(private dbService: DatabaseService) { }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.dbService.getUserByUsername(control.value).pipe(map((response) => {
      if (response) {
        return { exists: 'true' };
      }
      return null;
    }));
  }
}