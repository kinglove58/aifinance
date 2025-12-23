import { Suspense } from "react";
import DashboardPage from "./page";
import { BarLoader } from "react-spinners";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="px-5">
      <h1 className="mb-5 gradient-title text-6xl">Dashboard</h1>
      {/* dashboard page */}
      <Suspense
        fallback={
          <BarLoader className="mt-4 " width={"100%"} color={"#36d7b7"} />
        }
      >
        <DashboardPage />
      </Suspense>
    </div>
  );
};

export default DashboardLayout;
