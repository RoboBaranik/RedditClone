import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { DatabaseService } from '../shared/database.service';
import { messages } from '../shared/messages';
import { UsernameExistsValidator } from '../shared/username-exists.validator';
import { UserService } from './user.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  loginForm: FormGroup;
  signupForm: FormGroup;
  confirmPasswordValidator?: ValidatorFn;
  allAuthStates = AuthType;
  authState: AuthType = AuthType.UNDEFINED;
  controlNames = { login: ['email', 'password'], signup: ['name', 'email', 'password', 'confirmPassword'] };
  errorMessages: { login: { [key: string]: string }, signup: { [key: string]: string } } = {
    login: {
      'email': '',
      'password': '',
      'generic': ''
    },
    signup: {
      'name': '',
      'email': '',
      'password': '',
      'confirmPassword': '',
      'generic': ''
    }
  };

  constructor(private route: ActivatedRoute, private router: Router,
    private userService: UserService, private dbService: DatabaseService,
    private userExistsValidator: UsernameExistsValidator) {
    this.loginForm = this.initLoginForm();
    this.signupForm = this.initSignupForm();
    this.resetErrorMessages();
  }

  ngOnInit(): void {
    this.route.url.subscribe(url => {
      if (!url || url.length < 1) {
        this.authState = AuthType.UNDEFINED;
        return;
      }
      if (url[0].path === 'login') {
        this.authState = AuthType.LOGIN;
        return;
      }
      if (url[0].path === 'signup') {
        this.authState = AuthType.SIGNUP;
        return;
      }
      this.authState = AuthType.UNDEFINED;
    });
    if (this.authState === AuthType.LOGIN && this.userService.user) {
      this.router.navigate(['']);
    }
    const reset = (status: any) => {
      if (!this.areErrorMessagesEmpty()) {
        this.resetErrorMessages();
      }
    }
    this.signupForm.valueChanges.subscribe(reset);
    this.loginForm.valueChanges.subscribe(reset);
  }
  initLoginForm(): FormGroup {
    const emailControl = new FormControl(null);
    emailControl.statusChanges.subscribe(status => this.handleBasicError('email', emailControl));

    const passwordControl = new FormControl(null, Validators.pattern(/\S+/));
    passwordControl.statusChanges.subscribe(status => this.handleBasicError('password', passwordControl));

    return new FormGroup({
      email: emailControl,
      password: passwordControl
    });
  }
  initSignupForm(): FormGroup {
    const nameControl = new FormControl(null, {
      validators: [Validators.pattern(/^[a-zA-Z0-9-_]+$/)],
      asyncValidators: [this.userExistsValidator.validate.bind(this.userExistsValidator)]
    });
    nameControl.statusChanges.subscribe(status => this.handleBasicError('name', nameControl));

    const emailControl = new FormControl(null);
    emailControl.statusChanges.subscribe(status => this.handleBasicError('email', emailControl));

    const passwordControl = new FormControl(null, Validators.pattern(/\S+/));
    passwordControl.valueChanges.subscribe(value => {
      if (value) {
        if (this.confirmPasswordValidator) {
          confirmPasswordControl.removeValidators(this.confirmPasswordValidator);
        }
        this.confirmPasswordValidator = Validators.pattern(new RegExp(`^${value}$`));
        confirmPasswordControl.addValidators(this.confirmPasswordValidator);
        confirmPasswordControl.updateValueAndValidity();
      }
    });
    passwordControl.statusChanges.subscribe(status => this.handleBasicError('password', passwordControl));

    const confirmPasswordControl = new FormControl(null, Validators.pattern(/\S+/));
    confirmPasswordControl.statusChanges.subscribe(status => this.handleBasicError('confirmPassword', confirmPasswordControl));

    return new FormGroup({
      name: nameControl,
      email: emailControl,
      password: passwordControl,
      confirmPassword: confirmPasswordControl
    });
  }
  resetErrorMessages() {
    this.errorMessages = {
      login: {
        'email': '',
        'password': '',
        'generic': ''
      },
      signup: {
        'name': '',
        'email': '',
        'password': '',
        'confirmPassword': '',
        'generic': ''
      }
    };
    const controlsToMakeValid = ['name', 'email', 'password', 'confirmPassword', 'generic'];
    controlsToMakeValid.forEach(control => {
      const removedError = JSON.stringify(this.getFormControlOrGroupByErrorType(control).errors).replace(/ *\"incorrect\": *true,? */, '');
      if (removedError === '{}') {
        this.getFormControlOrGroupByErrorType(control).setErrors(null);
      } else {
        this.getFormControlOrGroupByErrorType(control).setErrors(JSON.parse(removedError));
      }
    });
  }
  areErrorMessagesEmpty(): boolean {
    switch (this.authState) {
      default:
      case AuthType.SIGNUP:
      case AuthType.UNDEFINED:
        return !this.errorMessages.signup['email'] && !this.errorMessages.signup['password'] && !this.errorMessages.signup['generic'];
      case AuthType.LOGIN:
        return !this.errorMessages.login['email'] && !this.errorMessages.login['password'] && !this.errorMessages.login['generic'];
    }
  }
  login() {
    console.log(this.loginForm);
    console.log(this.loginForm.valid ? 'Valid' : 'Invalid');
    this.handleBasicErrorAll();
    if (!this.loginForm.valid) {
      return;
    }
    this.userService.logIn(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value).subscribe({
      next: (response) => {
        this.router.navigate(['']);
      },
      error: (error) => {
        console.error('Error by logging in.');
        console.log(error);
        this.handleErrorResponse(error.error.error.message);
      }
    });
  }
  signup() {
    console.log(this.signupForm);
    console.log(this.signupForm.valid ? 'Valid' : 'Invalid');
    this.handleBasicErrorAll();
    if (!this.signupForm.valid) {
      return;
    }
    this.userService.signUp(this.signupForm.controls['name'].value, this.signupForm.controls['email'].value, this.signupForm.controls['password'].value).subscribe({
      next: (response) => {
        this.router.navigate(['']);
      },
      error: (error) => {
        console.log(error);
        this.handleErrorResponse(error.error.error.message);
      }
    });
  }

  handleErrorResponse(errorResponse: string) {
    var errorObject = messages.error.requestError[errorResponse];
    var errorMessage = errorObject ? errorObject.message : messages.error.unexpectedErrorMessage;
    var errorControls = errorObject ? errorObject.controls : [messages.error.controlTypes.generic];
    switch (this.authState) {
      default:
      case AuthType.SIGNUP:
      case AuthType.UNDEFINED:
        errorControls.forEach(control => {
          this.errorMessages.signup[control] = errorMessage;
          this.getFormControlOrGroupByErrorType(control).setErrors({ 'incorrect': true });
        });
        break;
      case AuthType.LOGIN:
        errorControls.forEach(control => {
          this.errorMessages.login[control] = errorMessage;
          this.getFormControlOrGroupByErrorType(control).setErrors({ 'incorrect': true });
        });
        break;
    }
  }
  handleBasicError(controlName: string, control: FormControl) {
    if (!control.errors) {
      this.getErrorMessages()[controlName] = '';
      return;
    }
    const errorsPossible = messages.error.basicErrorsByControl[controlName];
    for (var i = 0; i < errorsPossible.length; i++) {
      if (control.hasError(errorsPossible[i].error)) {
        const basicErrorCode = errorsPossible[i].basicErrorCode;
        const errorMessage = messages.error.basicError[basicErrorCode].message;
        this.getErrorMessages()[controlName] = errorMessage;
      }
    }
  }
  handleBasicErrorAll() {
    switch (this.authState) {
      default:
      case AuthType.SIGNUP:
      case AuthType.UNDEFINED:
        this.controlNames.signup.forEach(controlName => {
          this.handleBasicError(controlName, this.signupForm.controls[controlName] as FormControl);
        });
        break;
      case AuthType.LOGIN:
        this.controlNames.login.forEach(controlName => {
          this.handleBasicError(controlName, this.loginForm.controls[controlName] as FormControl);
        });
        break;
    }
  }
  getFormControlOrGroupByErrorType(name: string): FormControl | FormGroup {
    switch (this.authState) {
      default:
      case AuthType.SIGNUP:
      case AuthType.UNDEFINED:
        if (name === 'generic' || !this.signupForm.controls[name]) {
          return this.signupForm;
        }
        return this.signupForm.controls[name] as FormControl;
      case AuthType.LOGIN:
        if (name === 'generic' || !this.loginForm.controls[name]) {
          return this.loginForm;
        }
        return this.loginForm.controls[name] as FormControl;
    }
  }
  getFormControlByErrorType(name: string): FormControl {
    switch (this.authState) {
      default:
      case AuthType.SIGNUP:
      case AuthType.UNDEFINED:
        return this.signupForm.controls[name] as FormControl;
      case AuthType.LOGIN:
        return this.loginForm.controls[name] as FormControl;
    }
  }
  getErrorMessages(): { [key: string]: string } {
    switch (this.authState) {
      default:
      case AuthType.SIGNUP:
      case AuthType.UNDEFINED:
        return this.errorMessages.signup;
      case AuthType.LOGIN:
        return this.errorMessages.login;
    }
  }
  log() {
    console.log('Login form:');
    console.log(this.loginForm);
    console.log('Signup form:');
    console.log(this.signupForm);
    console.log(this.errorMessages);
  }
}
export enum AuthType {
  LOGIN, SIGNUP, UNDEFINED
}
// export const passwordsSame: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
//   const password = control.get('password');
//   const confirmPassword = control.get('confirmPassword');

//   return password?.value === confirmPassword?.value ? null : { notmatched: true };
// };
