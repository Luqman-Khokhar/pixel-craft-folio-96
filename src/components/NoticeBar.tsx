export default function NoticeBar() {
  return (
    <div className="w-full h-10 overflow-hidden bg-black text-white fixed top-0 left-0 z-[10000] flex items-center">
      <div className="flex whitespace-nowrap animate-scroll">
        <p className="mx-4">
          🚧 This website is in development. Some buttons only work when Bee Model is OFF.
        </p>
        <p className="mx-4">
          🚧 This website is in development. Some buttons only work when Bee Model is OFF.
        </p>
      </div>
    </div>
  );
}
