const Post = require("../models/Post");
const slugify = require("slugify");

const createPost = async (req, res) => {
  const { title, content, category, tags, status, excerpt } = req.body;
  try {
    const slug =
      slugify(title, { lower: true, strict: true }) + "-" + Date.now();

    const post = await Post.create({
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 150),
      category,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      coverImage: req.file ? `/uploads/${req.file.filename}` : "",
      author: req.user._id,
      status: status || "published",
    });

    const populatedPost = await post.populate("author", "name avatar");
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 9 } = req.query;
    const query = { status: "published" };

    if (category && category !== "All") query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate("author", "name avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ posts, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { views: 1 } },
      { new: true },
    ).populate("author", "name avatar bio");

    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, content, category, tags, status, excerpt } = req.body;
    if (title) {
      post.title = title;
      post.slug =
        slugify(title, { lower: true, strict: true }) + "-" + Date.now();
    }
    if (content) post.content = content;
    if (category) post.category = category;
    if (tags) post.tags = tags.split(",").map((t) => t.trim());
    if (status) post.status = status;
    if (excerpt) post.excerpt = excerpt;
    if (req.file) post.coverImage = `/uploads/${req.file.filename}`;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const liked = post.likes.includes(req.user._id);
    if (liked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.user._id.toString(),
      );
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    res.json({ likes: post.likes.length, liked: !liked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostBySlug,
  updatePost,
  deletePost,
  likePost,
  getMyPosts,
};
