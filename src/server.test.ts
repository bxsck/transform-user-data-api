import request from 'supertest';
import { Express } from 'express';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { app, closeServer } from './server'; 

const mock = new MockAdapter(axios);

describe('GET /users', () => {
  let server: Express;

  beforeAll(() => {
    server = app;
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    closeServer();
  });

  it('should group users by department', async () => {
    const users = [
      {
        id: 1,
        firstName: "Emily",
        lastName: "Johnson",
        email: "emily.johnson@x.dummyjson.com",
        company: {
          department: "Engineering",
          name: "Dooley, Kozey and Cronin",
          title: "Sales Manager",
        },
      },
      {
        id: 2,
        firstName: "Michael",
        lastName: "Williams",
        email: "michael.williams@x.dummyjson.com",
        company: {
          department: "Support",
          name: "Spinka - Dickinson",
          title: "Support Specialist",
        },
      },
    ];

    mock.onGet('https://dummyjson.com/users').reply(200, { users });

    const response = await request(server).get('/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      Engineering: [
        {
          id: 1,
          firstName: "Emily",
          lastName: "Johnson",
          email: "emily.johnson@x.dummyjson.com",
          company: "Dooley, Kozey and Cronin",
          department: "Engineering",
          title: "Sales Manager",
        },
      ],
      Support: [
        {
          id: 2,
          firstName: "Michael",
          lastName: "Williams",
          email: "michael.williams@x.dummyjson.com",
          company: "Spinka - Dickinson",
          department: "Support",
          title: "Support Specialist",
        },
      ],
    });
  });

  it('should return 500 if there is an error fetching user data', async () => {
    mock.onGet('https://dummyjson.com/users').reply(500);

    const response = await request(server).get('/users');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Error fetching user data' });
  });
});