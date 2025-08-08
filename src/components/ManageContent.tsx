import { useEffect, useState } from "react";
import { Content } from "../types";
import { getAllContent, saveContent } from "../utils/database";
import AutoResizeTextarea from "./AutoSizeTextArea";

function ManageContent() {
  const [allContent, setAllContent] = useState<Content[]>([]);
  const [saveResponse, setSaveResponse] = useState<string>("");

  useEffect(() => {
    document.title = "Admin - Manage Content | Chris Elliott Art Gallery";
    getAllContent().then(setAllContent);
  }, []);

  const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleChange = (id: number, content: string) => {
    setAllContent((prev) =>
      prev.map((c) => (c.id === id ? { ...c, content } : c))
    );
  };

  const handleSave = () => {
    saveContent(allContent).then(resp => {
      setSaveResponse(resp);
      setTimeout(() => {
        setSaveResponse("");
      }, 3000);
    });
  }

  return (
    <div className="w-full bg-white mt-5 mb-32 p-5 dashboard">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="shift">Page</th>
            <th className="shift">Name</th>
            <th className="shift">Content</th>
          </tr>
        </thead>
        <tbody>
          {allContent.map((content) => (
            <tr key={content.id}>
              <td>{capitalize(content.page)} Page</td>
              <td>{capitalize(content.name)}</td>
              <td>
                <AutoResizeTextarea
                  className="w-full bg-light p-2 leading-tight"
                  value={content.content}
                  onChange={(e) => handleChange(content.id, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-5 flex flex-row gap-4 items-center">
        <button className="button" onClick={handleSave}>Save changes</button>
        <span className={saveResponse === "" ? "opacity-0" : "fade-out"}>{saveResponse}</span>
      </div>
    </div>
  );
}

export default ManageContent;