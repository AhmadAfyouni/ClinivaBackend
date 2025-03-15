import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from "../src/app.module";

describe('Clinic Management System (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply validation globally (same as in main.ts)
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // ✅ Test Root Route
  it('/ (GET) should return Hello World', () => {
    return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
  });

  // ✅ Test Creating an Employee (POST /employees)
  it('/employees (POST) should create a new employee', async () => {
    const employeeData = {
      name: 'John Doe',
      phone: '123-456-7890',
      jobTitle: 'Software Engineer',
      workingHours: [
        { day: 'Monday', startTime: '09:00', endTime: '17:00' },
      ],
    };

    const response = await request(app.getHttpServer())
        .post('/api/v1/employees')
        .send(employeeData)
        .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe(employeeData.name);
  });

  // ✅ Test Fetching Employees (GET /employees)
  it('/employees (GET) should return employees list', async () => {
    const response = await request(app.getHttpServer())
        .get('/api/v1/employees')
        .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  // ✅ Test Unauthorized Access
  it('/employees (GET) should return 401 Unauthorized if no JWT token', () => {
    return request(app.getHttpServer())
        .get('/api/v1/employees')
        .expect(401);
  });
});
