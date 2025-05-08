import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Dashboard({ user }) {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock data for dashboard stats - replace with real data from your API
  const stats = {
    totalGroups: 5,
    activeSessions: 3,
    upcomingSessions: 2,
    savedArticles: 12,
    completedSessions: 24
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="font-bold text-xl text-blue-700">StudyCircle</Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/dashboard" className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/groups" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Groups
                </Link>
                <Link to="/sessions" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Sessions
                </Link>
                <Link to="/articles" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Articles
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="ml-3 relative">
                <div className="flex items-center space-x-3">
                  <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <span className="sr-only">View notifications</span>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </button>
                  <div className="flex items-center">
                    <img 
                      className="h-8 w-8 rounded-full border-2 border-blue-200" 
                      src={`https://ui-avatars.com/api/?name=${user.username}&background=random`} 
                      alt={user.username} 
                    />
                    <span className="ml-2 font-medium text-gray-700">{user.username}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="md:flex md:items-center md:justify-between mb-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Welcome back, {user.username}!
              </h2>
              <p className="mt-1 text-gray-500">
                Here's what's happening with your study activities
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <button 
                type="button" 
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Study Session
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {/* Total Groups */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                    <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Groups
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {stats.totalGroups}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link to="/groups" className="font-medium text-blue-700 hover:text-blue-900">
                    View all
                  </Link>
                </div>
              </div>
            </div>

            {/* Active Sessions */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active Sessions
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {stats.activeSessions}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link to="/sessions/active" className="font-medium text-blue-700 hover:text-blue-900">
                    Join session
                  </Link>
                </div>
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                    <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Upcoming Sessions
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {stats.upcomingSessions}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link to="/sessions/upcoming" className="font-medium text-blue-700 hover:text-blue-900">
                    View schedule
                  </Link>
                </div>
              </div>
            </div>

            {/* Saved Articles */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                    <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Saved Articles
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {stats.savedArticles}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link to="/articles" className="font-medium text-blue-700 hover:text-blue-900">
                    Browse articles
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('myGroups')}
                className={`${
                  activeTab === 'myGroups'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                My Groups
              </button>
              <button
                onClick={() => setActiveTab('mySessions')}
                className={`${
                  activeTab === 'mySessions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                My Sessions
              </button>
              <button
                onClick={() => setActiveTab('savedContent')}
                className={`${
                  activeTab === 'savedContent'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Saved Content
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2 bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Recent Activity
                  </h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <ul className="divide-y divide-gray-200">
                    <li className="py-4">
                      <div className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <span className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                          </span>
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900">You joined the "Advanced Math" group</h3>
                            <p className="text-sm text-gray-500">2 hours ago</p>
                          </div>
                          <p className="text-sm text-gray-500">
                            This group has 12 members and focuses on calculus and linear algebra.
                          </p>
                        </div>
                      </div>
                    </li>
                    <li className="py-4">
                      <div className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <span className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </span>
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900">You scheduled a study session for CS101</h3>
                            <p className="text-sm text-gray-500">Yesterday</p>
                          </div>
                          <p className="text-sm text-gray-500">
                            The session is scheduled for tomorrow at 6:00 PM. 3 people have joined.
                          </p>
                        </div>
                      </div>
                    </li>
                    <li className="py-4">
                      <div className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <span className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </span>
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900">You saved "Effective Study Techniques" article</h3>
                            <p className="text-sm text-gray-500">2 days ago</p>
                          </div>
                          <p className="text-sm text-gray-500">
                            This article includes methods like spaced repetition and the Pomodoro technique.
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="px-4 py-4 sm:px-6 bg-gray-50 rounded-b-lg">
                  <a href="#" className="text-sm font-medium text-blue-700 hover:text-blue-900">View all activity <span aria-hidden="true">&rarr;</span></a>
                </div>
              </div>
              
              {/* Upcoming Sessions */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Upcoming Sessions
                  </h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <ul className="divide-y divide-gray-200">
                    <li className="py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">CS101 Final Review</p>
                          <p className="text-sm text-gray-500">Tomorrow, 6:00 PM</p>
                        </div>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">3 attending</span>
                      </div>
                    </li>
                    <li className="py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Physics Problem Solving</p>
                          <p className="text-sm text-gray-500">Friday, 4:00 PM</p>
                        </div>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">5 attending</span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="px-4 py-4 sm:px-6 bg-gray-50 rounded-b-lg">
                  <button className="w-full bg-blue-50 text-blue-700 px-4 py-2 text-sm font-medium rounded hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Schedule New Session
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'myGroups' && (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">My Study Groups</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700">Create New Group</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Group Card 1 */}
                <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
                    <div className="absolute bottom-0 left-0 w-full p-4 text-white">
                      <h4 className="font-bold">Advanced Math</h4>
                      <p className="text-sm text-blue-100">12 members</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-4">Focus on calculus and linear algebra for engineering students.</p>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">2 upcoming sessions</span>
                      <Link to="/groups/1" className="text-xs text-blue-600 hover:text-blue-800">View Group</Link>
                    </div>
                  </div>
                </div>

                {/* Group Card 2 */}
                <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-32 bg-gradient-to-r from-green-500 to-teal-600 relative">
                    <div className="absolute bottom-0 left-0 w-full p-4 text-white">
                      <h4 className="font-bold">CS101 Study Group</h4>
                      <p className="text-sm text-green-100">8 members</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-4">Introduction to programming and computer science fundamentals.</p>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">1 upcoming session</span>
                      <Link to="/groups/2" className="text-xs text-blue-600 hover:text-blue-800">View Group</Link>
                    </div>
                  </div>
                </div>
                
                {/* Join New Group Card */}
                <div className="border border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center hover:bg-gray-50">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Join a New Group</h4>
                  <p className="text-xs text-gray-500 text-center mb-4">Discover groups based on your interests</p>
                  <Link to="/groups/discover" className="text-sm text-blue-600 hover:text-blue-800">Browse Groups</Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mySessions' && (
            <div className="bg-white shadow rounded-lg p-6">
              <p>My Sessions content</p>
            </div>
          )}

          {activeTab === 'savedContent' && (
            <div className="bg-white shadow rounded-lg p-6">
              <p>Saved Content goes here</p>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}