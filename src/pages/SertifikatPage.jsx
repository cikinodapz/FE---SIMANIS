import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { Plus, X, Edit2, Trash2, Eye, Check } from "lucide-react";
import Input from "../components/Input";
import { format } from "date-fns";
import bps from "/assets/bps.png";
import Swal from "sweetalert2";
import { DarkModeContext } from "../context/DarkModeContext";

const CardImage = ({
  image,
  label,
  onDelete,
  onEdit,
  onApply,
  isActive,
  onPreview,
}) => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div
      className={`group relative rounded-xl transition-all duration-300 ${
        isActive
          ? "bg-gradient-to-r from-blue-500 to-blue-600 p-1 shadow-lg hover:shadow-xl"
          : `${
              darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            } border shadow-sm hover:shadow-lg`
      }`}
    >
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg overflow-hidden ${isActive ? "p-0.5" : ""}`}
      >
        <div className="w-full h-48 overflow-hidden rounded-t-lg">
          {image}
          {isActive && (
            <div className="absolute top-0 right-0 m-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  darkMode
                    ? "bg-blue-600 text-blue-100"
                    : "bg-blue-500 text-blue-800"
                }`}
              >
                <Check className="w-4 h-4 mr-1" />
                Active
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          {label}

          <div className="space-y-3 mt-4">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={onEdit}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
                  darkMode
                    ? "text-yellow-300 bg-yellow-900/50 hover:bg-yellow-800/50"
                    : "text-yellow-700 bg-yellow-50 hover:bg-yellow-100"
                } rounded-lg transition-colors duration-200`}
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit</span>
              </button>

              <button
                onClick={onDelete}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
                  darkMode
                    ? "text-red-300 bg-red-900/50 hover:bg-red-800/50"
                    : "text-red-700 bg-red-50 hover:bg-red-100"
                } rounded-lg transition-colors duration-200`}
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>

            <button
              onClick={onApply}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? `${
                      darkMode
                        ? "text-gray-300 bg-gray-700 hover:bg-gray-600"
                        : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                    }`
                  : `${
                      darkMode
                        ? "text-white bg-blue-600 hover:bg-blue-700"
                        : "text-white bg-blue-600 hover:bg-blue-700"
                    }`
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{isActive ? "Currently Active" : "Apply Template"}</span>
            </button>

            <button
              onClick={onPreview}
              className={`w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium ${
                darkMode
                  ? "text-gray-300 bg-gray-700 hover:bg-gray-600"
                  : "text-gray-700 bg-gray-50 hover:bg-gray-100"
              } rounded-lg transition-colors duration-200`}
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TemplateManagement = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nama: "",
    file: null,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [previewContent, setPreviewContent] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleApplyTemplate = async (templateId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.patch(
        `http://localhost:3000/admin/choose-template/${templateId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchTemplates();

      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Template berhasil diterapkan.",
        timer: 1500,
        showConfirmButton: false,
        background: darkMode ? "#1f2937" : "#fff",
        confirmButtonColor: darkMode ? "#2563eb" : "#3085d6",
      });
    } catch (err) {
      console.error("Error applying template:", err);
      await Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: err.response?.data?.message || "Gagal menerapkan template",
        background: darkMode ? "#1f2937" : "#fff",
        confirmButtonColor: darkMode ? "#dc2626" : "#d33",
      });
    }
  };

  const handlePreviewTemplate = async (templateId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `http://localhost:3000/admin/lihat-template/${templateId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "arraybuffer",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      setPreviewContent({ url, templateId });
      setIsPreviewModalOpen(true);
    } catch (err) {
      console.error("Error previewing template:", err);
      await Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Gagal melihat preview template",
        background: darkMode ? "#1f2937" : "#fff",
        confirmButtonColor: darkMode ? "#dc2626" : "#d33",
      });
    }
  };

  const handleEdit = async (template) => {
    try {
      const customStyles = `
        <style>
          .edit-template-popup .swal2-input,
          .edit-template-popup .swal2-file {
            width: 90%;
            margin: 0.75em auto;
            font-size: 1.1em;
            padding: 0.75em;
            ${darkMode ? "background: #374151; color: #e5e7eb;" : ""}
          }
          .edit-template-popup .template-form-group {
            margin: 1.5em 0;
            text-align: left;
            padding: 0 1em;
          }
          .edit-template-popup .template-form-label {
            display: block;
            margin-bottom: 0.5em;
            font-weight: 600;
            color: ${darkMode ? "#d1d5db" : "#374151"};
            font-size: 0.95em;
          }
          .edit-template-popup .template-file-container {
            border: 2px dashed ${darkMode ? "#4b5563" : "#d1d5db"};
            border-radius: 0.5em;
            padding: 1.5em;
            margin-top: 0.5em;
            background: ${darkMode ? "#374151" : "#f9fafb"};
            transition: all 0.3s ease;
          }
          .edit-template-popup .template-file-container:hover {
            border-color: ${darkMode ? "#60a5fa" : "#3085d6"};
            background: ${darkMode ? "#4b5563" : "#f3f4f6"};
          }
          .edit-template-popup .template-file-description {
            margin-top: 0.75em;
            font-size: 0.85em;
            color: ${darkMode ? "#9ca3af" : "#6b7280"};
          }
          .edit-template-popup .current-file-name {
            margin-top: 0.5em;
            font-size: 0.9em;
            color: ${darkMode ? "#34d399" : "#059669"};
          }
          .swal2-confirm, .swal2-cancel {
            padding: 0.75em 2em !important;
            font-size: 1em !important;
          }
        </style>
      `;

      const { value: formValues } = await Swal.fire({
        title: "Edit Template",
        html: `
          ${customStyles}
          <div class="template-form-group">
            <label class="template-form-label">Nama Template</label>
            <input 
              id="swal-input-nama" 
              class="swal2-input" 
              placeholder="Masukkan nama template"
              value="${template.nama}"
            >
          </div>
          <div class="template-form-group">
            <label class="template-form-label">File Template</label>
            <div class="template-file-container">
              <input 
                id="swal-input-file" 
                class="swal2-file" 
                type="file"
                accept=".docx"
              >
              <p class="template-file-description">
                Format yang didukung: .docx
                <br>
                *Kosongkan jika tidak ingin mengubah file
              </p>
              <p class="current-file-name">
                File saat ini: ${template.fileName || "Tidak ada file"}
              </p>
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Simpan Perubahan",
        cancelButtonText: "Batal",
        confirmButtonColor: darkMode ? "#2563eb" : "#3085d6",
        cancelButtonColor: darkMode ? "#dc2626" : "#dc2626",
        customClass: { popup: "edit-template-popup" },
        background: darkMode ? "#1f2937" : "#fff",
        width: "550px",
        focusConfirm: false,
        preConfirm: () => {
          const nama = document.getElementById("swal-input-nama").value;
          const file = document.getElementById("swal-input-file").files[0];
          if (!nama?.trim()) {
            Swal.showValidationMessage("Nama template harus diisi");
            return false;
          }
          return { nama: nama.trim(), file };
        },
      });

      if (formValues) {
        const token = localStorage.getItem("accessToken");
        const formDataToSend = new FormData();
        formDataToSend.append("nama", formValues.nama);
        if (formValues.file) formDataToSend.append("file", formValues.file);

        await axios.patch(
          `http://localhost:3000/admin/edit-template/${template.id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        await fetchTemplates();

        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Template berhasil diperbarui",
          timer: 1500,
          showConfirmButton: false,
          background: darkMode ? "#1f2937" : "#fff",
          confirmButtonColor: darkMode ? "#2563eb" : "#3085d6",
        });
      }
    } catch (err) {
      console.error("Error editing template:", err);
      await Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: err.response?.data?.message || "Gagal memperbarui template",
        background: darkMode ? "#1f2937" : "#fff",
        confirmButtonColor: darkMode ? "#dc2626" : "#d33",
      });
    }
  };

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "http://localhost:3000/admin/list-template",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data && response.data.templates) {
        setTemplates(response.data.templates);
      }
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching templates");
      setLoading(false);
      console.error("Error fetching templates:", err);
    }
  };

  const handleDelete = async (template) => {
    try {
      const result = await Swal.fire({
        title: "Konfirmasi Hapus",
        text: `Apakah Anda yakin ingin menghapus template "${template.nama}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: darkMode ? "#dc2626" : "#d33",
        cancelButtonColor: darkMode ? "#2563eb" : "#3085d6",
        confirmButtonText: "Ya, Hapus!",
        cancelButtonText: "Batal",
        reverseButtons: true,
        background: darkMode ? "#1f2937" : "#fff",
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem("accessToken");
        await axios.delete(
          `http://localhost:3000/admin/delete-template/${template.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        await fetchTemplates();

        Swal.fire({
          icon: "success",
          title: "Terhapus!",
          text: "Template berhasil dihapus.",
          timer: 1500,
          showConfirmButton: false,
          background: darkMode ? "#1f2937" : "#fff",
          confirmButtonColor: darkMode ? "#2563eb" : "#3085d6",
        });
      }
    } catch (err) {
      console.error("Error deleting template:", err);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: err.response?.data?.message || "Gagal menghapus template",
        background: darkMode ? "#1f2937" : "#fff",
        confirmButtonColor: darkMode ? "#dc2626" : "#d33",
      });
    }
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress(0);
    setUploadStage("Memulai upload...");

    const formDataToSend = new FormData();
    formDataToSend.append("nama", formData.nama);
    formDataToSend.append("file", formData.file);

    try {
      const token = localStorage.getItem("accessToken");

      const updateProgress = (progress, stage) => {
        setUploadProgress(progress);
        setUploadStage(stage);
      };

      updateProgress(20, "Mengupload file...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await axios.post(
        "http://localhost:3000/admin/upload-template",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress =
              Math.round((progressEvent.loaded * 30) / progressEvent.total) + 20;
            updateProgress(progress, "Mengupload file...");
          },
        }
      );

      updateProgress(60, "Mengkonversi file ke PDF...");
      await new Promise((resolve) => setTimeout(resolve, 1500));

      updateProgress(80, "Membuat preview...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      updateProgress(100, "Selesai!");
      await new Promise((resolve) => setTimeout(resolve, 500));

      await fetchTemplates();
      setIsPopupVisible(false);
      setFormData({ nama: "", file: null });
      setIsUploading(false);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Template berhasil ditambahkan.",
        timer: 1500,
        showConfirmButton: false,
        background: darkMode ? "#1f2937" : "#fff",
        confirmButtonColor: darkMode ? "#2563eb" : "#3085d6",
      });
    } catch (err) {
      console.error("Error adding template:", err);
      setIsUploading(false);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: err.response?.data?.message || "Gagal menambahkan template",
        background: darkMode ? "#1f2937" : "#fff",
        confirmButtonColor: darkMode ? "#dc2626" : "#d33",
      });
    }
  };

  if (loading)
    return (
      <div
        className={`flex justify-center items-center h-screen ${
          darkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <div
          className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
            darkMode ? "border-blue-400" : "border-blue-500"
          }`}
        ></div>
      </div>
    );

  if (error)
    return (
      <div
        className={`flex justify-center items-center h-screen ${
          darkMode ? "bg-gray-900 text-red-400" : "bg-gray-100 text-red-500"
        }`}
      >
        <div>Error: {error}</div>
      </div>
    );

  return (
    <div
      className={`flex min-h-screen ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 to-indigo-900"
          : "bg-gradient-to-br from-gray-50 to-indigo-50"
      } transition-colors duration-300`}
    >
      <Sidebar />
      <div className="flex-1 md:ml-[250px]">
        <Navbar />
        <div className="p-8 lg:p-12 mt-20 max-w-7xl mx-auto">
          <div
            className={`shadow-lg p-6 ${
              darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
            } rounded-2xl bg-opacity-95 dark:bg-opacity-95 backdrop-blur-sm border transition-colors duration-300`}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1
                  className={`text-3xl font-bold ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  Daftar Template
                </h1>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } mt-2`}
                >
                  Total Template: {templates.length}
                </p>
              </div>
              <button
                onClick={() => setIsPopupVisible(true)}
                className={`inline-flex items-center gap-2 px-4 py-2 ${
                  darkMode
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Template</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {templates.map((template) => (
                <div key={template.id}>
                  <CardImage
                    image={
                      <img
                        src={bps}
                        alt="Certificate"
                        className="w-full h-full object-cover"
                      />
                    }
                    label={
                      <div className="p-4">
                        <div className="flex flex-col items-center">
                          <h3
                            className={`font-semibold text-lg mb-2 text-center ${
                              darkMode ? "text-gray-200" : "text-gray-800"
                            }`}
                          >
                            {template.nama}
                          </h3>
                          <p
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            } mb-2`}
                          >
                            Created:{" "}
                            {format(new Date(template.createdAt), "dd MMM yyyy")}
                          </p>
                        </div>
                      </div>
                    }
                    isActive={template.status === "Sedang Digunakan"}
                    onDelete={() => handleDelete(template)}
                    onEdit={() => handleEdit(template)}
                    onApply={() => handleApplyTemplate(template.id)}
                    onPreview={() => handlePreviewTemplate(template.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isPopupVisible && (
        <div
          className={`fixed inset-0 ${
            darkMode ? "bg-black/70" : "bg-black/50"
          } flex justify-center items-center z-50`}
        >
          <div
            className={`p-6 rounded-lg shadow-lg w-full max-w-md ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div
              className={`flex justify-between items-center mb-6 ${
                darkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              <h2 className="text-2xl font-semibold">Tambah Template</h2>
              <button
                onClick={() => setIsPopupVisible(false)}
                className={`${
                  darkMode
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-500 hover:text-gray-700"
                } transition-colors`}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  className={`block mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Nama Template
                </label>
                <Input
                  type="text"
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, nama: e.target.value }))
                  }
                  required
                  className={`w-full ${
                    darkMode ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Upload File (.docx)
                </label>
                <Input
                  type="file"
                  accept=".docx"
                  onChange={handleFileChange}
                  required
                  className={`w-full ${
                    darkMode ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"
                  }`}
                />
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div
                    className={`h-2 rounded-full overflow-hidden ${
                      darkMode ? "bg-gray-600" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className={`h-full ${
                        darkMode ? "bg-blue-500" : "bg-blue-600"
                      } rounded-full transition-all duration-300 ease-out`}
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <div
                    className={`flex justify-between text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <span>{uploadStage}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <Button
                  label="Cancel"
                  variant="white"
                  onClick={() => setIsPopupVisible(false)}
                  disabled={isUploading}
                  className={darkMode ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : ""}
                />
                <Button
                  label={isUploading ? "Uploading..." : "Submit"}
                  variant="blue"
                  type="submit"
                  disabled={isUploading}
                  className={darkMode ? "bg-blue-500 hover:bg-blue-600" : ""}
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {isPreviewModalOpen && (
        <div
          className={`fixed inset-0 ${
            darkMode ? "bg-black/70" : "bg-black/50"
          } flex justify-center items-center z-50`}
        >
          <div
            className={`rounded-lg shadow-xl w-[46.3%] h-[72vh] max-w-5xl flex flex-col ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div
              className={`flex justify-between items-center px-4 py-3 border-b ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <h2
                className={`text-xl font-semibold ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Preview Template
              </h2>
              <button
                onClick={() => {
                  setIsPreviewModalOpen(false);
                  if (previewContent?.url) {
                    window.URL.revokeObjectURL(previewContent.url);
                  }
                }}
                className={`${
                  darkMode
                    ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                } transition-colors p-1 rounded-full`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              className={`flex-1 p-2 ${
                darkMode ? "bg-gray-900" : "bg-gray-50"
              }`}
            >
              <div
                className={`w-[870px] h-[656px] ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <iframe
                  src={previewContent?.url}
                  className="w-full h-full"
                  title="Template Preview"
                  style={{
                    display: "block",
                    border: "none",
                    backgroundColor: darkMode ? "#1f2937" : "#fff",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateManagement;