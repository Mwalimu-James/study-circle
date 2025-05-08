import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function GroupDetail() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);

  useEffect(() => {
    axios.get(`/api/groups/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => setGroup(res.data));
  }, [id]);

  if (!group) return <div className="p-10">Loading group info...</div>;

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold mb-4">{group.name}</h2>
      <p className="mb-4">{group.description}</p>
      <p className="text-sm text-gray-500">Group ID: {group.id}</p>
    </div>
  );
}
