import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaUserCircle, FaRobot, FaPaperclip, FaPaperPlane } from 'react-icons/fa';
import { Button, Textarea } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { uploadFile, userPrompt } from '../fetch/DashboardComp';
import Toast from '../utils/Toast';
import { verifyToken } from '../utils/AuthUtils';

const DashboardComp = () => {
    const navigate = useNavigate();
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const fileInputRef = useRef(null);
    const chatContainerRef = useRef(null);

    const loginStatus = localStorage.getItem('status');

    // Combine token verification, login status handling, and toast auto-close
    useEffect(() => {
        const handleAuthAndNotifications = () => {
            const token = localStorage.getItem('token');
            if (token) {
                verifyToken(token, navigate); // Run once on mount
            }
        };
    
        handleAuthAndNotifications(); // Call function on mount
    }, [navigate]); // Only run once when `navigate` changes.
    
    useEffect(() => {
        if (loginStatus) {
            setToast({
                show: true,
                message: loginStatus,
                type: loginStatus.includes('Successfully') ? 'success' : 'error',
            });
            autoCloseToast();
            localStorage.removeItem('status');
        }
    }, [loginStatus]);

    // Automatically close the toast after a timeout
    const autoCloseToast = useCallback(() => {
        setTimeout(() => {
            setToast({ show: false, message: '', type: '' });
        }, 4000);
    }, []);

    // Handle input changes
    const handleInputChange = (event) => setInputText(event.target.value);

    // Trigger file input click
    const handleFileClick = () => fileInputRef.current.click();

    // Handle file input changes and validate file type
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const validExtensions = ['.pdf', '.xlsx', '.txt', '.pptx', '.docx', '.csv'];
        const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

        if (!validExtensions.includes(fileExtension)) {
            showToast('Invalid file type. Please upload .pdf, .xlsx, .txt, .pptx, .docx, or .csv files.', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('files', file);

        setIsLoading(true);
        try {
            const data = await uploadFile(formData);
            showToast(data.error_detail || data.detail || 'File uploaded successfully!', data.error_detail ? 'error' : 'success');
        } catch {
            showToast('File upload failed!', 'error');
        } finally {
            setIsLoading(false);
            event.target.value = null;
        }
    };

    // Show toast message with auto-close functionality
    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        autoCloseToast();
    };

    // Handle send message action
    const onSend = async (event) => {
        event.preventDefault();
        if (!inputText.trim()) {
            showToast('Please enter a prompt!', 'error');
            return;
        }

        setMessages((prevMessages) => [...prevMessages, { user: 'user', response: inputText }]);
        setInputText('');
        setIsLoading(true);

        try {
            console.log('try');
            const data = await userPrompt(inputText);
            console.log(data);
            if (data.detail) {
                showToast(data.detail, 'error');
            } else {
                setMessages(prevMessages => [...prevMessages, { user: 'bot', response: data.response, details: data.more_detail, image: data.image }]);
            }
        } catch {
            console.log('catch');
            showToast('Token expired, please login again.', 'error');
            navigate('/');
        } finally {
            setIsLoading(false);
        }
    };

    // Scroll to bottom of chat container when new messages are added
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]); // Only trigger when messages change

    return (
        <div className="w-full h-full flex flex-col items-center justify-center m-2">
            <div className="w-full h-[calc(89vh)] flex flex-col justify-between shadow-custom-bottom rounded-lg bg-[rgb(16,23,42)] mb-10 relative">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
                    </div>
                )}
                <Toast toast={toast} setToast={setToast} />
                <div className="flex-1 h-full p-4 overflow-y-auto scrollbar scrollbar-track-slate-700 scrollbar-thumb-slate-500" ref={chatContainerRef} data-testid="chat-container">
                    <div className="flex flex-col space-y-3">
                        {messages.map((message, index) => (
                            <div key={index} className="flex flex-col space-x-2 items-start min-w-[30%]">
                                <div className="flex items-center space-x-2 mx-10 text-gray-900 font-semibold min-w-[30%]">
                                    {message.user === 'user' ? (
                                        <FaUserCircle size={26} className="text-blue-500 mr-8" />
                                    ) : (
                                        <FaRobot size={26} className="text-green-500 mr-8" />
                                    )}
                                    <div className="p-2 mb-2 shadow-custom-bottom bg-[rgb(53,145,242)] rounded-tr-xl rounded-bl-xl rounded-br-xl text-white break-all w-fit min-w-[30%]">
                                        {message.response}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-3">
                    <form onSubmit={onSend} className="flex items-center space-x-4">
                        <Textarea
                            placeholder="Enter a prompt.."
                            className="h-full bg-[rgb(31,41,55)] border-black text-white scrollbar-track-slate-700 scrollbar-thumb-slate-500"
                            value={inputText}
                            onChange={handleInputChange}
                        />
                        <Button type="submit" className="rounded-lg items-center text-sm m-2" gradientMonochrome="success">
                            <FaPaperPlane />
                        </Button>
                        <FaPaperclip size={22} className="text-green-500 cursor-pointer" onClick={handleFileClick} />
                        <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} accept=".pdf,.xlsx,.txt,.pptx,.docx,.csv"  data-testid="file-input" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DashboardComp;
