import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import DashboardComp from 'components/DashboardComp';
import * as Auth from 'utils/Auth';
import * as DashboardFetch from 'fetch/DashboardComp';

// Mock the modules
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

jest.mock('utils/Auth');
jest.mock('fetch/DashboardComp');
jest.mock('react-icons/fa', () => ({
  FaUserCircle: () => <div>FaUserCircle</div>,
  FaRobot: () => <div>FaRobot</div>,
  FaPaperclip: () => <div>FaPaperclip</div>,
  FaPaperPlane: () => <div>FaPaperPlane</div>,
}));
jest.mock('flowbite-react', () => ({
  Button: ({ children }) => <button>{children}</button>,
  Textarea: ({ ...props }) => <textarea {...props} />,
  Popover: ({ children }) => <div>{children}</div>,
}));

// Mock fetch globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

describe('DashboardComp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('status', 'Loggedin Successfully');
    
    Auth.fetchStatus.mockReturnValue('Loggedin Successfully');
    
    // Mock DashboardFetch functions
    DashboardFetch.uploadFile.mockResolvedValue({ detail: 'File uploaded successfully' });
    DashboardFetch.userPrompt.mockResolvedValue({
      response: 'I am a bot, I am here to help',
      detail: 'Test detail',
      image: [],
    });
  });

  test('renders without crashing', () => {
    render(
      <BrowserRouter>
        <DashboardComp />
      </BrowserRouter>
    );
    expect(screen.getByPlaceholderText('Enter a prompt..')).toBeInTheDocument();
  });

  test('displays success toast on successful login', async () => {
    render(
      <BrowserRouter>
        <DashboardComp />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Loggedin Successfully')).toBeInTheDocument();
    });
  });

  test('handles input change', () => {
    render(
      <BrowserRouter>
        <DashboardComp />
      </BrowserRouter>
    );
    const input = screen.getByPlaceholderText('Enter a prompt..');
    fireEvent.change(input, { target: { value: 'Test input' } });
    expect(input.value).toBe('Test input');
  });

  test('handles form submission', async () => {
    // Set up mock implementation for userPrompt
    DashboardFetch.userPrompt.mockResolvedValue({
      response: 'Test response',
      detail: [], // Add any details you expect
      image: [], // Add any images you expect
    });

    // Render component
    render(
      <BrowserRouter>
        <DashboardComp />
      </BrowserRouter>
    );

    // Simulate user input
    const textarea = screen.getByPlaceholderText('Enter a prompt..');
    fireEvent.change(textarea, { target: { value: 'Test input' } });

    // Simulate form submission
    const submitButton = screen.getByRole('button', { name: /FaPaperPlane/i });
    fireEvent.click(submitButton);

    // Check if userPrompt was called with correct arguments
    await waitFor(() => {
      expect(DashboardFetch.userPrompt).toHaveBeenCalledWith('Test input');
    });
  });

  test('handles file upload with valid file', async () => {
    render(
      <BrowserRouter>
        <DashboardComp />
      </BrowserRouter>
    );
  
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    
    // Wait for the file input element to appear (if rendered asynchronously)
    const fileInput = await screen.findByTestId('file-input'); // Use findByTestId or waitFor
  
    fireEvent.change(fileInput, { target: { files: [file] } });
  
    await waitFor(() => {
      expect(DashboardFetch.uploadFile).toHaveBeenCalled();
    });
  
    await waitFor(() => {
      expect(screen.getByText('File uploaded successfully')).toBeInTheDocument();
    });
  });

  test('closes toast message after timeout', async () => {
    jest.useFakeTimers();

    render(
      <BrowserRouter>
        <DashboardComp />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Loggedin Successfully')).toBeInTheDocument();
    });

    // Simulate timer advancing for 4 seconds
    jest.advanceTimersByTime(4000);

    await waitFor(() => {
      expect(screen.queryByText('Loggedin Successfully')).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  test('scrolls to the bottom when a new message is added', async () => {
    render(
      <BrowserRouter>
        <DashboardComp />
      </BrowserRouter>
    );
  
    // Wait for the chat container to appear
    const chatContainer = await screen.findByTestId('chat-container'); // Adjust as needed
  
    // Initial scroll position check
    expect(chatContainer.scrollTop).toBe(chatContainer.scrollHeight);
  
    // Simulate message addition
    fireEvent.change(screen.getByPlaceholderText('Enter a prompt..'), { target: { value: 'New message' } });
    fireEvent.click(screen.getByRole('button', { name: /FaPaperPlane/i }));
  
    // Wait for new message to appear
    await waitFor(() => {
      expect(screen.getByText('New message')).toBeInTheDocument();
    });
  
    // Check if scroll position is at the bottom again
    expect(chatContainer.scrollTop).toBe(chatContainer.scrollHeight);
  });
  
});
