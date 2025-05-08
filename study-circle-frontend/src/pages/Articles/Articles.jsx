import { useEffect, useState } from "react";
import axios from "axios";

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    axios.get("/api/articles", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => setArticles(res.data));
  }, []);

  const createArticle = async (e) => {
    e.preventDefault();
    const res = await axios.post("/api/articles", { title, content, tags }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    setArticles([res.data.article, ...articles]);
    setTitle(""); setContent(""); setTags("");
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-6">Articles</h2>

      <form onSubmit={createArticle} className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={e => setTags(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />
        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">
          Post Article
        </button>
      </form>

      <ul className="space-y-4">
        {articles.map(article => (
          <li key={article.id} className="p-4 bg-white border rounded">
            <h3 className="text-lg font-bold">{article.title}</h3>
            <p className="text-sm text-gray-700">{article.content}</p>
            {article.tags && <p className="text-xs text-gray-500">Tags: {article.tags}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
