import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  MapPin,
  Edit,
  UserCircle2,
  GraduationCap,
  BookOpen,
  IdCard,
  FileText,
  FileSignature,
  Camera,
  Calendar,
} from "lucide-react";
import LogoNav from "../components/LogoNav";
import Sidebar from "../components/SideNav";
import { API_URL } from "../../env-config";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem("user");
      if (!storedProfile) {
        toast.error("No profile found. Please log in.");
        setLoading(false);
        return;
      }
      const parsedProfile = JSON.parse(storedProfile);
      setProfile(parsedProfile);
      setFormData(parsedProfile);
    } catch (error) {
      toast.error("Failed to load profile.");
      console.error("Profile parse error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cleanedData = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v !== "" && v !== null)
      );

      const queryParams = Object.entries(cleanedData)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&");

      const response = await fetch(
        API_URL + `/profile/student/update?${queryParams}`,
        {
          method: "PUT",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Update failed");

      const updated = await response.json();
      setProfile(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      toast.success("Profile Updated Successfully");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Profile update failed.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );

  if (!profile)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">No profile data available</p>
      </div>
    );

  const avatar =
    profile.profile_pic_link ||
    (profile.gender === "female"
      ? "https://cdn-icons-png.flaticon.com/512/6997/6997662.png"
      : "https://cdn-icons-png.flaticon.com/512/6997/6997661.png");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <Toaster position="top-right" />
        <LogoNav />

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="col-span-2 flex flex-col gap-6">
            {/* Personal Info */}
            <Card title="Personal Info" icon={<UserCircle2 />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Info label="Full Name" value={profile.name} />
                <Info label="Gender" value={profile.gender || "—"} />
                <Info label="Email" value={profile.email} />
                <Info label="Date of Birth" value={profile.date_of_birth || "—"} />
                <Info label="Phone No" value={profile.phone_no || "—"} />
                <Info label="Username" value={profile.username} />
              </div>
            </Card>

            {/* Academic Info */}
            <Card title="Academic Info" icon={<GraduationCap />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Info label="Roll Number" value={profile.roll_number} />
                <Info label="Branch" value={profile.branch} />
                <Info label="Course" value={profile.course} />
                <Info label="Batch" value={profile.batch} />
                <Info label="SSC CGPA" value={profile.ssc_cgpa || "—"} />
                <Info label="HSC CGPA" value={profile.hsc_cgpa || "—"} />
                <Info label="BTech CGPA" value={profile.btech_cgpa || "—"} />
                <Info label="MTech CGPA" value={profile.mtech_cgpa || "—"} />
                <Info label="Backlogs" value={profile.backlogs} />
              </div>
            </Card>

            {/* Address Info */}
            <Card title="Address Details" icon={<MapPin />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Info label="Current Address" value={profile.current_address || "—"} />
                <Info label="Permanent Address" value={profile.permanent_address || "—"} />
              </div>
            </Card>

            {/* IDs */}
            <Card title="Identity Documents" icon={<IdCard />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Info
                  label="Aadhar Card"
                  value={
                    profile.aadhar_card_link ? (
                      <a
                        href={profile.aadhar_card_link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Aadhar
                      </a>
                    ) : (
                      "—"
                    )
                  }
                />
                <Info
                  label="PAN Card"
                  value={
                    profile.pan_card_link ? (
                      <a
                        href={profile.pan_card_link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View PAN
                      </a>
                    ) : (
                      "—"
                    )
                  }
                />
              </div>
            </Card>

            {/* Career Info */}
            <Card title="Career Info" icon={<BookOpen />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Info label="Career Path" value={profile.career_path || "—"} />
                <Info
                  label="Resume"
                  value={
                    profile.resume_link ? (
                      <a
                        href={profile.resume_link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Resume
                      </a>
                    ) : (
                      "—"
                    )
                  }
                />
              </div>
            </Card>

            {/* Social Links */}
            <Card title="Social Profiles" icon={<FileText />}>
              <div className="flex flex-col gap-2">
                <Info
                  label="GitHub"
                  value={
                    profile.github_link ? (
                      <a
                        href={profile.github_link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:underline"
                      >
                        {profile.github_link}
                      </a>
                    ) : (
                      "—"
                    )
                  }
                />
                <Info
                  label="LinkedIn"
                  value={
                    profile.linkedin_link ? (
                      <a
                        href={profile.linkedin_link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:underline"
                      >
                        {profile.linkedin_link}
                      </a>
                    ) : (
                      "—"
                    )
                  }
                />
              </div>
            </Card>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="flex flex-col items-center gap-6">
            <motion.div
              initial={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition p-6 flex flex-col items-center w-full relative"
            >
              <img
                src={avatar}
                alt="Profile Avatar"
                className="w-32 h-32 rounded-full border-4 border-blue-200 mb-3 shadow-md object-cover"
              />
              <h2 className="text-xl font-semibold">{profile.name}</h2>
              <p className="text-gray-500 capitalize">{profile.gender || "N/A"}</p>

              {/* Edit Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="absolute top-3 right-3 p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition"
              >
                <Edit size={18} className="text-blue-600" />
              </button>
            </motion.div>

            <div className="bg-white rounded-2xl shadow-lg p-4 w-full">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <MapPin size={18} /> Location
              </h2>
              <p className="mt-2 font-medium text-gray-700">IIIT Kurnool</p>
            </div>
          </div>
        </div>
      </div>

      {/* ✏️ Edit Modal with Cloudinary upload */}
      {isModalOpen && (
        <EditModal
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          setIsModalOpen={setIsModalOpen}
          avatar={avatar}
          uploading={uploading}
          setUploading={setUploading}
        />
      )}
    </div>
  );
}

/* Edit Modal Component */
function EditModal({
  formData,
  setFormData,
  handleChange,
  handleSubmit,
  setIsModalOpen,
  avatar,
  uploading,
  setUploading,
}) {
  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh]"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileSignature size={20} /> Edit Profile
        </h2>

        {/* Profile Pic Upload */}
        <div className="flex flex-col items-center mb-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative w-32 h-32"
          >
            <img
              src={avatar}
              alt="Avatar"
              className="w-32 h-32 rounded-full border-4 border-blue-200 shadow-md object-cover"
            />
            <Camera className="absolute bottom-1 right-1 w-7 h-7 text-blue-600 bg-white p-1 rounded-full cursor-pointer" />
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer rounded-full"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                setUploading(true);

                const formData = new FormData();
                formData.append("file", file);
                formData.append(
                  "upload_preset",
                  process.env.REACT_APP_CLOUDINARY_PRESET
                );

                try {
                  const res = await axios.post(
                    `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
                    formData
                  );
                  setFormData((prev) => ({
                    ...prev,
                    profile_pic_link: res.data.secure_url,
                  }));
                  toast.success("Image uploaded!");
                } catch (err) {
                  console.error(err);
                  toast.error("Upload failed!");
                } finally {
                  setUploading(false);
                }
              }}
            />
          </motion.div>
          {uploading && <p className="text-sm text-blue-500 mt-2">Uploading...</p>}
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {Object.keys(formData).map((field) => {
            if (["hashed_password"].includes(field)) return null; // Skip sensitive
            return (
              <div key={field} className="flex flex-col">
                <label className="text-sm text-gray-600 capitalize">
                  {field.replace(/_/g, " ")}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>
            );
          })}

          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* Reusable Card */
function Card({ title, icon, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition p-5 border border-gray-100">
      <div className="flex items-center gap-2 mb-3 text-blue-700">
        {icon}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

/* Info Field */
function Info({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value || "—"}</p>
    </div>
  );
}
