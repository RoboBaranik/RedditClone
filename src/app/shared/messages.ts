export const messages: {
  error: {
    controlTypes: {
      email: string,
      password: string,
      generic: string
    },
    requestError: {
      [key: string]: {
        message: string,
        controls: string[]
      }
    },
    basicErrorsByControl: {
      [key: string]: {
        error: string,
        basicErrorCode: string
      }[]
    },
    basicError: {
      [key: string]: {
        message: string,
        controls: string[]
      }
    },
    unexpectedErrorMessage: string
  }
} = {
  error: {
    controlTypes: {
      email: 'email',
      password: 'password',
      generic: 'generic'
    },
    requestError: {
      'EMAIL_EXISTS': {
        message: 'Email already in use',
        controls: ['email']
      },
      'OPERATION_NOT_ALLOWED': {
        message: 'You are not allowed to perform this operation',
        controls: ['generic']
      },
      'TOO_MANY_ATTEMPTS_TRY_LATER': {
        message: 'Too many attempts! Try again later',
        controls: ['generic']
      },
      'EMAIL_NOT_FOUND': {
        message: 'Redditor does not exist or has different password',
        controls: ['email', 'password']
      },
      'INVALID_PASSWORD': {
        message: 'Redditor does not exist or has different password',
        controls: ['email', 'password']
      },
      'USER_DISABLED': {
        message: 'Redditor has been banned',
        controls: ['email']
      }
    },
    basicErrorsByControl: {
      'name': [
        { error: 'required', basicErrorCode: 'REQUIRED' },
        { error: 'minlength', basicErrorCode: 'USERNAME_TOO_SHORT' },
        { error: 'pattern', basicErrorCode: 'USERNAME_INVALID' }
      ],
      'email': [
        { error: 'required', basicErrorCode: 'REQUIRED' },
        { error: 'email', basicErrorCode: 'EMAIL_INVALID' }
      ],
      'password': [
        { error: 'required', basicErrorCode: 'REQUIRED' },
        { error: 'minlength', basicErrorCode: 'PASSWORD_TOO_SHORT' },
      ],
      'confirmPassword': [
        { error: 'required', basicErrorCode: 'REQUIRED' },
        { error: 'minlength', basicErrorCode: 'PASSWORD_TOO_SHORT' },
        { error: 'pattern', basicErrorCode: 'PASSWORDS_NOT_MATCHING' }
      ]
    },
    basicError: {
      'USERNAME_TOO_SHORT': {
        message: 'Username is too short',
        controls: ['name']
      },
      'USERNAME_INVALID': {
        message: 'Invalid username. Valid characters: a-z, A-Z, 0-9, -, _',
        controls: ['name']
      },
      'EMAIL_INVALID': {
        message: 'Invalid email',
        controls: ['email']
      },
      'PASSWORD_TOO_SHORT': {
        message: 'Password is too short',
        controls: ['password', 'confirmPassword']
      },
      'PASSWORDS_NOT_MATCHING': {
        message: 'Passwords does not match',
        controls: ['confirmPassword']
      },
      'REQUIRED': {
        message: 'This field is required',
        controls: ['name', 'email', 'password', 'confirmPassword']
      }
    },
    unexpectedErrorMessage: 'Unexpected error occurred'
  }
}