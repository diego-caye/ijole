import { Geist, Geist_Mono } from "next/font/google";
import FabricCanvas from "@/components/FrabicCanvas";
import { ModeToggle } from "@/components/ModeToggle";
import SavedImages from "@/components/SavedImages";
import { useState } from "react";
import { GetStaticPropsContext } from "next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Head from "next/head";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {

  const [refreshCounter, setRefreshCounter] = useState(0);

  return (
    <>
      <Head>
        <title>Hatsune Ijole | Meme Generator | Edit Any Image</title>
        <meta name="description" content="Image generator made for quick editing of various images or funny things like Hatsune Ijole, Teto / Kasane ijole and Akita ijole" />
      </Head>
      <div
        className={`${geistSans.className} ${geistMono.className} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen pt-8 md:p-8 pb-20 gap-16 font-[family-name:var(--font-geist-sans)]`}
      >

        <main className="gap-[32px] row-start-2 items-center sm:items-start px-12 md:px-0">
          <div className="p-9 flex justify-center gap-8">
            <LanguageSwitcher />
            <ModeToggle />
          </div>
          <FabricCanvas onSaved={() => setRefreshCounter((c) => c + 1)} />

          <SavedImages refreshTrigger={refreshCounter} />
        </main>
      </div>
    </>
  );
}
export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`../messages/${locale}.json`)).default
    }
  };
}
