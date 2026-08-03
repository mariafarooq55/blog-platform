import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PostDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${slug}`);
        const data = await res.json();
        setPost(data);
        setLikesCount(data.likes?.length || 0);
        setLiked(user && data.likes?.includes(user._id));

        const commentsRes = await fetch(`/api/comments/${data._id}`);
        const commentsData = await commentsRes.json();
        setComments(commentsData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const handleLike = async () => {
    if (!user) return navigate("/login");
    try {
      const res = await fetch(`/api/posts/${post._id}/like`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setLiked(data.liked);
      setLikesCount(data.likes);
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    try {
      const res = await fetch(`/api/comments/${post._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content: comment }),
      });
      const data = await res.json();
      setComments([data, ...comments]);
      setComment("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async (id) => {
    try {
      await fetch(`/api/comments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setComments(comments.filter((c) => c._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      navigate("/");
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

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-950 flex justify-center items-center">
        <p className="text-gray-400 text-lg">Post not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Category & Date */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-semibold text-purple-400 bg-purple-400/10 px-3 py-1 rounded-full">
            {post.category}
          </span>
          <span className="text-gray-500 text-sm">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-6">{post.title}</h1>

        {/* Author */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
              {post.author?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white font-semibold">{post.author?.name}</p>
              <p className="text-gray-500 text-xs">{post.author?.bio}</p>
            </div>
          </div>

          {user && (user._id === post.author?._id || user.role === "admin") && (
            <div className="flex gap-2">
              <Link
                to={`/edit-post/${post._id}`}
                className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition"
              >
                Edit
              </Link>
              <button
                onClick={handleDeletePost}
                className="text-sm bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-3 py-1.5 rounded-lg transition"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full rounded-2xl mb-8 max-h-96 object-cover"
          />
        )}

        {/* Content */}
        <div
          className="text-gray-300 leading-relaxed prose prose-invert max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag, i) => (
              <span
                key={i}
                className="text-xs text-purple-400 bg-purple-400/10 px-3 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Like & Views */}
        <div className="flex items-center gap-6 py-6 border-t border-gray-800 mb-8">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 text-sm font-semibold transition ${
              liked ? "text-red-400" : "text-gray-400 hover:text-red-400"
            }`}
          >
            {liked ? "❤️" : "🤍"} {likesCount} Likes
          </button>
          <span className="text-gray-500 text-sm">👁️ {post.views} Views</span>
        </div>

        {/* Comments */}
        <div className="border-t border-gray-800 pt-8">
          <h3 className="text-white font-bold text-xl mb-6">
            💬 Comments ({comments.length})
          </h3>

          {user ? (
            <form onSubmit={handleComment} className="mb-6">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                rows={3}
                required
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition mb-3"
              />
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg transition"
              >
                Post Comment
              </button>
            </form>
          ) : (
            <p className="text-gray-400 text-sm mb-6">
              <Link to="/login" className="text-purple-400 hover:underline">
                Login
              </Link>{" "}
              to comment
            </p>
          )}

          <div className="space-y-4">
            {comments.map((c) => (
              <div
                key={c._id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
                      {c.author?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white text-sm font-semibold">
                      {c.author?.name}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {user &&
                    (user._id === c.author?._id || user.role === "admin") && (
                      <button
                        onClick={() => handleDeleteComment(c._id)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        Delete
                      </button>
                    )}
                </div>
                <p className="text-gray-300 text-sm">{c.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
