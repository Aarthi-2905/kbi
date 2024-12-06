import React from 'react';
import { HiX } from 'react-icons/hi';

const Toast = ({ toast, setToast }) => {
    if (!toast.show) return null;

    const alertStyle =
        toast.type === 'success'
            ? 'bg-green-100 text-green-600 border-t-4 border-green-400 shadow-lg'
            : 'bg-red-100 text-red-600 border-t-4 border-red-400 shadow-lg';

    return (
        <div
            className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 flex p-4 rounded-lg ${alertStyle} mt-5 max-w-lg w-full`}
            role="alert"
            style={{ zIndex: 9999 }}
        >
            <div className="ml-3 text-sm font-medium">{toast.message}</div>
            <button
                type="button"
                aria-label="Close"
                className="ml-auto -mx-1.5 -my-1.5 text-red-600 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8"
                onClick={() => setToast({ show: false, message: '', type: '' })}
            >
                <span className="sr-only">Close</span>
                <HiX className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Toast;
