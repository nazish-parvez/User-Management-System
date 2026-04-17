import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await API.get("/api/users/me");
      setUser(res.data);
      setNewName(res.data.name);
    };

    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      await API.put("/api/users/me", {
        name: newName,
      });

      setUser((prev) => ({ ...prev, name: newName }));
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {user && (
          <div className="bg-white p-6 rounded-xl shadow max-w-md space-y-3">
            
            {/* NAME */}
            <div>
              <p className="font-semibold">Name:</p>

              {!isEditing ? (
                <p>{user.name}</p>
              ) : (
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="border p-2 w-full rounded mt-1"
                />
              )}
            </div>

            <p><b>Email:</b> {user.email}</p>
            <p><b>Role:</b> {user.role}</p>

            {/* USER UPDATE */}
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-3 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Update Name
              </button>
            ) : (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleUpdate}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>

                <button
                  onClick={() => {
                    setIsEditing(false);
                    setNewName(user.name);
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* 👑 ADMIN BUTTON */}
            {user.role === "admin" && (
              <button
                onClick={() => navigate("/users")}
                className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              >
                Show All Users
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;