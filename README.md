# carkus-backend

## API Endpoints

| Method | Endpoint                                                | Description                   | Additional Info         |
| ------ | ------------------------------------------------------- | ----------------------------- | ----------------------- |
| POST   | /auth/login                                             | Login                         |                         |
| POST   | /auth/register                                          | Register                      |                         |
| GET    | /campus                                                 | Get all campuses              |                         |
| GET    | /campus/:campusId                                       | Get a campus by id            |                         |
| POST   | /campus                                                 | Create a campus               | Requires Authentication |
| PUT    | /campus/:campusId                                       | Update a campus               | Requires Authentication |
| DELETE | /campus/:campusId                                       | Delete a campus               | Requires Authentication |
| GET    | /campus/:campusId/threads                               | Get all threads               |                         |
| GET    | /campus/:campusId/threads/:threadId                     | Get a thread by id            |                         |
| POST   | /campus/:campusId/threads                               | Create a thread               | Requires Authentication |
| PUT    | /campus/:campusId/threads/:threadId                     | Update a thread               | Requires Authentication |
| DELETE | /campus/:campusId/threads/:threadId                     | Delete a thread               | Requires Authentication |
| GET    | /campus/:campusId/threads/:threadId/comments            | Get all comments for a thread |                         |
| GET    | /campus/:campusId/threads/:threadId/comments/:commentId | Get a comment by id           |                         |
| POST   | /campus/:campusId/threads/:threadId/comments            | Create a comment              | Requires Authentication |
| PUT    | /campus/:campusId/threads/:threadId/comments/:commentId | Update a comment              | Requires Authentication |
| DELETE | /campus/:campusId/threads/:threadId/comments/:commentId | Delete a comment              | Requires Authentication |
| GET    | /users                                                  | Get all users                 |                         |
| GET    | /users/:id                                              | Get a user by id              |                         |

## Environment Variables

| Name       | Description               |
| ---------- | ------------------------- |
| PORT       | Server Port               |
| JWT_SECRET | JWT Secret                |
| MONGO_URL  | MongoDB Connection String |
