import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useGlobalFilter } from 'react-table';
import { Button, Modal, Table, TextInput , Select} from 'flowbite-react';
import { HiOutlineExclamationCircle, HiSearch,HiX } from 'react-icons/hi';
import { deleteUser, editUserDetails, fetchUsers, addUser } from '../fetch/DashUsers';
import { useNavigate } from "react-router-dom";
import { setRole } from '../utils/Auth';
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function DashUsers() {
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [emailToDelete, setEmailToDelete] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [editUser, setEditUser] = useState({ username: '', email: ''});
    const [newUser, setNewUser] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    //Toggles the visibility of the password.
    const [showPassword, setShowPassword] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(false);

    //Toggles the state of showPassword to show or hide the password.
    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        const fetchUser = async () => {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            };
            const response = await fetch(`${process.env.VITE_HOST}:${process.env.VITE_PORT}/login`, requestOptions);
            const data = await response.json();
            if (data) {
                localStorage.setItem("token", token);
                return true;
            } else {
                setToken(null);
                navigate('/');
                return null;
            }
        };
        fetchUser();
    }, [token]);

    //Loads user data and displays success messages from localStorage on component mount.
    useEffect(() => {
        async function loadData() {
            try {
                const data = await fetchUsers(); 
                if (!data) {
                    throw new Error('Network response was not ok');
                }
                setData(data);  
                // setData(dummyUsers);
            } catch (error) {
                console.error("Failed to fetch users:", error);
                setToast({
                    show: true,
                    message:  'Failed to fetch users:',
                    type: 'error'
                });
                autoCloseToast();
            } 
        }
        loadData();
        const editflashMessage = localStorage.getItem('editUser');
        if (editflashMessage) {
            localStorage.removeItem('editUser');
        }
    }, []);

    const columns = React.useMemo(
        () => [
            { Header: 'Date created', accessor: 'date' },
            { Header: 'Username', accessor: 'username' },
            { Header: 'Email', accessor: 'email' },
            { Header: 'Role', accessor: 'role' },
            {
                Header: 'Edit',
                Cell: ({ row }) => (
                <span className="font-medium text-green-500 hover:underline cursor-pointer"
                    onClick={() =>  openEditModal(row.original)}
                    data-testid="Edit">
                    Edit
                </span>
                ),
            },
            {
                Header: 'Delete',
                Cell: ({ row }) => (
                <span className="font-medium text-red-500 hover:underline cursor-pointer"
                    onClick={() => openConfirmModal(row.original.email)} data-testid="Delete">
                    Delete
                </span>
                ),
            },
        ],
        []
    );

    const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page, canPreviousPage, 
            canNextPage, pageOptions,state: { pageIndex, globalFilter }, setGlobalFilter,  nextPage,
            previousPage,
    } = useTable(
            {
                columns,data,initialState: { pageIndex: 0, pageSize :6 },
            },
        useGlobalFilter, usePagination
    );

    const openConfirmModal = (email) => {
        setEmailToDelete(email);
        setIsConfirmModalOpen(true);
    };

    const closeConfirmModal = () => {
        setIsConfirmModalOpen(false);
        setEmailToDelete(null);
    };

    const handleDelete = async () => {
        try {
            const data = await deleteUser(emailToDelete);
            if (!data) {
                throw new Error('Network response was not ok');
            }
            setData(prevData => prevData.filter(user => user.email !== emailToDelete));
            closeConfirmModal();
            setToast({
                show: true,
                message: data.detail || 'deleted successfully',
                type: 'success'
            });
            autoCloseToast();
        } catch (error) {
            // console.error("Failed to delete user:", error);
            setToast({
                show: true,
                message:  'Failed to delete user',
                type: 'error'
            });
            autoCloseToast();
        }
    };

    const openEditModal = (user) => {
        setEditUser(user);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditUser({ username: '', email: '' });
    };

    const handleEdit = async (event) => {
        event.preventDefault();
        setLoading(true);
        editUser.role = "user";
        if (editUser.email === '' || editUser.username === '') {
            setToast({
                show: true,
                message: 'Email and Username cannot be empty',
                type: 'error'
            });
            autoCloseToast();
            return;
        }
        try {
            const data = await editUserDetails(editUser);
            if (!data) {
                throw new Error('Network response was not ok');
            }
            localStorage.setItem('editUser', data.detail);
            sessionStorage.setItem('toastMessage', JSON.stringify({
                show: true,
                message: data.detail ||  'User added successfully',
                type: 'success'
            }));
            window.location.reload();
        } catch (error) {
            setToast({
                show: true,
                message:  'Failed to Update user details',
                type: 'error'
            });
            autoCloseToast();
        }finally {
            setLoading(false); // Set loading to false when action is done
        }
        closeEditModal();
    };

    const openAddUserModal = () => {
        setIsAddUserModalOpen(true);
    };

    const closeAddUserModal = () => {
        setIsAddUserModalOpen(false);
        setNewUser({ username: '', email: '', password: '', confirmPassword: '' });
    };

    const handleAddUser = async (event) => {
        event.preventDefault();
        
        // Perform any necessary validation
        if (newUser.password !== newUser.confirmPassword) {
            setToast({
                show: true,
                message: 'Passwords do not match',
                type: 'error'
            });
            autoCloseToast();
            return;
        }
        newUser.role = "user";
        if (newUser.email === '' || newUser.username === '' || 
                newUser.password === '' || newUser.confirmPassword === '') {
            setToast({
                show: true,
                message: 'Email and Username cannot be empty',
                type: 'error'
            });
            autoCloseToast();
            return;
        }
        setLoading(true);
        try {
            newUser.added_date = "";
            const {confirmPassword, ...userWithoutConfirmPassword} = newUser;
            const data = await addUser(userWithoutConfirmPassword);
            if (!data) {
                throw new Error('Network response was not ok');
            }
            setData((prevData) => [...prevData, data]);
            if(data.error_detail){
                sessionStorage.setItem('toastMessage', JSON.stringify({
                    show: true,
                    message: data.error_detail,
                    type: 'error'
                }));
            }else{
                sessionStorage.setItem('toastMessage', JSON.stringify({
                    show: true,
                    message: data.detail,
                    type: 'success'
                }));
            }
            // setTimeout(() => {
            window.location.reload();
            // }, 4000);
        } catch (error) {
            console.error('Error adding user:', error);
            setToast({
                show: true,
                message:  'Failed to adding User',
                type: 'success'
            });
            autoCloseToast();
            // setTimeout(() => {
            //     window.location.reload();
            // }, 4000);
        }finally {
            setLoading(false); // Set loading to false when action is done
        }
        closeAddUserModal();
    };
    
    const autoCloseToast = () => {
        setTimeout(() => {
            setToast({ show: false, message: '', type: '' });
        }, 4000); // Auto-close after 10 seconds (10000ms)
    };

    useEffect(() => {
        const storedToast = sessionStorage.getItem('toastMessage');
        if (storedToast) {
            const toastData = JSON.parse(storedToast);
            setToast(toastData);
            sessionStorage.removeItem('toastMessage');
            autoCloseToast();
        }
    }, []);

    const renderLoadingSpinner = () => {
        if (!loading) return null;
 
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center  bg-gray-400 bg-opacity-50">
                 <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4  border-black"></div>
            </div>
        );
    };

    const renderToast = () => {
        if (!toast.show) return null;
        const alertStyle = toast.type === 'success'
            ? 'bg-green-100 text-green-600 border-t-4 border-green-400 shadow-lg'
            : 'bg-red-100 text-red-600 border-t-4 border-red-400 shadow-lg';
        return (
            <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 flex p-4 rounded-lg ${alertStyle} mt-5 max-w-lg w-full`}
                role="alert" style={{ zIndex: 9999 }} >
                <div className="ml-3 text-sm font-medium">
                    {toast.message}
                </div>
                <button type="button" aria-label="Close"
                    className="ml-auto -mx-1.5 -my-1.5 text-red-600 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8"
                    onClick={() => setToast({ show: false, message: '', type: '' })}
                >
                    <span className="sr-only">Close</span>
                    <HiX className="w-5 h-5" />
                </button>
            </div>
        );
    };
    return (
        <div className="table-auto w-[73vw] md:mx-auto p-3 m-5 ">
            {renderLoadingSpinner()}
            <div className="flex justify-between mb-4">
                <Button gradientDuoTone="purpleToBlue"  
                className="shadow-custom-bottom" onClick={openAddUserModal}>
                    Add User
                </Button>
                <TextInput value={globalFilter || ''}  placeholder="Search users"  icon={HiSearch}
                    onChange={(e) => setGlobalFilter(e.target.value || undefined)}
                />
            </div>
            <div className='justify-centre items-center mb-4'>
                {renderToast()}
            </div>
            <Table hoverable className="shadow-md ">
                <Table.Head>
                    <Table.HeadCell className=' bg-gray-700 text-white'>Date created</Table.HeadCell>
                    <Table.HeadCell className=' bg-gray-700 text-white'>Username</Table.HeadCell>
                    <Table.HeadCell className=' bg-gray-700 text-white'>Email</Table.HeadCell>
                    <Table.HeadCell className=' bg-gray-700 text-white'>Role</Table.HeadCell>
                    <Table.HeadCell className=' bg-gray-700 text-white'>Edit</Table.HeadCell>
                    <Table.HeadCell className=' bg-gray-700 text-white'>Delete</Table.HeadCell>
                </Table.Head>
                <Table.Body {...getTableBodyProps()} className="divide-y">
                    {page.map((row) => {
                        prepareRow(row);
                        return (
                            <Table.Row key={row.id}  className=" text-white  border-gray-700 bg-gray-800 
                                hover:bg-[rgb(168,224,255,1)] hover:text-black">
                                {row.cells.map((cell) => {
                                    const { key, ...cellProps } = cell.getCellProps(); // Destructure to remove the key
                                    return (
                                        <Table.Cell key={cell.column.id} {...cellProps}>
                                        {cell.render('Cell')}
                                        </Table.Cell>
                                    );
                                })}
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
            <div className="flex justify-end items-center mt-4 gap-3 text-white">
                <Button onClick={() => previousPage()} disabled={!canPreviousPage} 
                    gradientDuoTone="purpleToBlue"  outline>
                    Previous    
                </Button>
                <span> Page {pageIndex + 1} of {pageOptions.length} </span>
                <Button onClick={() => nextPage()} disabled={!canNextPage} 
                    gradientDuoTone="purpleToBlue" outline>
                    Next
                </Button>
            </div>

            <Modal show={isConfirmModalOpen} onClose={closeConfirmModal} popup size="lg">
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <h1 className='text-black font-bold text-xl'>Delete File</h1>
                        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 m-9 rounded-sm" role="alert">
                            <p className="font-bold">Be Warned</p>
                            <p>Something not ideal might be happening.</p>
</                      div>
                        {/* <HiOutlineExclamationCircle className="h-14 w-14  text-gray-200 mb-4 mx-auto" /> */}
                        <h3 className="mb-5 text-lg  text-black">
                            Are you sure you want to delete this user?
                        </h3>
                        <div className="flex justify-center gap-4 m-5">
                            <Button color="failure" onClick={handleDelete}>
                                Yes, I'm sure
                            </Button>
                            <Button color="gray" onClick={closeConfirmModal}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Edit User Modal */}
            <Modal show={isEditModalOpen} onClose={closeEditModal} popup size="md">
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center p-5">
                        <h3 className="mb-5 text-lg  font-semibold text-black" aria-label='Edit User'>
                            Edit User
                        </h3>
                        <TextInput value={editUser.username} aria-label='username'  placeholder="username" className="mb-4"
                            onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}/>
                        <TextInput value={editUser.email} aria-label='email' placeholder="email" className="mb-4" disabled
                            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}/>
                        {/* <Select value={editUser.role} className="mb-4" onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="super_admin">Super Admin</option>
                        </Select> */}
                        <div className="flex justify-center gap-4">
                            <Button  gradientDuoTone="purpleToBlue" aria-label='Save Change' role='button' name='Save Change' onClick={handleEdit}>
                                Save Change
                            </Button>
                            <Button class="text-white bg-gradient-to-r from-red-400 via-red-500
                             to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none
                              focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg 
                              text-sm px-4  text-center" onClick={closeEditModal} >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Add User Modal */}
            <Modal show={isAddUserModalOpen} onClose={closeAddUserModal} popup size="md" className='bg-slate-50'>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center p-5">
                        <h3 className="mb-5 text-lg  font-semibold text-gray-400" aria-label='Add User'>
                            Add User
                        </h3>
                        <TextInput value={newUser.username} aria-label='username' placeholder="username" className="mb-4"
                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}/>
                        <TextInput value={newUser.email} aria-label='email' placeholder="email" className="mb-4"
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                        {/* <Select value={newUser.role} className="mb-4"
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                            <option value="" selected>Select Role</option>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="super_admin">Super Admin</option>
                        </Select> */}

                        <div className="relative">
                            <TextInput type={showPassword ? "text" : "password"}
                                placeholder="Password" value={newUser.password} id="password" className="mb-4"  
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            />
                            <span onClick={handleTogglePassword}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2  text-black cursor-pointer"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        <div className="relative">
                            <TextInput type={showPassword ? "text" : "password"}
                                placeholder="Confirm Password" value={newUser.confirmPassword} className="mb-4" 
                                onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                            />
                            <span onClick={handleTogglePassword}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2  text-black cursor-pointer"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        <div className="flex justify-center gap-4 m-2 mt-7">
                            <Button gradientDuoTone="purpleToBlue" aria-label='submit' onClick={handleAddUser}>
                                Add User
                            </Button>
                            <Button class="text-white bg-gradient-to-r from-red-400 via-red-500
                             to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none
                              focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg 
                              text-sm px-4  text-center"
                             onClick={closeAddUserModal}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

