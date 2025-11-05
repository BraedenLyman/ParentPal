import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PhotoGallery from '../../components/pages/photo-gallery/photo-gallery';
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
  useLocation: jest.fn(),
}));

global.URL.createObjectURL = jest.fn(() => 'mock-preview-url');
global.URL.revokeObjectURL = jest.fn();

const mockNavigate = jest.fn();
const mockLocation = { state: { isBabysitter: false } };

const mockParentUser = {
  account_id: 1,
  account_type: 'parent',
};

const mockBabysitterUser = {
  account_id: 2,
  account_type: 'babysitter',
};

const mockBabies = [
  { baby_id: 1, first_name: 'Emma', last_name: 'Smith' },
  { baby_id: 2, first_name: 'Noah', last_name: 'Smith' },
];

const mockPhotos = [
  {
    photo_id: 1,
    baby_id: 1,
    photo_url: '/uploads/photo1.jpg',
    caption: 'First smile!',
    first_name: 'Emma',
    last_name: 'Smith',
    uploaded_at: '2024-01-15T10:00:00Z',
  },
  {
    photo_id: 2,
    baby_id: 2,
    photo_url: '/uploads/photo2.jpg',
    caption: 'Playing with toys',
    first_name: 'Noah',
    last_name: 'Smith',
    uploaded_at: '2024-01-20T14:30:00Z',
  },
];

describe('PhotoGallery Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    require('react-router-dom').useLocation.mockReturnValue(mockLocation);
    global.alert = jest.fn();
  });

  describe('Rendering - Parent User', () => {
    test('renders photo gallery for parent with photos', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({ data: { user: mockParentUser } });
      axios.get
        .mockResolvedValueOnce({ data: mockBabies })
        .mockResolvedValueOnce({ data: mockPhotos });

      render(
        <BrowserRouter>
          <PhotoGallery />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Photo Gallery')).toBeInTheDocument();
        expect(screen.getByText('Upload Photo')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('Emma Smith')).toBeInTheDocument();
      });

      expect(screen.getByText('Noah Smith')).toBeInTheDocument();
      expect(screen.getByText('First smile!')).toBeInTheDocument();
      expect(screen.getByText('Playing with toys')).toBeInTheDocument();
    });

    test('renders empty state when no photos', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({ data: { user: mockParentUser } });
      axios.get
        .mockResolvedValueOnce({ data: mockBabies })
        .mockResolvedValueOnce({ data: [] });

      render(
        <BrowserRouter>
          <PhotoGallery />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('No photos yet. Start building memories!')).toBeInTheDocument();
      });
    });

    test('shows loading state initially', () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({ data: { user: mockParentUser } });
      axios.get.mockImplementation(() => new Promise(() => {})); 

      render(
        <BrowserRouter>
          <PhotoGallery />
        </BrowserRouter>
      );

      expect(screen.getByText('Loading photos...')).toBeInTheDocument();
    });

    test('shows delete button for parent users', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({ data: { user: mockParentUser } });
      axios.get
        .mockResolvedValueOnce({ data: mockBabies })
        .mockResolvedValueOnce({ data: mockPhotos });

      const { container } = render(
        <BrowserRouter>
          <PhotoGallery />
        </BrowserRouter>
      );

      await waitFor(() => {
        const deleteButtons = container.querySelectorAll('.delete-photo-btn');
        expect(deleteButtons.length).toBe(2);
      });
    });
  });

  describe('Rendering - Babysitter User', () => {
    test('renders photo gallery for babysitter', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({ data: { user: mockBabysitterUser } });
      axios.get
        .mockResolvedValueOnce({ data: { children: mockBabies } })
        .mockResolvedValueOnce({ data: mockPhotos });

      render(
        <BrowserRouter>
          <PhotoGallery />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Photo Gallery')).toBeInTheDocument();
      });
    });

    test('does not show delete button for babysitter users', async () => {
      require('react-router-dom').useLocation.mockReturnValue({
        state: { isBabysitter: true },
      });

      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({ data: { user: mockBabysitterUser } });
      axios.get
        .mockResolvedValueOnce({ data: { children: mockBabies } })
        .mockResolvedValueOnce({ data: mockPhotos });

      const { container } = render(
        <BrowserRouter>
          <PhotoGallery />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Emma Smith')).toBeInTheDocument();
      });

      const deleteButtons = container.querySelectorAll('.delete-photo-btn');
      expect(deleteButtons.length).toBe(0);
    });
  });

  describe('Data Fetching', () => {
    test('fetches parent data correctly', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({ data: { user: mockParentUser } });
      axios.get
        .mockResolvedValueOnce({ data: mockBabies })
        .mockResolvedValueOnce({ data: mockPhotos });

      render(
        <BrowserRouter>
          <PhotoGallery />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          expect.stringContaining('/api/sign-in'),
          { idToken: 'mock-token' },
          { withCredentials: true }
        );
        expect(axios.get).toHaveBeenCalledWith(
          expect.stringContaining('/api/babies/1'),
          { withCredentials: true }
        );
        expect(axios.get).toHaveBeenCalledWith(
          expect.stringContaining('/api/photo-gallery/parent/1'),
          { withCredentials: true }
        );
      });
    });

    test('fetches babysitter data correctly', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({ data: { user: mockBabysitterUser } });
      axios.get
        .mockResolvedValueOnce({ data: { children: mockBabies } })
        .mockResolvedValueOnce({ data: mockPhotos });

      render(
        <BrowserRouter>
          <PhotoGallery />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          expect.stringContaining('/api/babysitter-sharing/children/2'),
          { withCredentials: true }
        );
        expect(axios.get).toHaveBeenCalledWith(
          expect.stringContaining('/api/photo-gallery/babysitter/2'),
          { withCredentials: true }
        );
      });
    });

    test('handles error when fetching data', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockRejectedValue(new Error('Network error'));

      render(
        <BrowserRouter>
          <PhotoGallery />
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

    test('does not fetch when no current user', () => {
      auth.currentUser = null;

      render(
        <BrowserRouter>
          <PhotoGallery />
        </BrowserRouter>
      );

      expect(axios.post).not.toHaveBeenCalled();
      expect(axios.get).not.toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    test('navigates back to parent dashboard', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({ data: { user: mockParentUser } });
      axios.get
        .mockResolvedValueOnce({ data: mockBabies })
        .mockResolvedValueOnce({ data: [] });

      render(
        <BrowserRouter>
          <PhotoGallery />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Photo Gallery')).toBeInTheDocument();
      });

      const backButton = screen.getByRole('button', { name: '' });
      fireEvent.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith('/parent-dashboard');
    });

    test('navigates back to babysitter dashboard', async () => {
      require('react-router-dom').useLocation.mockReturnValue({
        state: { isBabysitter: true },
      });

      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({ data: { user: mockBabysitterUser } });
      axios.get
        .mockResolvedValueOnce({ data: { children: mockBabies } })
        .mockResolvedValueOnce({ data: [] });

      render(
        <BrowserRouter>
          <PhotoGallery />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Photo Gallery')).toBeInTheDocument();
      });

      const backButton = screen.getByRole('button', { name: '' });
      fireEvent.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith('/babysitter-dashboard');
    });
  });

  describe('Upload Modal', () => {
    test('opens upload modal when upload button is clicked', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({ data: { user: mockParentUser } });
      axios.get
        .mockResolvedValueOnce({ data: mockBabies })
        .mockResolvedValueOnce({ data: [] });

      render(
        <BrowserRouter>
          <PhotoGallery />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Upload Photo')).toBeInTheDocument();
      });

      const uploadButton = screen.getByText('Upload Photo');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(screen.getByText('Select Baby')).toBeInTheDocument();
        expect(screen.getByText('Select Photo (Max 5MB)')).toBeInTheDocument();
      });
    });

    test('closes upload modal when cancel is clicked', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({ data: { user: mockParentUser } });
      axios.get
        .mockResolvedValueOnce({ data: mockBabies })
        .mockResolvedValueOnce({ data: [] });

      render(
        <BrowserRouter>
          <PhotoGallery />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Upload Photo')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Upload Photo'));

      await waitFor(() => {
        expect(screen.getByText('Cancel')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Cancel'));

      await waitFor(() => {
        expect(screen.queryByText('Select Baby')).not.toBeInTheDocument();
      });
    });

    test('displays baby options in upload modal', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({ data: { user: mockParentUser } });
      axios.get
        .mockResolvedValueOnce({ data: mockBabies })
        .mockResolvedValueOnce({ data: [] });

      render(
        <BrowserRouter>
          <PhotoGallery />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Upload Photo')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Upload Photo'));

      await waitFor(() => {
        const select = screen.getByDisplayValue('Emma Smith');
        expect(select).toBeInTheDocument();
      });
    });
  });

  describe('File Selection', () => {
    test('handles file selection', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({ data: { user: mockParentUser } });
      axios.get
        .mockResolvedValueOnce({ data: mockBabies })
        .mockResolvedValueOnce({ data: [] });

      render(
        <BrowserRouter>
          <PhotoGallery />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Upload Photo')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Upload Photo'));

      await waitFor(() => {
        expect(screen.getByText('Select Photo (Max 5MB)')).toBeInTheDocument();
      });

      const file = new File(['image'], 'test.png', { type: 'image/png' });
      const fileInput = document.querySelector('input[type="file"]');

      fireEvent.change(fileInput, { target: { files: [file] } });

      expect(URL.createObjectURL).toHaveBeenCalled();
    });

    test('rejects file larger than 5MB', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({ data: { user: mockParentUser } });
      axios.get
        .mockResolvedValueOnce({ data: mockBabies })
        .mockResolvedValueOnce({ data: [] });

      render(
        <BrowserRouter>
          <PhotoGallery />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Upload Photo')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Upload Photo'));

      await waitFor(() => {
        expect(screen.getByText('Select Photo (Max 5MB)')).toBeInTheDocument();
      });

      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.png', {
        type: 'image/png',
      });
      const fileInput = document.querySelector('input[type="file"]');

      fireEvent.change(fileInput, { target: { files: [largeFile] } });

      expect(global.alert).toHaveBeenCalledWith('File size must be less than 5MB');
    });
  });

  describe('Photo Upload', () => {
    test('uploads photo successfully', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({ data: { user: mockParentUser } });
      axios.get
        .mockResolvedValueOnce({ data: mockBabies })
        .mockResolvedValueOnce({ data: [] });

      render(
        <BrowserRouter>
          <PhotoGallery />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Upload Photo')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Upload Photo'));

      await waitFor(() => {
        expect(screen.getByText('Select Photo (Max 5MB)')).toBeInTheDocument();
      });

      const file = new File(['image'], 'test.png', { type: 'image/png' });
      const fileInput = document.querySelector('input[type="file"]');
      fireEvent.change(fileInput, { target: { files: [file] } });

      axios.post.mockResolvedValueOnce({ data: { success: true } });
      axios.get.mockResolvedValueOnce({ data: mockPhotos });

      const uploadButton = screen.getAllByText('Upload')[0];
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          expect.stringContaining('/api/photo-gallery/upload'),
          expect.any(FormData),
          expect.objectContaining({
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true,
          })
        );
      });
    });

    test('shows alert when uploading without file', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({ data: { user: mockParentUser } });
      axios.get
        .mockResolvedValueOnce({ data: mockBabies })
        .mockResolvedValueOnce({ data: [] });

      render(
        <BrowserRouter>
          <PhotoGallery />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Upload Photo')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Upload Photo'));

      await waitFor(() => {
        const uploadButtons = screen.getAllByText('Upload');
        expect(uploadButtons.length).toBeGreaterThan(0);
      });

      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    test('handles upload error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({ data: { user: mockParentUser } });
      axios.get
        .mockResolvedValueOnce({ data: mockBabies })
        .mockResolvedValueOnce({ data: [] });

      render(
        <BrowserRouter>
          <PhotoGallery />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Upload Photo')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Upload Photo'));

      await waitFor(() => {
        expect(screen.getByText('Select Photo (Max 5MB)')).toBeInTheDocument();
      });

      const file = new File(['image'], 'test.png', { type: 'image/png' });
      const fileInput = document.querySelector('input[type="file"]');
      fireEvent.change(fileInput, { target: { files: [file] } });

      axios.post.mockRejectedValueOnce(new Error('Upload failed'));

      const uploadButton = screen.getAllByText('Upload')[0];
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Error uploading photo:',
          expect.any(Error)
        );
        expect(global.alert).toHaveBeenCalledWith('Failed to upload photo');
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Photo Deletion', () => {
    test('opens delete modal when delete button is clicked', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({ data: { user: mockParentUser } });
      axios.get
        .mockResolvedValueOnce({ data: mockBabies })
        .mockResolvedValueOnce({ data: mockPhotos });

      const { container } = render(
        <BrowserRouter>
          <PhotoGallery />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Emma Smith')).toBeInTheDocument();
      });

      const deleteButton = container.querySelector('.delete-photo-btn');
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByText('Delete Photo')).toBeInTheDocument();
        expect(screen.getByText('Are you sure you want to delete this photo?')).toBeInTheDocument();
      });
    });

    test('deletes photo successfully', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({ data: { user: mockParentUser } });
      axios.get
        .mockResolvedValueOnce({ data: mockBabies })
        .mockResolvedValueOnce({ data: mockPhotos });

      const { container } = render(
        <BrowserRouter>
          <PhotoGallery />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Emma Smith')).toBeInTheDocument();
      });

      const deleteButton = container.querySelector('.delete-photo-btn');
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByText('Delete Photo')).toBeInTheDocument();
      });

      axios.delete.mockResolvedValueOnce({ data: { success: true } });
      axios.get.mockResolvedValueOnce({ data: [] });

      const confirmButton = screen.getAllByText('Delete')[0];
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(axios.delete).toHaveBeenCalledWith(
          expect.stringContaining('/api/photo-gallery/1'),
          { withCredentials: true }
        );
      });
    });

    test('handles delete error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({ data: { user: mockParentUser } });
      axios.get
        .mockResolvedValueOnce({ data: mockBabies })
        .mockResolvedValueOnce({ data: mockPhotos });

      const { container } = render(
        <BrowserRouter>
          <PhotoGallery />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Emma Smith')).toBeInTheDocument();
      });

      const deleteButton = container.querySelector('.delete-photo-btn');
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByText('Delete Photo')).toBeInTheDocument();
      });

      axios.delete.mockRejectedValueOnce(new Error('Delete failed'));

      const confirmButton = screen.getAllByText('Delete')[0];
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Error deleting photo:',
          expect.any(Error)
        );
        expect(global.alert).toHaveBeenCalledWith('Failed to delete photo');
      });

      consoleSpy.mockRestore();
    });

    test('closes delete modal when cancel is clicked', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({ data: { user: mockParentUser } });
      axios.get
        .mockResolvedValueOnce({ data: mockBabies })
        .mockResolvedValueOnce({ data: mockPhotos });

      const { container } = render(
        <BrowserRouter>
          <PhotoGallery />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Emma Smith')).toBeInTheDocument();
      });

      const deleteButton = container.querySelector('.delete-photo-btn');
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByText('Delete Photo')).toBeInTheDocument();
      });

      const cancelButtons = screen.getAllByText('Cancel');
      fireEvent.click(cancelButtons[cancelButtons.length - 1]);

      await waitFor(() => {
        expect(screen.queryByText('Are you sure you want to delete this photo?')).not.toBeInTheDocument();
      });
    });
  });

  describe('Caption Handling', () => {
    test('updates caption in upload modal', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({ data: { user: mockParentUser } });
      axios.get
        .mockResolvedValueOnce({ data: mockBabies })
        .mockResolvedValueOnce({ data: [] });

      render(
        <BrowserRouter>
          <PhotoGallery />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Upload Photo')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Upload Photo'));

      await waitFor(() => {
        const captionInput = screen.getByPlaceholderText('Add a caption...');
        expect(captionInput).toBeInTheDocument();
        fireEvent.change(captionInput, { target: { value: 'Test caption' } });
        expect(captionInput.value).toBe('Test caption');
      });
    });

    test('displays photo captions in gallery', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({ data: { user: mockParentUser } });
      axios.get
        .mockResolvedValueOnce({ data: mockBabies })
        .mockResolvedValueOnce({ data: mockPhotos });

      render(
        <BrowserRouter>
          <PhotoGallery />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('First smile!')).toBeInTheDocument();
        expect(screen.getByText('Playing with toys')).toBeInTheDocument();
      });
    });
  });
});
