# User API Documentation

Base URL: `/api/v1/users`

---

## Endpoints

### 1. Register User

- **URL:** `/register`
- **Method:** `POST`
- **Description:** Register a new user with avatar and optional cover image.
- **Request Type:** `multipart/form-data`
- **Fields:**
  - `fullName` (string, required)
  - `email` (string, required)
  - `username` (string, required)
  - `password` (string, required)
  - `avatar` (file, required)
  - `coverImage` (file, optional)
- **Status Codes:** `201`, `400`, `409`, `500`
- **Example Request (form-data):**
  ```
  fullName: John Doe
  email: johndoe@example.com
  username: johndoe
  password: password123
  avatar: [file]
  coverImage: [file]
  ```
- **Example Success Response:**
  ```json
  {
    "statusCode": 201,
    "message": "User registered succesfully",
    "data": {
      "_id": "user_id",
      "fullName": "John Doe",
      "email": "johndoe@example.com",
      "username": "johndoe",
      "avatar": "https://cloudinary.com/avatar.jpg",
      "coverImage": "https://cloudinary.com/cover.jpg",
      "createdAt": "...",
      "updatedAt": "..."
    },
    "success": true
  }
  ```

---

### 2. Login User

- **URL:** `/login`
- **Method:** `POST`
- **Description:** Login with username or email and password.
- **Request Type:** `application/json`
- **Fields:**
  - `userName` (string, optional if email is provided)
  - `email` (string, optional if userName is provided)
  - `password` (string, required)
- **Status Codes:** `200`, `401`, `404`, `500`
- **Example Request:**
  ```json
  {
    "userName": "johndoe",
    "password": "password123"
  }
  ```
- **Example Success Response:**
  ```json
  {
    "statusCode": 200,
    "message": "User Logged in successfully",
    "data": {
      "user": {
        "_id": "user_id",
        "fullName": "John Doe",
        "email": "johndoe@example.com",
        "username": "johndoe",
        "avatar": "...",
        "coverImage": "...",
        "createdAt": "...",
        "updatedAt": "..."
      },
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    },
    "success": true
  }
  ```

---

### 3. Logout User

- **URL:** `/logout`
- **Method:** `POST`
- **Description:** Logout the current user (requires authentication).
- **Headers:** `Authorization: Bearer <accessToken>` or cookie
- **Status Codes:** `200`
- **Example Success Response:**
  ```json
  {
    "statusCode": 200,
    "message": "User logout",
    "data": {},
    "success": true
  }
  ```

---

### 4. Refresh Access Token

- **URL:** `/refresh-token`
- **Method:** `POST`
- **Description:** Get a new access token using a refresh token.
- **Request Type:** `application/json` or cookie
- **Fields:**
  - `refreshToken` (string, required if not in cookie)
- **Status Codes:** `200`, `401`, `404`
- **Example Request:**
  ```json
  {
    "refreshToken": "jwt_refresh_token"
  }
  ```
- **Example Success Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Access token refreshed successfully",
    "data": {
      "accessToken": "new_jwt_access_token",
      "newRefreshToken": "new_jwt_refresh_token"
    },
    "success": true
  }
  ```

---

### 5. Change User Password

- **URL:** `/change-password`
- **Method:** `POST`
- **Description:** Change the password for the current user (requires authentication).
- **Headers:** `Authorization: Bearer <accessToken>` or cookie
- **Fields:**
  - `oldPassword` (string, required)
  - `newPassword` (string, required)
- **Status Codes:** `200`, `400`, `401`, `404`
- **Example Request:**
  ```json
  {
    "oldPassword": "password123",
    "newPassword": "newpassword456"
  }
  ```
- **Example Success Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Password Changed Succesfully",
    "data": {},
    "success": true
  }
  ```

---

### 6. Update User Details

- **URL:** `/update-details`
- **Method:** `PATCH`
- **Description:** Update the user's full name and email (requires authentication).
- **Headers:** `Authorization: Bearer <accessToken>` or cookie
- **Fields:**
  - `fullName` (string, required)
  - `email` (string, required)
- **Status Codes:** `200`, `400`
- **Example Request:**
  ```json
  {
    "fullName": "Jane Doe",
    "email": "janedoe@example.com"
  }
  ```
- **Example Success Response:**
  ```json
  {
    "statusCode": 200,
    "message": "User details updated sucessfully",
    "data": {
      "_id": "user_id",
      "fullName": "Jane Doe",
      "email": "janedoe@example.com",
      ...
    },
    "success": true
  }
  ```

---

## Notes

- All endpoints return a consistent response structure with `statusCode`, `message`, `data`, and `success`.
- Authentication is handled via HTTP-only cookies or `Authorization` header.
- File uploads (avatar, coverImage) must be sent as `multipart/form-data`.
- For protected routes, ensure to send the access token as a cookie or in the `Authorization