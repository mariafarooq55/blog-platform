import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await fetch("/api/posts/my-posts", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyPosts();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex justify-center items-center">
        <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-purple-400">📝 My Posts</h1>
          <Link
            to="/create-post"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg transition text-sm"
          >
            + New Post
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-gray-400 text-lg mb-4">No posts yet</p>
            <Link
              to="/create-post"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              Write your first post
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center justify-between hover:border-purple-500 transition"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded-full">
                      {post.category}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        post.status === "published"
                          ? "text-green-400 bg-green-400/10"
                          : "text-yellow-400 bg-yellow-400/10"
                      }`}
                    >
                      {post.status}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold">{post.title}</h3>
                  <p className="text-gray-500 text-xs mt-1">
                    {new Date(post.createdAt).toLocaleDateString()} • ❤️{" "}
                    {post.likes?.length || 0} • 👁️ {post.views || 0}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Link
                    to={`/edit-post/${post._id}`}
                    className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="text-sm bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-3 py-1.5 rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPosts;
