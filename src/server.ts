import express, { Express, Request, Response } from 'express';
import axios from 'axios';

export const app: Express = express();
const PORT = 4000;
const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

export const closeServer = () => {
  server.close();
};

app.get('/users', async (req: Request, res: Response) => {
  try {
    const { data } = await axios.get('https://dummyjson.com/users');
    const departmentData: Record<string, Array<Record<string, unknown>>> = {};

    for (const user of data.users) {
      const { department } = user.company;
      if (!departmentData[department]) {
        departmentData[department] = [];
      }
      departmentData[department].push({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        company: user.company.name,
        department: user.company.department,
        title: user.company.title
      });
    }

    res.json(departmentData);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user data' });
  }
});