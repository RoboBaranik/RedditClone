import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { messages } from '../shared/messages';
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
  errorMessages: { login: { [key: string]: string }, signup: { [key: string]: string } } = {
    login: {
      'email': '',
      'password': '',
      'generic': ''
    },
    signup: {
      'email': '',
      'password': '',
      'generic': ''
    }
  };

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) {
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
    const reset = (status: any) => {
      if (!this.areErrorMessagesEmpty()) {
        this.resetErrorMessages();
      }
    }
    this.signupForm.valueChanges.subscribe(reset);
    this.loginForm.valueChanges.subscribe(reset);
  }
  initLoginForm(): FormGroup {
    return new FormGroup({
      email: new FormControl(null),
      password: new FormControl(null, Validators.pattern(/\S+/))
    });
  }
  initSignupForm(): FormGroup {
    var confirmPasswordControl = new FormControl(null, Validators.pattern(/\S+/));
    var passwordControl = new FormControl(null, Validators.pattern(/\S+/));
    passwordControl.valueChanges.subscribe(value => {
      if (value) {
        if (this.confirmPasswordValidator) {
          confirmPasswordControl.removeValidators(this.confirmPasswordValidator);
        }
        this.confirmPasswordValidator = Validators.pattern(new RegExp(`^${value}$`));
        confirmPasswordControl.addValidators(this.confirmPasswordValidator);
        confirmPasswordControl.updateValueAndValidity();
      }
    })
    return new FormGroup({
      email: new FormControl(null),
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
        'email': '',
        'password': '',
        'generic': ''
      }
    };
    const controlsToMakeValid = ['email', 'password', 'generic'];
    controlsToMakeValid.forEach(control => {
      const removedError = JSON.stringify(this.getFormControl(control).errors).replace(/ *\"incorrect\": *true,? */, '');
      if (removedError === '{}') {
        this.getFormControl(control).setErrors(null);
      } else {
        this.getFormControl(control).setErrors(JSON.parse(removedError));
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
    if (!this.loginForm.valid) {
      return;
    }
    this.userService.logIn(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value).subscribe({
      next: (response) => this.router.navigate(['']),
      error: (error) => {
        console.log(error);
        this.handleErrorResponse(error.error.error.message);
      }
    });
  }
  signup() {
    console.log(this.signupForm);
    console.log(this.signupForm.valid ? 'Valid' : 'Invalid');
    if (!this.signupForm.valid) {
      return;
    }
    this.userService.signUp(this.signupForm.controls['email'].value, this.signupForm.controls['password'].value).subscribe({
      next: (response) => this.router.navigate(['']),
      error: (error) => {
        console.log(error);
        this.handleErrorResponse(error.error.error.message);
      }
    });
  }
  onChangePassword(event: Event) {
    // var passwordControl = <FormControl>this.signupForm.controls['password'];
    // if (passwordControl.value)
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
          this.getFormControl(control).setErrors({ 'incorrect': true });
        });
        break;
      case AuthType.LOGIN:
        errorControls.forEach(control => {
          this.errorMessages.login[control] = errorMessage;
          this.getFormControl(control).setErrors({ 'incorrect': true });
        });
        break;
    }
  }
  getFormControl(name: string): FormControl | FormGroup {
    switch (this.authState) {
      default:
      case AuthType.SIGNUP:
      case AuthType.UNDEFINED:
        if (name === 'generic') {
          return this.signupForm;
        }
        return this.signupForm.controls[name] as FormControl;
      case AuthType.LOGIN:
        if (name === 'generic') {
          return this.loginForm;
        }
        return this.loginForm.controls[name] as FormControl;
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
