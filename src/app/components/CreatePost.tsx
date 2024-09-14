import React, { useState } from 'react';

const CreatePost: React.FC = () => {
  const [postType, setPostType] = useState('note');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the post data to your backend
    console.log('Post submitted:', { type: postType, content });
    // Reset form
    setContent('');
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4">Create a Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Post Type</label>
          <select
            value={postType}
            onChange={(e) => setPostType(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="note">Note</option>
            <option value="assignment">Assignment</option>
            <option value="project">Project</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            rows={4}
          ></textarea>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
          Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;