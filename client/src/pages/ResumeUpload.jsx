import React, { useState, useEffect } from "react";
import FolderCard from "./studentSections/FolderCard";
import FolderModal from "./studentSections/FolderModal";
import ResumeList from "./studentSections/ResumeList";

// Import FOLDER service (axios-based)
import {
  getFolders,
  createFolder,
  renameFolder,
  deleteFolder,
} from "../services/resumeUploadService";

function ResumeUpload() {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);

  // Load folders on mount
  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      const data = await getFolders(); // axios returns data directly
      setFolders(data);
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  };

  // Create folder
  const handleCreateFolder = async (name) => {
    try {
      const newFolder = await createFolder(name);
      setFolders([newFolder, ...folders]);
      setShowModal(false);
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  // Rename folder
  const handleRenameFolder = async (id, name) => {
    try {
      const updatedFolder = await renameFolder(id, name);

      setFolders(folders.map((f) => (f._id === id ? updatedFolder : f)));

      setEditingFolder(null);
      setShowModal(false);
    } catch (error) {
      console.error("Error renaming folder:", error);
    }
  };

  // Delete folder
  const handleDeleteFolder = async (id) => {
    if (!window.confirm("Delete this folder and all its resumes?")) return;

    try {
      await deleteFolder(id);

      setFolders(folders.filter((f) => f._id !== id));

      if (selectedFolder?._id === id) {
        setSelectedFolder(null);
      }
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

  const openRenameModal = (folder) => {
    setEditingFolder(folder);
    setShowModal(true);
  };

  return (
    <div style={containerStyle}>
      {!selectedFolder ? (
        <div style={contentStyle}>
          <div style={headerStyle}>
            <h2 style={headingStyle}>Resume Folders</h2>

            <button
              onClick={() => {
                setEditingFolder(null);
                setShowModal(true);
              }}
              style={primaryButtonStyle}
            >
              + New Folder
            </button>
          </div>

          <div style={gridStyle}>
            {folders.map((folder) => (
              <FolderCard
                key={folder._id}
                folder={folder}
                onOpen={() => setSelectedFolder(folder)}
                onRename={() => openRenameModal(folder)}
                onDelete={() => handleDeleteFolder(folder._id)}
              />
            ))}
          </div>

          {folders.length === 0 && (
            <div style={emptyStateStyle}>
              <p>No folders yet. Create one to get started!</p>
            </div>
          )}
        </div>
      ) : (
        <ResumeList
          folder={selectedFolder}
          onBack={() => setSelectedFolder(null)}
        />
      )}

      {showModal && (
        <FolderModal
          folder={editingFolder}
          onSave={
            editingFolder
              ? (name) => handleRenameFolder(editingFolder._id, name)
              : handleCreateFolder
          }
          onClose={() => {
            setShowModal(false);
            setEditingFolder(null);
          }}
        />
      )}
    </div>
  );
}

// Styles
const containerStyle = {
  minHeight: "calc(100vh - 73px)",
  backgroundColor: "#f5f5f5",
};

const contentStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "2rem",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "2rem",
};

const headingStyle = {
  fontSize: "1.75rem",
  fontWeight: "600",
  color: "#2c3e50",
};

const primaryButtonStyle = {
  backgroundColor: "#3498db",
  color: "white",
  padding: "0.75rem 1.5rem",
  borderRadius: "6px",
  fontSize: "1rem",
  fontWeight: "500",
  transition: "background-color 0.2s",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: "1.5rem",
};

const emptyStateStyle = {
  textAlign: "center",
  padding: "4rem 2rem",
  color: "#7f8c8d",
  fontSize: "1.1rem",
};

export default ResumeUpload;
