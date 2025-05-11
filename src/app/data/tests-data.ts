// Import the production test data
import prodTestsData from './prod-tests-questions.json';

// Define the test interface based on our application needs
export interface TestOption {
  label: string;
  score?: number;
}

export interface TestQuestion {
  id: number;
  text: string;
  dimension?: string;
  options: TestOption[];
}

export interface Test {
  id: number;
  name: string;
  description: string;
  route: string;
  code?: string;
  dimensions?: string[];
  questions: TestQuestion[];
  // Colors for the planets in the solar system
  color?: string;
  // Speed and size for animation
  speed?: number;
  size?: number;
}

// Map the tests with additional UI properties
const planetColors = ["#7be495", "#4f8cff", "#ffb347", "#ff6f69", "#a580ff", "#67dfe0"];

export const testsData: Test[] = prodTestsData.tests.map((test, index) => ({
  ...test,
  // Ensure the route follows our app format
  route: test.route.replace('/test/', ''),
  // Add UI properties
  color: planetColors[index % planetColors.length],
  speed: 0.05 + Math.random() * 0.05,
  size: 80 + (index % 3) * 12
}));

export default testsData; 