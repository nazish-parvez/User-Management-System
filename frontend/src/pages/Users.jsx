import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import Navbar from "../components/Navbar";

function Users() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);

  const [editingUser, setEditingUser] = useState(null);
  const [newName, setNewName] = useState("");

  const [currentUser, setCurrentUser] = useState(null);

  //  Fetch logged-in user
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/api/users/me");
        setCurrentUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);

  //  Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await API.get(
          `/api/users?page=${page}&search=${search}`
        );

        const activeUsers = res.data.users.filter(
          (u) => u.status !== "inactive"
        );

        setUsers(activeUsers);
      } catch (error) {
        console.log("Fetch Error:", error.response?.data || error.message);
      }
      setLoading(false);
    };

    fetchUsers();
  }, [page, search]);

  //  Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await API.delete(`/api/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  //  Update
  const handleUpdate = async () => {
    try {
      await API.put(`/api/users/${editingUser._id}`, {
        name: newName,
      });

      setEditingUser(null);
      setPage(1);
    } catch (error) {
      console.log(error);
    }
  };

  // Block non-admin
  if (currentUser && currentUser.role !== "admin") {
    return (
      <>
        <Navbar />
        <div className="p-6">
          <h2 className="text-xl font-bold text-red-500">
            Access Denied
          </h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="p-4 sm:p-6 bg-[#222] min-h-screen">
        
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 inline-flex items-center gap-2 bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded text-sm"
        >
          ← Back to Dashboard
        </button>

        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white">
          Users
        </h2>

        {/* Search */}
        <input
          placeholder="Search users..."
          className="border p-3 mb-6 w-full rounded-md bg-white"
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {/* Users List */}
        <div className="bg-white rounded-lg overflow-hidden">
          {loading ? (
            <p className="text-center p-4">Loading...</p>
          ) : users.length > 0 ? (
            users.map((u) => (
              <div
                key={u._id}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 px-4 py-3 border-b hover:bg-gray-50"
              >
                <div className="break-words">
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs sm:text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    {u.role}
                  </span>

                  <button
                    onClick={() => {
                      setEditingUser(u);
                      setNewName(u.name);
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(u._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center p-4">No users found</p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between gap-2 mt-4">
          <button
            onClick={() => setPage(page > 1 ? page - 1 : 1)}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 w-full sm:w-auto"
          >
            Prev
          </button>

          <button
            onClick={() => setPage(page + 1)}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 w-full sm:w-auto"
          >
            Next
          </button>
        </div>

        {/* Edit Form */}
        {editingUser && (
          <div className="bg-white p-4 mt-6 shadow rounded">
            <h3 className="font-bold mb-3">Edit User</h3>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="border p-2 rounded w-full"
              />

              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-3 py-2 rounded"
              >
                Save
              </button>

              <button
                onClick={() => setEditingUser(null)}
                className="bg-gray-400 text-white px-3 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Users;