import { useEffect, useState } from "react";
import API from "../utils/api";
import Navbar from "../components/Navbar";

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);

  const [editingUser, setEditingUser] = useState(null);
  const [newName, setNewName] = useState("");

  const [currentUser, setCurrentUser] = useState(null);

  // 🔹 Fetch logged-in user (role check)
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

  // 🔹 Fetch users (FIXED)
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await API.get(
          `/api/users?page=${page}&search=${search}`
        );

        // hide inactive users
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

  // 🔹 Delete User
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    try {
      await API.delete(`/api/users/${id}`);

      // remove instantly from UI
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (error) {
      console.log("Delete Error:", error.response?.data || error.message);
      alert(
        error.response?.data?.message ||
        "Delete failed (check admin role or token)"
      );
    }
  };

  // 🔹 Update User
  const handleUpdate = async () => {
    try {
      await API.put(`/api/users/${editingUser._id}`, {
        name: newName,
      });

      setEditingUser(null);
      setPage(1); // trigger refresh
    } catch (error) {
      console.log("Update Error:", error.response?.data || error.message);
    }
  };

  // 🔒 Block non-admin users
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

      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold mb-6">Users</h2>

        {/* 🔍 Search */}
        <input
          placeholder="Search users..."
          className="border p-3 mb-4 w-full rounded-lg focus:ring-2 focus:ring-blue-400"
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {/* 📦 Users List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? (
            <p className="text-center p-4">Loading...</p>
          ) : users.length > 0 ? (
            users.map((u) => (
              <div
                key={u._id}
                className="flex justify-between items-center p-4 border-b hover:bg-gray-50"
              >
                <div>
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                </div>

                {/* 👑 Admin controls only */}
                <div className="flex gap-2 items-center">
                  <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                    {u.role}
                  </span>

                  <button
                    onClick={() => {
                      setEditingUser(u);
                      setNewName(u.name);
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(u._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
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

        {/* 🔁 Pagination */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setPage(page > 1 ? page - 1 : 1)}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Prev
          </button>

          <button
            onClick={() => setPage(page + 1)}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Next
          </button>
        </div>

        {/* ✏️ Edit Form */}
        {editingUser && (
          <div className="bg-white p-4 mt-6 shadow rounded">
            <h3 className="font-bold mb-3">Edit User</h3>

            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border p-2 mr-2 rounded"
            />

            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
            >
              Save
            </button>

            <button
              onClick={() => setEditingUser(null)}
              className="bg-gray-400 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Users;