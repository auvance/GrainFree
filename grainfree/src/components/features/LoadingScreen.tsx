"use client";

export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#475845] text-white">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-lg font-medium">Building your meal plan for a better life...</p>
      </div>
    </div>
  );
}
