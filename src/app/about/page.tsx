import React from 'react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">About Student Resource Sharing Platform</h1>
      <div className="space-y-6">
        <p>
          The Student Resource Sharing Platform is a collaborative space designed to empower students in their educational journey. Our mission is to create a community where knowledge is freely shared and accessible to all.
        </p>
        <h2 className="text-2xl font-semibold">Our Vision</h2>
        <p>
          We envision a world where every student has access to high-quality educational resources, regardless of their background or location. By facilitating the sharing of notes, assignments, and projects, we aim to foster a global learning community.
        </p>
        <h2 className="text-2xl font-semibold">How It Works</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Students can upload and share their study materials.</li>
          <li>Users can search for resources by subject, topic, or file type.</li>
          <li>Collaborative features allow for discussions and improvements of shared content.</li>
          <li>A rating system helps identify the most helpful resources.</li>
        </ul>
        <h2 className="text-2xl font-semibold">Join Our Community</h2>
        <p>
          Whether you're looking to share your knowledge or find resources to aid your studies, we welcome you to join our growing community of learners and contributors.
        </p>
      </div>
    </div>
  );
}