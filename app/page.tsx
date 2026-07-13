import PersonalizedBanner from "./components/PersonalizedBanner";
import Tabs from "./components/Tabs";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <Tabs />
      <PersonalizedBanner />
      <main className="flex flex-1 flex-col gap-4 px-6 sm:px-16 py-12 max-w-3xl">
        <h2 className="text-2xl font-semibold">JS Luwansa Hotel & Convention Center</h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Terletak strategis di Jakarta, JS Luwansa menawarkan kenyamanan menginap untuk
          liburan maupun perjalanan bisnis, serta fasilitas MICE lengkap untuk meeting,
          konferensi, dan acara korporat Anda. Jelajahi pilihan kamar atau ruang meeting kami
          lewat tab di atas.
        </p>
      </main>
    </div>
  );
}
