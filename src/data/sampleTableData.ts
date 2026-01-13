export interface EmployeeData {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  hireDate: string;
  country: string;
  city: string;
  phone: string;
  age: number;
  experience: number;
  performance: number;
  projects: number;
  status: string;
  manager: string;
  skills: string;
  education: string;
  certification: string;
}

const departments = ["Engineering", "Sales", "Marketing", "HR", "Finance", "Operations"];
const positions = ["Manager", "Senior", "Junior", "Lead", "Specialist", "Analyst"];
const countries = ["USA", "Japan", "UK", "Germany", "France", "Canada", "Australia"];
const cities = ["Tokyo", "New York", "London", "Berlin", "Paris", "Toronto", "Sydney"];
const statuses = ["Active", "On Leave", "Remote", "In Office"];
const skills = ["JavaScript", "Python", "Java", "React", "SQL", "AWS", "Docker"];
const educations = ["Bachelor", "Master", "PhD", "Associate"];
const certifications = ["PMP", "AWS", "Scrum Master", "Six Sigma", "ITIL"];

const firstNames = ["John", "Jane", "Michael", "Emily", "David", "Sarah", "Robert", "Lisa", "William", "Emma", "James", "Olivia", "Daniel", "Sophia", "Thomas", "Isabella", "Christopher", "Ava", "Matthew", "Mia"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

export function generateSampleData(count: number = 100): EmployeeData[] {
  const data: EmployeeData[] = [];

  for (let i = 1; i <= count; i++) {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const department = randomItem(departments);

    data.push({
      id: i,
      employeeId: `EMP${String(i).padStart(5, '0')}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      department,
      position: randomItem(positions),
      salary: randomInt(40000, 150000),
      hireDate: generateRandomDate(new Date(2015, 0, 1), new Date(2024, 11, 31)),
      country: randomItem(countries),
      city: randomItem(cities),
      phone: `+${randomInt(1, 99)}-${randomInt(100, 999)}-${randomInt(1000, 9999)}`,
      age: randomInt(22, 65),
      experience: randomInt(0, 30),
      performance: Math.round(Math.random() * 100),
      projects: randomInt(0, 50),
      status: randomItem(statuses),
      manager: `${randomItem(firstNames)} ${randomItem(lastNames)}`,
      skills: Array.from({ length: randomInt(2, 5) }, () => randomItem(skills)).join(", "),
      education: randomItem(educations),
      certification: randomItem(certifications),
    });
  }

  return data;
}

export const sampleData = generateSampleData(100);
