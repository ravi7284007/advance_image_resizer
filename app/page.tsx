import ImageResizer from './components/image-resizer/ImageResizer';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 font-sans p-5">
      <ImageResizer />
    </div>
  );
}
