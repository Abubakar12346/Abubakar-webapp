import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ReelsPage = () => {
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [comments, setComments] = useState({});
  const [showCommentSection, setShowCommentSection] = useState(null);
  const videoRefs = useRef([]);
  const navigate = useNavigate(); // For navigation

  // Fetch videos from backend
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("/api/videos");
        setVideos(response.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos();
  }, []);

  // Handle video upload
  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("title", title);

    try {
      const response = await axios.post("/api/videos/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setVideos([response.data.video, ...videos]);
      setTitle("");
      setVideoFile(null);
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    navigate("/login"); // Redirect to LoginPage
  };

  // Handle video delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/videos/${id}`);
      setVideos(videos.filter((video) => video._id !== id));
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  // Handle like
  const handleLike = async (id) => {
    try {
      const updatedVideos = videos.map((video) => {
        if (video._id === id) {
          return { ...video, likes: (video.likes || 0) + 1 };
        }
        return video;
      });
      setVideos(updatedVideos);
      await axios.post(`/api/videos/${id}/like`);
    } catch (error) {
      console.error("Error liking video:", error);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (e, id) => {
    e.preventDefault();
    const commentText = comments[id] || "";

    if (commentText.trim() === "") return;

    try {
      const updatedVideos = videos.map((video) => {
        if (video._id === id) {
          return {
            ...video,
            comments: [...(video.comments || []), commentText],
          };
        }
        return video;
      });

      setVideos(updatedVideos);
      setComments({ ...comments, [id]: "" });
      await axios.post(`/api/videos/${id}/comment`, { comment: commentText });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center w-full px-6 py-4 bg-gray-800 shadow-md">
        <h1 className="text-4xl font-bold text-blue-400">Reels</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:ring-2 focus:ring-red-300"
        >
          Logout
        </button>
      </div>

      {/* Video Upload Form */}
      <form
        onSubmit={handleUpload}
        className="bg-gray-800 shadow-lg rounded-lg px-8 pt-6 pb-8 mb-6 w-full max-w-lg mt-4"
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter video title"
          className="mb-4 p-3 border border-gray-600 rounded w-full bg-gray-700 text-gray-100 placeholder-gray-400"
          required
        />
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files[0])}
          className="mb-4 p-3 border border-gray-600 rounded w-full bg-gray-700 text-gray-100"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full"
        >
          Upload Video
        </button>
      </form>

      {/* Video Feed */}
      <div className="flex flex-col items-center w-full">
        {videos.map((video, index) => (
          <div
            key={video._id}
            className="w-full md:w-3/4 mb-8 bg-gray-800 rounded-lg shadow-md overflow-hidden relative"
          >
            <div className="flex justify-between items-center p-4 bg-gray-700">
              <h2 className="text-lg font-bold">{video.title}</h2>
              <button
                onClick={() => handleDelete(video._id)}
                className="bg-red-500 text-white px-4 py-1 rounded"
              >
                Delete
              </button>
            </div>

            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={`http://localhost:5000/${video.videoPath}`}
              className="w-full max-h-[500px]"
              loop
              muted
              controls
            />

            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 space-y-4">
              <button
                onClick={() => handleLike(video._id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-full"
              >
                ❤️ {video.likes || 0}
              </button>
              <button
                onClick={() =>
                  setShowCommentSection(
                    showCommentSection === video._id ? null : video._id
                  )
                }
                className="bg-purple-500 text-white px-4 py-2 rounded-full"
              >
                💬
              </button>
            </div>

            {/* Comments */}
            {showCommentSection === video._id && (
              <div className="absolute inset-0 bg-gray-900 p-4">
                <h3 className="text-lg font-bold mb-4">Comments</h3>
                <form
                  onSubmit={(e) => handleCommentSubmit(e, video._id)}
                  className="flex space-x-2 mb-4"
                >
                  <input
                    type="text"
                    value={comments[video._id] || ""}
                    onChange={(e) =>
                      setComments({ ...comments, [video._id]: e.target.value })
                    }
                    placeholder="Write a comment..."
                    className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Post
                  </button>
                </form>
                <div>
                  {video.comments &&
                    video.comments.map((comment, index) => (
                      <p
                        key={index}
                        className="bg-gray-800 p-3 rounded mb-2"
                      >
                        {comment}
                      </p>
                    ))}
                </div>
                <button
                  onClick={() => setShowCommentSection(null)}
                  className="absolute top-4 right-4 bg-gray-700 text-white px-2 py-1 rounded"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReelsPage;
