import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashRequest from 'components/DashRequest';
import { fetchFiles, approveFile, rejectFile } from 'fetch/DashRequest';
 
// Mock the external modules and functions
jest.mock('fetch/DashRequest', () => ({
  fetchFiles: jest.fn(),
  approveFile: jest.fn(),
  rejectFile: jest.fn(),
}));
 
jest.mock('react-icons/hi', () => ({
  HiOutlineExclamationCircle: () => <div data-testid="mock-icon" />,
  HiSearch: () => <div data-testid="mock-search-icon" />,
  HiX: () => <div data-testid="mock-close-icon" />,
  HiXCircle: () => <div data-testid="mock-x-circle-icon" />,
  HiCheckCircle: () => <div data-testid="mock-check-circle-icon" />,
}));
 
jest.mock('react-icons/fa', () => ({
  FaCheck: () => <div data-testid="mock-fa-check-icon" />,
  FaTimes: () => <div data-testid="mock-fa-times-icon" />,
}));
 
// Mock the image imports
jest.mock('/assets/approve.png', () => 'mock-approve-image-path');
jest.mock('/assets/reject.png', () => 'mock-reject-image-path');
 
describe('DashRequest Component', () => {
  const mockData = [
    { file_name: 'test1.docx', email: 'user1@example.com' },
    { file_name: 'test2.xlsx', email: 'user2@example.com' },
  ];
 
  beforeEach(() => {
    fetchFiles.mockResolvedValue({ detail: mockData });
 
    global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          blob: () => Promise.resolve(new Blob()),
        })
      );
      // Mock URL.createObjectURL and URL.revokeObjectURL
      global.URL.createObjectURL = jest.fn();
      global.URL.revokeObjectURL = jest.fn();
  });
 
  afterEach(() => {
    // Clean up mocks after each test
    jest.resetAllMocks();
    delete global.fetch;
    delete global.URL.createObjectURL;
    delete global.URL.revokeObjectURL;
  });
 
 
  test('renders DashRequest component', async () => {
    render(<DashRequest />);
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search files')).toBeInTheDocument();
      expect(screen.getByText(/requested files/i)).toBeInTheDocument();
      expect(screen.getByText('User Name')).toBeInTheDocument();
      expect(screen.getByText('Approve')).toBeInTheDocument();
      expect(screen.getByText('Reject')).toBeInTheDocument();
    });
  });
 
  test('fetches and displays file data', async () => {
    render(<DashRequest />);
    await waitFor(() => {
      expect(screen.getByText('test1.docx')).toBeInTheDocument();
      expect(screen.getByText('user1@example.com')).toBeInTheDocument();
      expect(screen.getByText('test2.xlsx')).toBeInTheDocument();
      expect(screen.getByText('user2@example.com')).toBeInTheDocument();
    });
  });
 
  test('opens approve confirmation modal when Approve button is clicked', async () => {
    render(<DashRequest />);
 
    await waitFor(() => {
        const approveButtons = screen.getAllByTestId('approve-button');
        expect(approveButtons[0]).toBeInTheDocument();
        fireEvent.click(approveButtons[0]);
      });
     
      await waitFor(() => {
        expect(screen.getByText(/Are you sure you want to Approve this user?/i)).toBeInTheDocument();
      });
  });
 
  test('opens reject confirmation modal when Reject button is clicked', async () => {
    render(<DashRequest />);
   
    await waitFor(() => {
        const rejectButtons = screen.getAllByTestId('reject-button');
        expect(rejectButtons[0]).toBeInTheDocument();
        fireEvent.click(rejectButtons[0]);
      });
     
      await waitFor(() => {
        expect(screen.getByText(/Are you sure you want to Reject this user?/i)).toBeInTheDocument();
      });
  });
 
  test('approves file when confirmation is given', async () => {
    approveFile.mockResolvedValue({ detail: 'File approved successfully' });
    render(<DashRequest />);
 
    await waitFor(() => {
      fireEvent.click(screen.getAllByTestId('approve-button')[0]);
    });
 
    await waitFor(() => {
      expect(screen.getByText('Approve File')).toBeInTheDocument();
    });
 
    const confirmButton = screen.getByText(/Yes, I'm sure/i);
    fireEvent.click(confirmButton);
 
    await waitFor(() => {
      expect(approveFile).toHaveBeenCalled();
      expect(screen.getByText(/File approved successfully/i)).toBeInTheDocument();
    }, { timeout: 3000 }); // Increase timeout if necessary
  });
 
   test('rejects file when confirmation is given', async () => {
     rejectFile.mockResolvedValue({ detail: 'File Removed successfully' });
     render(<DashRequest />);
 
     await waitFor(() => {
       fireEvent.click(screen.getAllByTestId('reject-button')[0]);
     });
 
     await waitFor(() => {
       expect(screen.getByText((content, element) => {
         return element.tagName.toLowerCase() === 'h1' && content.includes('Delete File');
       })).toBeInTheDocument();
     });
 
     const confirmButton = screen.getByRole('button', { name: /Yes, I'm sure/i });
     fireEvent.click(confirmButton);
 
     await waitFor(() => {
       expect(rejectFile).toHaveBeenCalled();
       expect(screen.getByText(/delete file/i)).toBeInTheDocument();
     }, { timeout: 3000 }); // Increase timeout if necessary
   });
 
 
  test('filters files based on search input', async () => {
    render(<DashRequest />);
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search files');
      fireEvent.change(searchInput, { target: { value: 'test1' } });
      expect(screen.getByText('test1.docx')).toBeInTheDocument();
      expect(screen.queryByText('test2.xlsx')).not.toBeInTheDocument();
    });
  });
 
  test('handles pagination', async () => {
    render(<DashRequest />);
 
    await waitFor(() => {
      expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
     
      const nextButton = screen.getByRole('button', { name: /next/i });
      const prevButton = screen.getByRole('button', { name: /previous/i });
 
      expect(nextButton).toBeDisabled();
      expect(prevButton).toBeDisabled();
    });
  });
 
  test('handles file download attempt', async () => {
    render(<DashRequest />);
 
    await waitFor(() => {
      expect(screen.getByText('test1.docx')).toBeInTheDocument();
    });
 
    fireEvent.click(screen.getByText('test1.docx'));
 
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(`${process.env.VITE_HOST}:${process.env.VITE_WEB_PORT}/user_uploads/test1.docx`);
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    });
  });
 
  test('displays error toast on fetch failure', async () => {
    fetchFiles.mockRejectedValue(new Error('Network error'));
    render(<DashRequest />);
 
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch details')).toBeInTheDocument();
    });
  });
 
test('displays error toast on approve failure', async () => {
    approveFile.mockRejectedValue(new Error('Approve error'));
   
    render(<DashRequest />);
 
    await waitFor(() => {
      expect(screen.getAllByTestId('approve-button')[0]).toBeInTheDocument();
    });
 
    fireEvent.click(screen.getAllByTestId('approve-button')[0]);
 
    await waitFor(() => {
      expect(screen.getByText(/Are you sure you want to Approve this user?/i)).toBeInTheDocument();
    });
 
    fireEvent.click(screen.getByText(/Yes, I'm sure/i));
 
    await waitFor(() => {
      expect(screen.getByText(/Error approving the file./i)).toBeInTheDocument();
    });
  });
 
test('displays error toast on reject failure', async () => {
    rejectFile.mockRejectedValue(new Error('Reject error'));
 
    render(<DashRequest />);
 
    await waitFor(() => {
      expect(screen.getAllByTestId('reject-button')[0]).toBeInTheDocument();
    });
 
    fireEvent.click(screen.getAllByTestId('reject-button')[0]);
 
    await waitFor(() => {
      expect(screen.getByText(/Are you sure you want to Reject this user?/i)).toBeInTheDocument();
    });
 
    fireEvent.click(screen.getByText(/Yes, I'm sure/i));
 
    await waitFor(() => {
      expect(screen.getByText(/Error Removing the file./i)).toBeInTheDocument();
    });
  });
});