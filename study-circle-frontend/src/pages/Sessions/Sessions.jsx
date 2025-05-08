import { useEffect, useState } from "react";
import axios from "axios";

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [title, setTitle] = useState("");
  const [groupId, setGroupId] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    axios.get("/api/sessions", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => setSessions(res.data));
  }, []);

  const createSession = async (e) => {
    e.preventDefault();
    const body = {
      title,
      group_id: parseInt(groupId),
      date_time: new Date(dateTime).toISOString(),
      description
    };

    const res = await axios.post("/api/sessions", body, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    setSessions([...sessions, res.data.session]);
    setTitle(""); setGroupId(""); setDateTime(""); setDescription("");
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-6">Study Sessions</h2>

      <form onSubmit={createSession} className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="Session Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Group ID"
          value={groupId}
          onChange={e => setGroupId(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          type="datetime-local"
          value={dateTime}
          onChange={e => setDateTime(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Create Session
        </button>
      </form>

      <ul className="space-y-3">
        {sessions.map(session => (
          <li key={session.id} className="border p-4 rounded bg-white">
            <h3 className="text-lg font-semibold">{session.title}</h3>
            <p className="text-gray-700">{session.description}</p>
            <p className="text-sm text-gray-500">Time: {new Date(session.date_time).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
