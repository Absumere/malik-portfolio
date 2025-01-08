export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-2 border-neutral-600 border-t-neutral-200 rounded-full animate-spin"></div>
    </div>
  );
}
