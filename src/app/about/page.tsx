import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">About StudyBuddy</h1>
      <p className="mb-4">
        StudyBuddy is a collaborative platform designed to help students share and access educational resources.
        Our mission is to create a community where knowledge is freely exchanged and learning is enhanced through peer support.
      </p>
      <p className="mb-4">
        We believe that everyone has something valuable to contribute, whether it&apos;s notes from a recent lecture,
        a well-crafted assignment, or an innovative project. By sharing these resources, we can all learn from each other
        and grow together.
      </p>
      <p>
        Join us in our journey to make education more accessible, collaborative, and engaging. Together, we can
        create a brighter future through shared knowledge and mutual support.
      </p>
    </div>
  );
};

export default AboutPage;