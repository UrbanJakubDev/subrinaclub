import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex items-center justify-center min-h-screen px-4 py-8 bg-gray-50">
            <div className="max-w-md p-6 text-center bg-white rounded-lg shadow-md">
                <h2 className="mb-4 text-2xl font-bold text-gray-800">Page Not Found</h2>
                <p className="mb-6 text-gray-600">
                    The page you are looking for doesn't exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none">
                    Return Home
                </Link>
            </div>
        </div>
    )
}
