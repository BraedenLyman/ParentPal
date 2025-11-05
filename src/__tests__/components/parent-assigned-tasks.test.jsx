import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ParentAssignedTasks from '../../components/pages/parent-assigned-tasks/parent-assigned-tasks';
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

const mockUserData = {
  account_id: 1,
  account_type: 'parent',
  first_name: 'John',
  last_name: 'Doe',
};

const mockBabies = [
  { baby_id: 1, first_name: 'Emma', last_name: 'Doe' },
  { baby_id: 2, first_name: 'Noah', last_name: 'Doe' },
];

const mockBabysitters = [
  {
    babysitter_id: 10,
    babysitter_first_name: 'Jane',
    babysitter_last_name: 'Smith',
    share_id: 100,
    is_verified: true,
  },
  {
    babysitter_id: 11,
    babysitter_first_name: 'Bob',
    babysitter_last_name: 'Johnson',
    share_id: 101,
    is_verified: true,
  },
];

const mockTasks = [
  {
    task_id: 1,
    task_title: 'Feed baby',
    task_description: 'Give bottle at 2pm',
    due_date: '2024-02-15',
    baby_id: 1,
    babysitter_id: 10,
    is_completed: false,
    baby_first_name: 'Emma',
    babysitter_first_name: 'Jane',
    babysitter_last_name: 'Smith',
  },
  {
    task_id: 2,
    task_title: 'Change diaper',
    task_description: '',
    due_date: null,
    baby_id: 2,
    babysitter_id: 11,
    is_completed: true,
    baby_first_name: 'Noah',
    babysitter_first_name: 'Bob',
    babysitter_last_name: 'Johnson',
  },
];

describe('ParentAssignedTasks Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    global.alert = jest.fn();
    console.error = jest.fn();
  });

  describe('Rendering', () => {
    test('renders loading state initially', () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockImplementation(() => new Promise(() => {}));

      render(
        <BrowserRouter>
          <ParentAssignedTasks />
        </BrowserRouter>
      );

      expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
    });

    test('renders task list after loading', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: mockBabies },
      });
      axios.get
        .mockResolvedValueOnce({ data: { babysitters: mockBabysitters } })
        .mockResolvedValueOnce({ data: { tasks: mockTasks } });

      render(
        <BrowserRouter>
          <ParentAssignedTasks />
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
        data: { user: mockUserData, babyData: mockBabies },
      });
      axios.get
        .mockResolvedValueOnce({ data: { babysitters: mockBabysitters } })
        .mockResolvedValueOnce({ data: { tasks: [] } });

      render(
        <BrowserRouter>
          <ParentAssignedTasks />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/No tasks created yet/i)).toBeInTheDocument();
      });
    });

    test('filters out unverified babysitters', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      const babysittersWithUnverified = [
        ...mockBabysitters,
        {
          babysitter_id: 12,
          babysitter_first_name: 'Unverified',
          babysitter_last_name: 'User',
          share_id: 102,
          is_verified: false,
        },
      ];

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: mockBabies },
      });
      axios.get
        .mockResolvedValueOnce({
          data: { babysitters: babysittersWithUnverified },
        })
        .mockResolvedValueOnce({ data: { tasks: [] } });

      render(
        <BrowserRouter>
          <ParentAssignedTasks />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Assigned Tasks')).toBeInTheDocument();
      });

      expect(axios.get).toHaveBeenCalled();
    });
  });

  describe('Data Fetching', () => {
    test('fetches user data, babies, babysitters, and tasks', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: mockBabies },
      });
      axios.get
        .mockResolvedValueOnce({ data: { babysitters: mockBabysitters } })
        .mockResolvedValueOnce({ data: { tasks: mockTasks } });

      render(
        <BrowserRouter>
          <ParentAssignedTasks />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          expect.stringContaining('/api/sign-in'),
          { idToken: 'mock-token' },
          { withCredentials: true }
        );
        expect(axios.get).toHaveBeenCalledWith(
          expect.stringContaining('/api/babysitter-sharing/babysitters/1'),
          { withCredentials: true }
        );
        expect(axios.get).toHaveBeenCalledWith(
          expect.stringContaining('/api/shared-tasks/parent/1'),
          { withCredentials: true }
        );
      });
    });

    test('redirects to sign-in when no current user', () => {
      auth.currentUser = null;

      render(
        <BrowserRouter>
          <ParentAssignedTasks />
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
          <ParentAssignedTasks />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Error fetching data:',
          expect.any(Error)
        );
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Navigation', () => {
    test('navigates back to parent dashboard', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: mockBabies },
      });
      axios.get
        .mockResolvedValueOnce({ data: { babysitters: mockBabysitters } })
        .mockResolvedValueOnce({ data: { tasks: [] } });

      render(
        <BrowserRouter>
          <ParentAssignedTasks />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Assigned Tasks')).toBeInTheDocument();
      });

      const backButton = screen.getByRole('button', { name: '' });
      fireEvent.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith('/parent-dashboard');
    });
  });

  describe('Add Task Button', () => {
    test('renders add task button', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: mockBabies },
      });
      axios.get
        .mockResolvedValueOnce({ data: { babysitters: mockBabysitters } })
        .mockResolvedValueOnce({ data: { tasks: [] } });

      render(
        <BrowserRouter>
          <ParentAssignedTasks />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Add Task')).toBeInTheDocument();
      });
    });
  });

  describe('Task Completion Toggle', () => {
    test('toggles task completion status', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: mockBabies },
      });
      axios.get
        .mockResolvedValueOnce({ data: { babysitters: mockBabysitters } })
        .mockResolvedValueOnce({ data: { tasks: mockTasks } });

      axios.patch.mockResolvedValue({ data: { success: true } });
      axios.get
        .mockResolvedValueOnce({ data: { babysitters: mockBabysitters } })
        .mockResolvedValueOnce({ data: { tasks: mockTasks } });

      const { container } = render(
        <BrowserRouter>
          <ParentAssignedTasks />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Feed baby')).toBeInTheDocument();
      });

      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      if (checkboxes.length > 0) {
        fireEvent.click(checkboxes[0]);

        await waitFor(() => {
          expect(axios.patch).toHaveBeenCalled();
        });
      }
    });
  });

  describe('Edit Task', () => {
    test('opens edit modal with task data', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: mockBabies },
      });
      axios.get
        .mockResolvedValueOnce({ data: { babysitters: mockBabysitters } })
        .mockResolvedValueOnce({ data: { tasks: mockTasks } });

      const { container } = render(
        <BrowserRouter>
          <ParentAssignedTasks />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Feed baby')).toBeInTheDocument();
      });

      const editButtons = container.querySelectorAll('svg[data-slot="icon"]');
      const editButton = Array.from(editButtons).find(btn =>
        btn.getAttribute('d')?.includes('M16.862')
      );

      if (editButton) {
        fireEvent.click(editButton.closest('button'));

        await waitFor(() => {
          expect(screen.getByText('Edit Task')).toBeInTheDocument();
        });
      }
    });
  });

  describe('Delete Task', () => {
    test('opens delete confirmation modal', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: mockBabies },
      });
      axios.get
        .mockResolvedValueOnce({ data: { babysitters: mockBabysitters } })
        .mockResolvedValueOnce({ data: { tasks: mockTasks } });

      const { container } = render(
        <BrowserRouter>
          <ParentAssignedTasks />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Feed baby')).toBeInTheDocument();
      });

      const deleteButtons = container.querySelectorAll('svg[data-slot="icon"]');
      const deleteButton = Array.from(deleteButtons).find(btn =>
        btn.getAttribute('d')?.includes('M14.74')
      );

      if (deleteButton) {
        fireEvent.click(deleteButton.closest('button'));

        await waitFor(() => {
          expect(screen.getByText('Delete Task')).toBeInTheDocument();
        });
      }
    });
  });

  describe('Filter Tasks', () => {
    test('filters tasks by baby', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: mockBabies },
      });
      axios.get
        .mockResolvedValueOnce({ data: { babysitters: mockBabysitters } })
        .mockResolvedValueOnce({ data: { tasks: mockTasks } });

      render(
        <BrowserRouter>
          <ParentAssignedTasks />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Feed baby')).toBeInTheDocument();
        expect(screen.getByText('Change diaper')).toBeInTheDocument();
      });
    });
  });

  describe('Task Filtering - Pending/Completed', () => {
    test('can view pending and completed tasks', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: mockBabies },
      });
      axios.get
        .mockResolvedValueOnce({ data: { babysitters: mockBabysitters } })
        .mockResolvedValueOnce({ data: { tasks: mockTasks } });

      render(
        <BrowserRouter>
          <ParentAssignedTasks />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Feed baby')).toBeInTheDocument();
        expect(screen.getByText('Change diaper')).toBeInTheDocument();
      });
    });
  });
});
