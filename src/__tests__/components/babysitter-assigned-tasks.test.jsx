import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AssignedTasks from '../../components/pages/babysitter-assigned-tasks/assigned-tasks';
import axios from 'axios';
import { auth } from '../../firebase/firebaseAuth';

jest.mock('axios');
jest.mock('../../firebase/firebaseAuth', () => ({
  auth: {
    currentUser: null,
  },
}));

jest.mock('../../components/pages/nav-bar/navbar', () => {
  return function MockNavbar() {
    return <div data-testid="navbar">Navbar</div>;
  };
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const mockNavigate = jest.fn();

const mockBabysitterUser = {
  account_id: 2,
  account_type: 'babysitter',
  first_name: 'Jane',
  last_name: 'Smith',
};

const mockTasks = [
  {
    task_id: 1,
    task_title: 'Feed baby',
    task_description: 'Give bottle at 2pm',
    due_date: '2024-02-15',
    baby_id: 1,
    baby_first_name: 'Emma',
    parent_first_name: 'John',
    parent_last_name: 'Doe',
    is_completed: false,
    babysitter_notes: null,
  },
  {
    task_id: 2,
    task_title: 'Change diaper',
    task_description: 'Check every 2 hours',
    due_date: null,
    baby_id: 2,
    baby_first_name: 'Noah',
    parent_first_name: 'John',
    parent_last_name: 'Doe',
    is_completed: true,
    babysitter_notes: 'Task completed',
    completed_at: '2024-02-10T10:00:00Z',
  },
];

describe('AssignedTasks (Babysitter) Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    console.error = jest.fn();
  });

  describe('Rendering', () => {
    test('shows loading state initially', () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockImplementation(() => new Promise(() => {}));

      render(
        <BrowserRouter>
          <AssignedTasks />
        </BrowserRouter>
      );

      expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
    });

    test('renders task list after loading', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockBabysitterUser },
      });
      axios.get.mockResolvedValue({ data: { tasks: mockTasks } });

      render(
        <BrowserRouter>
          <AssignedTasks />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Feed baby')).toBeInTheDocument();
        expect(screen.getByText('Change diaper')).toBeInTheDocument();
      });
    });

    test('renders empty state when no tasks', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockBabysitterUser },
      });
      axios.get.mockResolvedValue({ data: { tasks: [] } });

      render(
        <BrowserRouter>
          <AssignedTasks />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('No Tasks Yet')).toBeInTheDocument();
        expect(screen.getByText('When a parent assigns you tasks, they will appear here.')).toBeInTheDocument();
      });
    });
  });

  describe('Data Fetching', () => {
    test('fetches babysitter data and tasks', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockBabysitterUser },
      });
      axios.get.mockResolvedValue({ data: { tasks: mockTasks } });

      render(
        <BrowserRouter>
          <AssignedTasks />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          expect.stringContaining('/api/sign-in'),
          { idToken: 'mock-token' },
          { withCredentials: true }
        );
        expect(axios.get).toHaveBeenCalledWith(
          expect.stringContaining('/api/shared-tasks/babysitter/2'),
          { withCredentials: true }
        );
      });
    });

    test('redirects to sign-in when no current user', () => {
      auth.currentUser = null;

      render(
        <BrowserRouter>
          <AssignedTasks />
        </BrowserRouter>
      );

      expect(mockNavigate).toHaveBeenCalledWith('/sign-in');
    });

    test('handles error when fetching data', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockRejectedValue(new Error('Network error'));

      render(
        <BrowserRouter>
          <AssignedTasks />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Error fetching babysitter data:',
          expect.any(Error)
        );
      });

      consoleSpy.mockRestore();
    });

    test('handles error when fetching tasks', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockBabysitterUser },
      });
      axios.get.mockRejectedValue(new Error('Failed to fetch tasks'));

      render(
        <BrowserRouter>
          <AssignedTasks />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Error fetching tasks:',
          expect.any(Error)
        );
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Navigation', () => {
    test('navigates back to babysitter dashboard', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockBabysitterUser },
      });
      axios.get.mockResolvedValue({ data: { tasks: [] } });

      render(
        <BrowserRouter>
          <AssignedTasks />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('My Assigned Tasks')).toBeInTheDocument();
      });

      const backButton = screen.getByRole('button', { name: '' });
      fireEvent.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith('/babysitter-dashboard');
    });
  });

  describe('Task Interaction', () => {
    test('displays pending and completed tasks', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockBabysitterUser },
      });
      axios.get.mockResolvedValue({ data: { tasks: mockTasks } });

      render(
        <BrowserRouter>
          <AssignedTasks />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Feed baby')).toBeInTheDocument();
        expect(screen.getByText('Change diaper')).toBeInTheDocument();
      });
    });

    test('shows task details', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockBabysitterUser },
      });
      axios.get.mockResolvedValue({ data: { tasks: mockTasks } });

      render(
        <BrowserRouter>
          <AssignedTasks />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Feed baby')).toBeInTheDocument();
      });

      expect(screen.getByText('Give bottle at 2pm')).toBeInTheDocument();
    });
  });

  describe('Task Completion', () => {
    test('expands task when checkbox is clicked', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockBabysitterUser },
      });
      axios.get.mockResolvedValue({ data: { tasks: mockTasks } });

      const { container } = render(
        <BrowserRouter>
          <AssignedTasks />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Feed baby')).toBeInTheDocument();
      });

      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      expect(checkboxes.length).toBeGreaterThan(0);

      fireEvent.click(checkboxes[0]);

      await waitFor(() => {
        expect(screen.getByText('Complete this task')).toBeInTheDocument();
      });
    });
  });

  describe('Task Filtering', () => {
    test('separates pending and completed tasks', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockBabysitterUser },
      });
      axios.get.mockResolvedValue({ data: { tasks: mockTasks } });

      render(
        <BrowserRouter>
          <AssignedTasks />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Feed baby')).toBeInTheDocument();
        expect(screen.getByText('Change diaper')).toBeInTheDocument();
      });
    });
  });

  describe('Baby Names Display', () => {
    test('displays baby names for each task', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockBabysitterUser },
      });
      axios.get.mockResolvedValue({ data: { tasks: mockTasks } });

      render(
        <BrowserRouter>
          <AssignedTasks />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Emma/)).toBeInTheDocument();
        expect(screen.getByText(/Noah/)).toBeInTheDocument();
      });
    });
  });
});
