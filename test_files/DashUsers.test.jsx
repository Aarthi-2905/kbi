import React from 'react';
import { render, screen, fireEvent, waitFor, act , within} from '@testing-library/react';
import '@testing-library/jest-dom';
import DashUsers from 'components/DashUsers';
import { BrowserRouter } from 'react-router-dom';
import * as fetchModule from 'fetch/DashUsers';
 
jest.mock('fetch/DashUsers');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));
 
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ token: 'mocked-token' }),
  })
);
 
const mockUsers = [
  { date: '2023-01-01', username: 'user1', email: 'user1@example.com', role: 'Super Admin' },
  { date: '2023-02-01', username: 'user2', email: 'user2@example.com', role: 'User' },
];
 
describe('DashUsers Component', () => {
    beforeEach(() => {
      fetchModule.fetchUsers.mockResolvedValue(mockUsers);
      localStorage.setItem('token', 'mock-token');
      fetchModule.addUser.mockClear(); // Clear previous calls
      fetchModule.addUser.mockResolvedValue({ detail: 'User added successfully' }); // Mock the response
    });
 
    afterEach(() => {
      jest.clearAllMocks();
      localStorage.clear();
    });
 
    test('renders DashUsers component', async () => {
      await act(async () => {
        render(
          <BrowserRouter>
            <DashUsers />
          </BrowserRouter>
        );
      });
    
      expect(screen.getByText('Add User')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search users')).toBeInTheDocument();
    });
 
  test('displays user data in the table', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <DashUsers />
        </BrowserRouter>
      );
    });
 
    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('user2')).toBeInTheDocument();
  });
 
  test('opens add user modal when "Add User" button is clicked', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <DashUsers />
        </BrowserRouter>
      );
    });
 
    const addUserButton = screen.getByText('Add User');
    fireEvent.click(addUserButton);
 
    await waitFor(() => {
      expect(screen.getByText('Add User', { selector: 'h3' })).toBeInTheDocument();
    });
  });
 
  
  test('filters users when search input is used', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <DashUsers />
        </BrowserRouter>
      );
    });
 
    const searchInput = screen.getByPlaceholderText('Search users');
    fireEvent.change(searchInput, { target: { value: 'user1' } });
 
    await waitFor(() => {
      expect(screen.getByText('user1')).toBeInTheDocument();
      expect(screen.queryByText('user2')).not.toBeInTheDocument();
    });
  });
 
  test('adds a new user when form is submitted in add user modal', async () => {
    render(<DashUsers />);
  
    // Simulate clicking "Add User"
    fireEvent.click(screen.getByText(/add user/i));
  
    // Check if the modal is in the document
    expect(screen.getByLabelText(/Add User/i)).toBeInTheDocument();
  
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'NewUser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'newuser@example.com' } });
  
    // Simulate form submission
    fireEvent.click(screen.getByLabelText(/submit/i));
  
    // Add assertions to verify user was added
  });
  
 

    
});