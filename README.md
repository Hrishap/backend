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
      "email": "janedoe@example.com"
    },
    "success": true
  }
  ```

---

## Environment Variables

The following environment variables are required for this app to work. Create a `.env` file in the root of your backend folder and provide these values:

| Variable Name            | Description                                 | Example Value / Notes                                  |
|--------------------------|---------------------------------------------|--------------------------------------------------------|
| `PORT`                   | Port number for the server                  | `8000`                                                 |
| `MONGODB_URI`            | MongoDB connection string                   | `mongodb+srv://user:password@cluster.mongodb.net/...`  |
| `CORS_ORIGIN`            | Allowed CORS origin(s)                      | `*` or your frontend URL                               |
| `ACCESS_TOKEN_SECRET`    | JWT secret for access tokens                | (random string)                                        |
| `ACCESS_TOKEN_EXPIRY`    | Access token expiry duration                | `1d`                                                   |
| `REFRESH_TOKEN_SECRET`   | JWT secret for refresh tokens               | (random string)                                        |
| `REFRESH_TOKEN_EXPIRY`   | Refresh token expiry duration               | `10d`                                                  |
| `CLOUDINARY_CLOUD_NAME`  | Cloudinary cloud name                       | (from Cloudinary dashboard)                            |
| `CLOUDINARY_API_KEY`     | Cloudinary API key                          | (from Cloudinary dashboard)                            |
| `CLOUDINARY_API_SECRET`  | Cloudinary API secret                       | (from Cloudinary dashboard)                            |

**Example `.env` file:**
```
PORT=8000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/?retryWrites=true&w=majority
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Notes

- All endpoints return a consistent response structure with `statusCode`, `message`, `data`, and `success`.
- Authentication is handled via HTTP-only cookies or `Authorization` header.
- File uploads (avatar, coverImage) must be sent as `multipart/form-data`.
- For protected routes, ensure to send the access token as a cookie or in the `Authorization` header.

---