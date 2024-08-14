export default function Loader() {
  return (
    <div id="overlay" className="fixed inset-0 bg-gray-900 bg-opacity-50 flex flex-col items-center justify-center">
      <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-t-transparent border-white rounded-full" role="status">
        <span className="sr-only">Načítám...</span>
      </div>
      <span className="text-white text-xl">Načítám...</span>
    </div>
  );
}