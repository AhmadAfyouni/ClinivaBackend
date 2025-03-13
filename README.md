#  CLINIC MANAGEMENT SYSTEM 🏥 - README

## 📌 Introduction
This project is a **Clinic Management System** built using **NestJS**, **MongoDB**, and **JWT Authentication**. The system provides a structured hierarchy for **companies, clinic collections, departments, and clinics**. It also includes **user management**, **roles and permissions**, and a secure **authentication system** using **JWT**.

---

## 📂 Project Structure

```
/src
│── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── jwt.strategy.ts
│   │   ├── local.strategy.ts
│   │   ├── jwt-auth.guard.ts
│   │   ├── dtos/
│   │   │   ├── login.dto.ts
│   │   │   ├── register.dto.ts
│   │   │   ├── refresh-token.dto.ts
│   │   ├── interfaces/
│   │   │   ├── jwt-payload.interface.ts
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   ├── schemas/
│   │   │   ├── user.schema.ts
│   │   ├── dtos/
│   │   │   ├── create-user.dto.ts
│   │   │   ├── update-user.dto.ts
│   ├── roles/
│   │   ├── roles.controller.ts
│   │   ├── roles.service.ts
│   │   ├── roles.module.ts
│   │   ├── schemas/
│   │   │   ├── role.schema.ts
│   ├── permissions/
│   │   ├── permissions.enum.ts
│   ├── clinics/
│   │   ├── clinics.controller.ts
│   │   ├── clinics.service.ts
│   │   ├── clinics.module.ts
│   ├── appointments/
│   │   ├── appointments.controller.ts
│   │   ├── appointments.service.ts
│   │   ├── appointments.module.ts
│── config/
│   ├── permissions-group.enum.ts
│── common/
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│── main.ts
│── app.module.ts
```

---

## 🔐 Authentication & Authorization (JWT)
### 🔹 How JWT Works
1. **User Registration** (`POST /auth/register`)
    - User provides **name, email, password, and role(s)**.
    - Password is **hashed** using **bcrypt** before saving in the database.
    - User gets saved in the **users collection**.

2. **User Login** (`POST /auth/login`)
    - User provides **email & password**.
    - Password is verified using **bcrypt.compare()**.
    - If credentials are correct:
        - An **Access Token** (valid for 15 mins) is generated.
        - A **Refresh Token** (valid for 7 days) is generated.

3. **Using JWT for Authentication**
    - The user sends the **Access Token** in the `Authorization` header:
      ```
      Authorization: Bearer <access_token>
      ```
    - The token is **verified** using `JwtStrategy` in NestJS.
    - If valid, the request proceeds; otherwise, it is **rejected**.

4. **Refreshing Token** (`POST /auth/refresh`)
    - If the **Access Token** expires, the user sends a request with the **Refresh Token**.
    - A new **Access Token** is issued.
    - This prevents users from needing to log in again frequently.

---

## 🛠 Roles & Permissions
The system has **dynamic roles** and **grouped permissions**, meaning an admin can create a role with custom permissions.

### 🎭 Default Roles:
1. **Admin** (Full Access)
2. **Clinic Manager** (Manages clinics, doctors, and staff)
3. **Doctor** (Manages patients, appointments, medical records)
4. **Receptionist** (Handles appointments and patient info)
5. **Billing Officer** (Handles invoices and payments)
6. **Inventory Manager** (Manages stock and medical supplies)
7. **Call Center Agent** (Handles patient inquiries and bookings)

### 🔑 Example Permissions Enum:
```typescript
export enum PermissionsEnum {
    USER_CREATE = 'user_create',
    USER_UPDATE = 'user_update',
    USER_DELETE = 'user_delete',
    USER_VIEW = 'user_view',

    CLINIC_CREATE = 'clinic_create',
    CLINIC_UPDATE = 'clinic_update',
    CLINIC_DELETE = 'clinic_delete',
    CLINIC_VIEW = 'clinic_view',

    APPOINTMENT_CREATE = 'appointment_create',
    APPOINTMENT_UPDATE = 'appointment_update',
    APPOINTMENT_DELETE = 'appointment_delete',
    APPOINTMENT_VIEW = 'appointment_view',
}
```

### 🔖 Example Permission Groups:
```typescript
export enum PermissionsGroupEnum {
    USER_MANAGEMENT = [
        PermissionsEnum.USER_CREATE,
        PermissionsEnum.USER_UPDATE,
        PermissionsEnum.USER_DELETE,
        PermissionsEnum.USER_VIEW
    ],
    CLINIC_MANAGEMENT = [
        PermissionsEnum.CLINIC_CREATE,
        PermissionsEnum.CLINIC_UPDATE,
        PermissionsEnum.CLINIC_DELETE,
        PermissionsEnum.CLINIC_VIEW
    ],
}
```

---

## 📌 API Endpoints

### 🔹 Auth Endpoints (`/auth`)
| Method | Endpoint         | Description            |
|--------|----------------|------------------------|
| POST   | `/auth/register` | Register a new user   |
| POST   | `/auth/login`    | Login & get tokens    |
| POST   | `/auth/refresh`  | Get new access token  |

### 🔹 User Management (`/users`)
| Method | Endpoint        | Description              |
|--------|----------------|--------------------------|
| GET    | `/users`        | Get all users           |
| GET    | `/users/:id`    | Get a specific user     |
| POST   | `/users`        | Create a new user       |
| PATCH  | `/users/:id`    | Update user details     |
| DELETE | `/users/:id`    | Delete a user           |

### 🔹 Roles & Permissions (`/roles`)
| Method | Endpoint        | Description              |
|--------|----------------|--------------------------|
| GET    | `/roles`        | Get all roles           |
| GET    | `/roles/:id`    | Get a specific role     |
| POST   | `/roles`        | Create a new role       |
| PATCH  | `/roles/:id`    | Update role permissions |
| DELETE | `/roles/:id`    | Delete a role           |

### 🔹 Clinics (`/clinics`)
| Method | Endpoint         | Description              |
|--------|-----------------|--------------------------|
| GET    | `/clinics`      | Get all clinics         |
| GET    | `/clinics/:id`  | Get a specific clinic   |
| POST   | `/clinics`      | Create a new clinic     |
| PATCH  | `/clinics/:id`  | Update clinic details   |
| DELETE | `/clinics/:id`  | Delete a clinic         |

### 🔹 Appointments (`/appointments`)
| Method | Endpoint             | Description                  |
|--------|---------------------|------------------------------|
| GET    | `/appointments`     | Get all appointments        |
| GET    | `/appointments/:id` | Get appointment details     |
| POST   | `/appointments`     | Schedule a new appointment |
| PATCH  | `/appointments/:id` | Update appointment status  |
| DELETE | `/appointments/:id` | Cancel an appointment      |

---

## 🚀 Installation & Running the Project

### 1️⃣ Install Dependencies
```sh
npm install
```

### 2️⃣ Run the Development Server
```sh
npm run start:dev
```



## 📌 Conclusion
This **Clinic Management System** provides a **secure, scalable, and flexible** structure for handling **authentication, user management, roles & permissions, clinics, appointments, and patient records**.


---
