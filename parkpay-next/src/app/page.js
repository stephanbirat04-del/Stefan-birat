import Hero from "./components/Hero";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>ParkPay – Smart Parking Management</title>
        <meta name="description" content="A sleek SaaS platform for parking‑lot owners to manage spaces, payments and analytics." />
      </Head>
      <main className="flex min-h-screen flex-col bg-gray-900">
        <Hero />
      </main>
    </>
  );
}
