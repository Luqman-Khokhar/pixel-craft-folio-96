export default function NoticeBar({notice =''}) {
  return (
    <div className="w-full h-10 overflow-hidden bg-black text-white fixed top-0 left-0 z-[10000] flex items-center">
      <div className="flex whitespace-nowrap animate-scroll">
        <p className="mx-4">
          {notice}
        </p>
        <p className="mx-4">
          {notice}
        </p>
      </div>
    </div>
  );
}
