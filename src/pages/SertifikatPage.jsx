import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { Plus, X, Edit2, Trash2, Eye, Check } from "lucide-react";
import Input from "../components/Input";
import { format } from "date-fns";
import bps from "../assets/bps.png";
import Swal from "sweetalert2";
import DOMPurify from "dompurify";

const CardImage = ({
  image,
  label,
  onDelete,
  onEdit,
  onApply,
  isActive,
  onPreview,
}) => {
  return (
    <div
      className={`group relative rounded-xl transition-all duration-300 ${
        isActive
          ? "bg-gradient-to-r from-blue-500 to-blue-600 p-1 shadow-lg hover:shadow-xl"
          : "bg-white border border-gray-200 shadow-sm hover:shadow-lg"
      }`}
    >
      <div
        className={`bg-white rounded-lg overflow-hidden ${
          isActive ? "p-0.5" : ""
        }`}
      >
        <div className="w-full h-48 overflow-hidden rounded-t-lg">
          {image}
          {isActive && (
            <div className="absolute top-0 right-0 m-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500 text-blue-800">
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
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors duration-200"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit</span>
              </button>

              <button
                onClick={onDelete}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>

            <button
              onClick={onApply}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? "text-gray-700 bg-gray-100 hover:bg-gray-200"
                  : "text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-100"
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{isActive ? "Currently Active" : "Apply Template"}</span>
            </button>
          </div>

          <button
            onClick={onPreview} // Add onClick handler
            className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const TemplateManagement = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nama: "",
    file: null,
  });
  // Add these states at the beginning of the TemplateManagement component
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

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
      });
    } catch (err) {
      console.error("Error applying template:", err);
      await Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: err.response?.data?.message || "Gagal menerapkan template",
      });
    }
  };

  // In the TemplateManagement component, add state for preview
  const [previewContent, setPreviewContent] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Add a function to handle preview
  // Function to handle preview template
  // Modify the handlePreviewTemplate function
  const handlePreviewTemplate = async (templateId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `http://localhost:3000/admin/lihat-template/${templateId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "arraybuffer", // Important for PDF binary data
        }
      );

      // Create blob from response data
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Set preview content with PDF URL
      setPreviewContent({
        url,
        templateId: templateId,
      });
      setIsPreviewModalOpen(true);
    } catch (err) {
      console.error("Error previewing template:", err);
      await Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Gagal melihat preview template",
      });
    }
  };

  const handleEdit = async (template) => {
    console.log("Starting edit process for template:", template);
    try {
      // Add custom CSS for the popup
      const customStyles = `
        <style>
          .edit-template-popup .swal2-input,
          .edit-template-popup .swal2-file {
            width: 90%;
            margin: 0.75em auto;
            font-size: 1.1em;
            padding: 0.75em;
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
            color: #374151;
            font-size: 0.95em;
          }
          
          .edit-template-popup .template-file-container {
            border: 2px dashed #d1d5db;
            border-radius: 0.5em;
            padding: 1.5em;
            margin-top: 0.5em;
            background: #f9fafb;
            transition: all 0.3s ease;
          }
          
          .edit-template-popup .template-file-container:hover {
            border-color: #3085d6;
            background: #f3f4f6;
          }
          
          .edit-template-popup .template-file-description {
            margin-top: 0.75em;
            font-size: 0.85em;
            color: #6b7280;
          }
          
          .edit-template-popup .current-file-name {
            margin-top: 0.5em;
            font-size: 0.9em;
            color: #059669;
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
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#dc2626",
        customClass: {
          popup: "edit-template-popup",
          confirmButton: "swal2-confirm",
          cancelButton: "swal2-cancel",
        },
        width: "550px",
        focusConfirm: false,
        preConfirm: () => {
          const nama = document.getElementById("swal-input-nama").value;
          const file = document.getElementById("swal-input-file").files[0];

          if (!nama?.trim()) {
            Swal.showValidationMessage("Nama template harus diisi");
            return false;
          }

          return {
            nama: nama.trim(),
            file,
          };
        },
      });

      if (formValues) {
        const token = localStorage.getItem("accessToken");
        const formDataToSend = new FormData();
        formDataToSend.append("nama", formValues.nama);
        if (formValues.file) {
          formDataToSend.append("file", formValues.file);
        }

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
        });
      }
    } catch (err) {
      console.error("Error editing template:", err);
      await Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: err.response?.data?.message || "Gagal memperbarui template",
      });
    }
  };

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "http://localhost:3000/admin/list-template",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, Hapus!",
        cancelButtonText: "Batal",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem("accessToken");
        await axios.delete(
          `http://localhost:3000/admin/delete-template/${template.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await fetchTemplates();

        Swal.fire({
          icon: "success",
          title: "Terhapus!",
          text: "Template berhasil dihapus.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error("Error deleting template:", err);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: err.response?.data?.message || "Gagal menghapus template",
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

      // Simulate upload stages with progress
      const updateProgress = (progress, stage) => {
        setUploadProgress(progress);
        setUploadStage(stage);
      };

      // Upload the file
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
              Math.round((progressEvent.loaded * 30) / progressEvent.total) +
              20;
            updateProgress(progress, "Mengupload file...");
          },
        }
      );

      // Simulate conversion process
      updateProgress(60, "Mengkonversi file ke PDF...");
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate preview generation
      updateProgress(80, "Membuat preview...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Complete
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
      });
    } catch (err) {
      console.error("Error adding template:", err);
      setIsUploading(false);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: err.response?.data?.message || "Gagal menambahkan template",
      });
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );

  return (
    <div className="flex max-w-[95rem] mx-auto">
      <Sidebar />
      <div className="flex-1 ml-[250px] h-screen w-screen">
        <Navbar />
        <div className="p-[100px] h-screen">
          <div className="shadow-lg p-6 bg-white rounded-md mt-10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-blue-600/90 text-3xl font-bold">
                  Daftar Template
                </h1>
                <p className="text-gray-600 mt-2">
                  Total Template: {templates.length}
                </p>
              </div>
              <button
                onClick={() => setIsPopupVisible(true)}
                className="inline-flex items-center gap-2 px-4 py-2 
    bg-gradient-to-r from-blue-600 to-blue-500 
    hover:from-blue-700 hover:to-blue-600 
    text-white rounded-lg font-medium 
    shadow-lg shadow-blue-500/30 
    hover:shadow-blue-600/40 
    hover:scale-105 
    transition-all duration-300"
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
                          <h3 className="font-semibold text-lg mb-2 text-center">
                            {template.nama}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">
                            Created:{" "}
                            {format(
                              new Date(template.createdAt),
                              "dd MMM yyyy"
                            )}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Tambah Template</h2>
              <button
                onClick={() => setIsPopupVisible(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">
                  Nama Template
                </label>
                <Input
                  type="text"
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, nama: e.target.value }))
                  }
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Upload File (.docx)
                </label>
                <Input
                  type="file"
                  accept=".docx"
                  onChange={handleFileChange}
                  required
                  className="w-full"
                />
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
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
                />
                <Button
                  label={isUploading ? "Uploading..." : "Submit"}
                  variant="blue"
                  type="submit"
                  disabled={isUploading}
                />
              </div>
            </form>
          </div>
        </div>
      )}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[46.3%] h-[72vh] max-w-5xl flex flex-col">
            {/* Header - Reduced padding */}
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                Preview Template
              </h2>
              <button
                onClick={() => {
                  setIsPreviewModalOpen(false);
                  if (previewContent?.url) {
                    window.URL.revokeObjectURL(previewContent.url);
                  }
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content - Minimized padding */}
            <div className="flex-1 p-2 bg-gray-50">
              <div className="w-[870px] h-[656px] bg-white">
                <iframe
                  src={previewContent?.url}
                  className="w-full h-full"
                  title="Template Preview"
                  style={{
                    display: "block",
                    border: "none",
                    backgroundColor: "#fff",
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
