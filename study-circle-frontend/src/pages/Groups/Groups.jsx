import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "General",
    isPrivate: false
  });
  const [view, setView] = useState("myGroups"); // myGroups, discover, or create

  // Load groups on mount
  useEffect(() => {
    const fetchGroups = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("/api/groups", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setGroups(res.data.groups || []);
        setError("");
      } catch (err) {
        console.error("Error fetching groups:", err.response?.data || err.message);
        setError("Failed to load groups. Please try again.");
        setGroups([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // Create new group
  const createGroup = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    
    try {
      const res = await axios.post("/api/groups",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          }
        }
      );
      setGroups([...groups, res.data.group]);
      setFormData({
        name: "",
        description: "",
        category: "General",
        isPrivate: false
      });
      setView("myGroups");
      setError("");
    } catch (err) {
      console.error("Error creating group:", err.response?.data || err.message);
      setError("Failed to create group. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  // Delete group
  const deleteGroup = async (groupId) => {
    if (!window.confirm("Are you sure you want to delete this group? This action cannot be undone.")) return;

    try {
      await axios.delete(`/api/groups/${groupId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setGroups(groups.filter(group => group.id !== groupId));
    } catch (err) {
      console.error("Error deleting group:", err.response?.data || err.message);
      setError("Failed to delete group. Please try again.");
    }
  };

  // Join group
  const joinGroup = async (groupId) => {
    try {
      await axios.post(`/api/groups/${groupId}/join`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      // Update the local state to reflect this change
      // This is a simplified approach - in a real app you might refetch the groups
      const updatedGroups = groups.map(group => 
        group.id === groupId ? {...group, isMember: true, memberCount: (group.memberCount || 0) + 1} : group
      );
      setGroups(updatedGroups);
    } catch (err) {
      console.error("Error joining group:", err.response?.data || err.message);
      setError("Failed to join group. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="font-bold text-xl text-blue-700">StudyCircle</Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/dashboard" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/groups" className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
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
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Study Groups</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* View Toggle Tabs */}
            <div className="px-4 sm:px-0">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <button
                    onClick={() => setView("myGroups")}
                    className={`${
                      view === "myGroups"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    My Groups
                  </button>
                  <button
                    onClick={() => setView("discover")}
                    className={`${
                      view === "discover"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Discover
                  </button>
                  <button
                    onClick={() => setView("create")}
                    className={`${
                      view === "create"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Create New Group
                  </button>
                </nav>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-6 mx-4 sm:mx-0 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Create Group Form */}
            {view === "create" && (
              <div className="mt-6 bg-white shadow rounded-lg overflow-hidden mx-4 sm:mx-0">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Create a New Study Group</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Start a new study group to collaborate with peers on specific subjects or topics.
                  </p>
                  
                  <form onSubmit={createGroup} className="mt-5 space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Group Name*
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="e.g., Calculus Study Group"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="description"
                          name="description"
                          rows={4}
                          value={formData.description}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="Describe what your group will study, who should join, and what members can expect."
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <div className="mt-1">
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option>General</option>
                          <option>Mathematics</option>
                          <option>Science</option>
                          <option>Computer Science</option>
                          <option>Languages</option>
                          <option>Humanities</option>
                          <option>Business</option>
                          <option>Arts</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="isPrivate"
                          name="isPrivate"
                          type="checkbox"
                          checked={formData.isPrivate}
                          onChange={handleInputChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="isPrivate" className="font-medium text-gray-700">Private Group</label>
                        <p className="text-gray-500">If checked, users must request to join this group.</p>
                      </div>
                    </div>

                    <div className="pt-5">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setView("myGroups")}
                          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isCreating}
                          className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                            isCreating ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        >
                          {isCreating ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Creating...
                            </>
                          ) : (
                            "Create Group"
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* My Groups View */}
            {view === "myGroups" && (
              <div className="mt-6 mx-4 sm:mx-0">
                {isLoading ? (
                  <div className="text-center py-12">
                    <svg className="animate-spin mx-auto h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">Loading your groups...</p>
                  </div>
                ) : Array.isArray(groups) && groups.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {groups.map((group) => (
                      <div key={group.id} className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                          <div className="flex items-start justify-between">
                            <h3 className="text-lg font-medium text-gray-900 truncate">{group.name}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              group.isPrivate ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"
                            }`}>
                              {group.isPrivate ? "Private" : "Public"}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-gray-500 line-clamp-3">{group.description || "No description provided."}</p>
                          
                          <div className="mt-4 flex items-center text-sm text-gray-500">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                            </svg>
                            {group.memberCount || 1} members
                          </div>
                        </div>
                        <div className="bg-gray-50 px-5 py-3 flex justify-between">
                          <Link to={`/groups/${group.id}`} className="text-sm font-medium text-blue-700 hover:text-blue-900">
                            View details
                          </Link>
                          <button
                            onClick={() => deleteGroup(group.id)}
                            className="text-sm font-medium text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {/* Create Group Card */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Create a new group</h3>
                      <p className="mt-1 text-sm text-gray-500">Get started by creating a new study group</p>
                      <button
                        type="button"
                        onClick={() => setView("create")}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Create Group
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white shadow rounded-lg">
                    <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No groups yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new study group.</p>
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={() => setView("create")}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Create Group
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Discover Groups View */}
            {view === "discover" && (
              <div className="mt-6 mx-4 sm:mx-0">
                <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Discover Study Groups
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Find groups that match your study interests.
                    </p>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <div className="space-y-4">
                      {/* This is just sample data - you would fetch this from your API */}
                      {[
                        { id: 101, name: "Advanced Physics", description: "Study group for university physics courses focusing on quantum mechanics and relativity.", memberCount: 8, category: "Science", isPrivate: false },
                        { id: 102, name: "Web Development", description: "Learning React, Node.js, and modern web development practices.", memberCount: 15, category: "Computer Science", isPrivate: false },
                        { id: 103, name: "Spanish Language", description: "Practice conversational Spanish and grammar for intermediate learners.", memberCount: 12, category: "Languages", isPrivate: false }
                      ].map((group) => (
                        <div key={group.id} className="bg-white overflow-hidden border rounded-lg hover:shadow-md transition-shadow">
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="flex-shrink-0">
                                  <span className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <h4 className="text-lg font-semibold">{group.name}</h4>
                                  <div className="flex items-center mt-1">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                      {group.category}
                                    </span>
                                    <p className="ml-2 text-sm text-gray-500">
                                      {group.memberCount} members
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => joinGroup(group.id)}
                                className="ml-8 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Join Group
                              </button>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="mt-2 text-sm text-gray-500 sm:mt-0">
                                {group.description}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}