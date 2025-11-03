import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-primary-dark text-white">
      <h1 className="mb-4 font-display text-9xl font-bold text-accent-violet">
        404
      </h1>
      <h2 className="mb-2 font-display text-4xl font-semibold">
        Page Not Found
      </h2>
      <p className="mb-8 text-lg text-gray-400">
        Sorry, the page you are looking for does not exist.
      </p>
      <Button
        as={Link}
        to="/dashboard"
        variant="gradient"
        className="text-lg"
      >
        <i className="ri-arrow-left-line mr-2"></i>
        Go to Dashboard
      </Button>
    </div>
  );
}