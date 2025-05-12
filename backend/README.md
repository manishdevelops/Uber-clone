# Backend API Documentation

## Endpoints

### POST `/users/register`

This endpoint is used to register a new user.

#### Request Body

The request body should be sent in JSON format with the following fields:

```json
{
  "fullname": {
    "firstname": "string (required, min length: 3)",
    "lastname": "string (optional, min length: 3)"
  },
  "email": "string (required, valid email format)",
  "password": "string (required, min length: 6)"
}
```

#### Example Request

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "johndoe@example.com",
  "password": "password123"
}
```

#### Responses

| Status Code | Description                                                                            |
| ----------- | -------------------------------------------------------------------------------------- |
| 201         | User successfully registered. Returns a JSON object with the user's token and details. |
| 400         | Validation error or user already exists. Returns an error message.                     |

#### Example Success Response

```json
{
  "token": "jwt-token-string",
  "user": {
    "_id": "user-id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "johndoe@example.com"
  }
}
```

#### Example Error Response

```json
{
  "errors": [
    {
      "msg": "First name must be at least 3 characters long",
      "param": "fullname.firstname",
      "location": "body"
    }
  ]
}
```

#### Validation Rules

- `fullname.firstname`: Must be at least 3 characters long.
- `fullname.lastname`: Optional but must be at least 3 characters long if provided.
- `email`: Must be a valid email address.
- `password`: Must be at least 6 characters long.

#### Notes

- The `email` field must be unique. If a user with the provided email already exists, the API will return a `400` status code with the message: `User already exist`.
- Passwords are hashed before being stored in the database.

### POST `/users/login`

This endpoint is used to log in an existing user.

#### Request Body

The request body should be sent in JSON format with the following fields:

```json
{
  "email": "string (required, valid email format)",
  "password": "string (required, min length: 6)"
}
```

#### Example Request

```json
{
  "email": "johndoe@example.com",
  "password": "password123"
}
```

#### Responses

| Status Code | Description                                                                           |
| ----------- | ------------------------------------------------------------------------------------- |
| 200         | User successfully logged in. Returns a JSON object with the user's token and details. |
| 400         | Validation error. Returns an error message.                                           |
| 401         | Invalid email or password. Returns an error message.                                  |

#### Example Success Response

```json
{
  "token": "jwt-token-string",
  "user": {
    "_id": "user-id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "johndoe@example.com"
  }
}
```

#### Example Error Response

```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

#### Validation Rules

- `email`: Must be a valid email address.
- `password`: Must be at least 6 characters long.


### GET `/users/profile`

This endpoint is used to retrieve the profile of the currently logged-in user.

#### Headers

- `Authorization`: Bearer token (required)

#### Responses

| Status Code | Description                                |
| ----------- | ------------------------------------------ |
| 200         | Successfully retrieved user profile.       |
| 401         | Unauthorized. Token is missing or invalid. |

#### Example Success Response

```json
{
  "_id": "user-id",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "johndoe@example.com"
}
```

---

### GET `/users/logout`

This endpoint is used to log out the currently logged-in user.

#### Headers

- `Authorization`: Bearer token (required)

#### Responses

| Status Code | Description                                |
| ----------- | ------------------------------------------ |
| 200         | Successfully logged out.                   |
| 401         | Unauthorized. Token is missing or invalid. |

#### Example Success Response

```json
{
  "message": "Logged out"
}
```

---

### POST `/users/forgot-password`

This endpoint is used to request a password reset link.

#### Request Body

The request body should be sent in JSON format with the following fields:

```json
{
  "email": "string (required, valid email format)",
  "frontendUrl": "string (required, URL of the frontend reset password page)"
}
```

#### Example Request

```json
{
  "email": "johndoe@example.com",
  "frontendUrl": "http://example.com/reset-password"
}
```

#### Responses

| Status Code | Description                                    |
| ----------- | ---------------------------------------------- |
| 200         | Password reset token sent to the user's email. |
| 404         | User with the provided email does not exist.   |
| 500         | Error sending the email.                       |

#### Example Success Response

```json
{
  "status": "success",
  "message": "Token sent to email!"
}
```

#### Example Error Response

```json
{
  "message": "User no longer exist."
}
```

---

### PATCH `/users/reset-password/:token`

This endpoint is used to reset the user's password using the reset token.

#### Request Parameters

- `token`: The password reset token sent to the user's email (required).

#### Request Body

The request body should be sent in JSON format with the following fields:

```json
{
  "password": "string (required, min length: 6)"
}
```

#### Example Request

```json
{
  "password": "newpassword123"
}
```

#### Responses

| Status Code | Description                                       |
| ----------- | ------------------------------------------------- |
| 201         | Password successfully reset. Returns a new token. |
| 400         | Token is invalid or has expired.                  |

#### Example Success Response

```json
{
  "token": "jwt-token-string",
  "user": {
    "_id": "user-id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "johndoe@example.com"
  }
}
```

#### Example Error Response

```json
{
  "message": "Token is invalid or has expired"
}
```