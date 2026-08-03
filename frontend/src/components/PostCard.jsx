import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-purple-500 transition group">
      {post.coverImage ? (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-48 object-cover group-hover:opacity-90 transition"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-purple-900 to-gray-900 flex items-center justify-center">
          <span className="text-4xl">✍️</span>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-purple-400 bg-purple-400/10 px-2 py-1 rounded-full">
            {post.category}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>

        <Link to={`/post/${post.slug}`}>
          <h2 className="text-white font-bold text-lg mb-2 hover:text-purple-400 transition line-clamp-2">
            {post.title}
          </h2>
        </Link>

        <p className="text-gray-400 text-sm line-clamp-2 mb-4">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
              {post.author?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-gray-400 text-xs">{post.author?.name}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-500 text-xs">
            <span>❤️ {post.likes?.length || 0}</span>
            <span>👁️ {post.views || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
