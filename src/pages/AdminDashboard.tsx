import { Link } from "react-router-dom";
import ManagePaintings from "../components/ManagePaintings";
import ManageContent from "../components/ManageContent";

export enum AdminPage {
  Home,
  Paintings,
  Content
}

interface AdminDashboardProps {
  page: AdminPage
}

function AdminDashboard({ page }: AdminDashboardProps) {
  return (
    <div className="fade-in">
      <div className="px-5 mt-14">
        <h1 className="text-6xl sm:text-7xl font-serif mt-32 mb-5">
          Admin Dashboard
        </h1>
        <div className="flex flex-row gap-2 pt-5">
          <Link to="/admin/paintings" className={`bg-white px-4 py-2 duration-300 ${page !== AdminPage.Paintings && "opacity-50"}`}>Manage Paintings</Link>
          <Link to="/admin/content" className={`bg-white px-4 py-2 duration-300 ${page !== AdminPage.Content && "opacity-50"}`}>Manage Content</Link>
        </div>
        {page === AdminPage.Paintings && (
          <ManagePaintings />
        )}
        {page === AdminPage.Content && (
          <ManageContent />
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;