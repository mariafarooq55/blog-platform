import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts?limit=100");
        const data = await res.json();
        setPosts(data.posts);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPosts(posts.filter((p) => p._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-400 mb-2">
          ⚙️ Admin Dashboard
        </h1>
        <p className="text-gray-400 mb-8">Manage all blog posts</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-center">
            <p className="text-3xl font-bold text-purple-400">{posts.length}</p>
            <p className="text-gray-400 text-sm mt-1">Total Posts</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-center">
            <p className="text-3xl font-bold text-green-400">
              {posts.filter((p) => p.status === "published").length}
            </p>
            <p className="text-gray-400 text-sm mt-1">Published</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-center">
            <p className="text-3xl font-bold text-yellow-400">
              {posts.filter((p) => p.status === "draft").length}
            </p>
            <p className="text-gray-400 text-sm mt-1">Drafts</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-gray-400 text-sm font-semibold px-5 py-4">
                    Title
                  </th>
                  <th className="text-left text-gray-400 text-sm font-semibold px-5 py-4">
                    Author
                  </th>
                  <th className="text-left text-gray-400 text-sm font-semibold px-5 py-4">
                    Status
                  </th>
                  <th className="text-left text-gray-400 text-sm font-semibold px-5 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr
                    key={post._id}
                    className="border-b border-gray-800 hover:bg-gray-800/50"
                  >
                    <td className="px-5 py-4">
                      <Link
                        to={`/post/${post.slug}`}
                        className="text-white hover:text-purple-400 text-sm font-semibold"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-sm">
                      {post.author?.name}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          post.status === "published"
                            ? "text-green-400 bg-green-400/10"
                            : "text-yellow-400 bg-yellow-400/10"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Link
                          to={`/edit-post/${post._id}`}
                          className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded-lg transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="text-xs bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-3 py-1.5 rounded-lg transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
