import { TemperatureDashboard } from "@/components/temperature-dashboard";

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl">
        <TemperatureDashboard />
      </div>
    </main>
  );
}
