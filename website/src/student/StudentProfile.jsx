import React, { useEffect, useState } from "react";
import {
  MapPin,
  Edit,
  BookOpen,
  GraduationCap,
  FileText,
  Github,
  Linkedin,
  IdCard,
  UserCircle2,
  Calendar,
  FileSignature,
  Mail,
  Phone,
  Award,
  Briefcase,
  Link as LinkIcon,
  Home,
} from "lucide-react";
import LogoNav from "../components/LogoNav";
import Sidebar from "../components/SideNav";
import { API_URL } from "../../env-config";
import { useNotification, NotificationContainer } from "../components/notification";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState("personal");
  
  // Custom notification hook
  const { notifications, removeNotification, showSuccess, showError } = useNotification();

 useEffect(() => {
  const fetchProfileData = async () => {
    try {
      setLoading(true);

      // Check if data exists in localStorage
      const storedProfile = localStorage.getItem("user");

      if (storedProfile) {
        // Parse and set local profile
        const parsedProfile = JSON.parse(storedProfile);
        setProfile(parsedProfile);
        setFormData(parsedProfile);
      } else {
        // If not found, fetch from database
        const token = localStorage.getItem("token");
        if (token) {
          const response = await fetch(`${API_URL}/profile/student/me`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const freshProfile = await response.json();
            setProfile(freshProfile);
            setFormData(freshProfile);
            localStorage.setItem("user", JSON.stringify(freshProfile));
          } else {
            console.error("Failed to fetch profile from database");
          }
        } else {
          console.warn("No token found — cannot fetch profile");
        }
      }
    } catch (error) {
      console.error("Error fetching or parsing profile:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchProfileData();
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Remove empty, null, and undefined values
      const cleanedData = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
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
      setFormData(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      showSuccess("Profile Updated Successfully", "Profile Updated!");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Update error:", err);
      showError("Profile update failed.", "Update Failed");
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

  const avatar = profile.profile_pic_link || 
    (profile.gender === "female"
      ? "https://cdn-icons-png.flaticon.com/512/6997/6997662.png"
      : "https://cdn-icons-png.flaticon.com/512/6997/6997661.png");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex">
      {/* Sidebar - Sticky */}
      <div className="hidden lg:block sticky top-0 h-screen overflow-y-auto">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Custom Notification Container */}
        <NotificationContainer notifications={notifications} removeNotification={removeNotification} />
        <div className="sticky top-0 z-10 bg-white shadow-sm">
        <LogoNav />
        </div>

        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {/* Hero Profile Header */}
          <div className="mb-6 bg-gradient-to-r from-[#003d82] via-[#0056b3] to-[#003d82] rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <img
                  src={avatar}
                  alt="Profile Avatar"
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-2xl"
                />
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="absolute bottom-2 right-2 p-2.5 rounded-full bg-amber-400 hover:bg-amber-500 transition-all shadow-lg hover:shadow-xl"
                  aria-label="Edit Profile"
                >
                  <Edit size={18} className="text-white" />
                </button>
              </div>
              <div className="flex-1 text-center md:text-left text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{profile.name}</h1>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-4">
                  <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm">
                    <GraduationCap size={16} />
                    {profile.roll_number || "N/A"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm">
                    <BookOpen size={16} />
                    {profile.branch || "N/A"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm capitalize">
                    <UserCircle2 size={16} />
                    {profile.gender || "N/A"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
                  <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 hover:text-amber-300 transition-colors">
                    <Mail size={16} />
                    {profile.email}
                  </a>
                  <span className="inline-flex items-center gap-2">
                    <Phone size={16} />
                    {profile.phone_no || "N/A"}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin size={16} />
                    IIIT Kurnool
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* LEFT COLUMN */}
            <div className="lg:col-span-2 flex flex-col gap-4">

            {/* 🎓 Academic Performance */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-4 text-[#003d82]">
                <Award size={20} />
                <h2 className="text-base font-semibold">Academic Performance</h2>
              </div>
              
              {/* CGPA Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <StatCard 
                  label="BTech CGPA" 
                  value={profile.btech_cgpa || "—"} 
                  color="blue"
                />
                <StatCard 
                  label="MTech CGPA" 
                  value={profile.mtech_cgpa || "—"} 
                  color="purple"
                />
                <StatCard 
                  label="SSC CGPA" 
                  value={profile.ssc_cgpa || "—"} 
                  color="green"
                />
                <StatCard 
                  label="HSC CGPA" 
                  value={profile.hsc_cgpa || "—"} 
                  color="amber"
                />
              </div>

              {/* Other Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 pt-3 border-t border-gray-100">
                <Info label="Course" value={profile.course} />
                <Info label="Batch" value={profile.batch} />
                <Info label="Backlogs" value={profile.backlogs} />
              </div>
            </div>

            {/* Two Column Grid for Documents & Career */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 💼 Career & Resume */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-md hover:shadow-lg transition-all p-4 border border-amber-100">
                <div className="flex items-center gap-2 mb-3 text-amber-700">
                  <Briefcase size={18} />
                  <h2 className="text-base font-semibold">Career & Resume</h2>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-amber-600 mb-1">Career Path</p>
                    <p className="font-medium text-gray-800 text-sm">{profile.career_path || "—"}</p>
                  </div>
                  {profile.resume_link && (
                    <a
                      href={profile.resume_link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md hover:shadow-lg"
                    >
                      <FileText size={16} />
                      View Resume
                    </a>
                  )}
                </div>
              </div>

              {/* 🧾 Documents */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md hover:shadow-lg transition-all p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-3 text-blue-700">
                  <IdCard size={18} />
                  <h2 className="text-base font-semibold">Identity Documents</h2>
                </div>
                <div className="space-y-2">
                  {profile.aadhar_card_link ? (
                      <a
                        href={profile.aadhar_card_link}
                        target="_blank"
                        rel="noreferrer"
                      className="flex items-center justify-between p-2 bg-white rounded-lg hover:bg-blue-50 transition-colors group"
                      >
                      <span className="text-sm font-medium text-gray-700">Aadhar Card</span>
                      <LinkIcon size={14} className="text-blue-600 group-hover:text-blue-700" />
                      </a>
                    ) : (
                    <div className="p-2 bg-white rounded-lg text-sm text-gray-400">Aadhar: Not uploaded</div>
                  )}
                  {profile.pan_card_link ? (
                      <a
                        href={profile.pan_card_link}
                        target="_blank"
                        rel="noreferrer"
                      className="flex items-center justify-between p-2 bg-white rounded-lg hover:bg-blue-50 transition-colors group"
                      >
                      <span className="text-sm font-medium text-gray-700">PAN Card</span>
                      <LinkIcon size={14} className="text-blue-600 group-hover:text-blue-700" />
                      </a>
                    ) : (
                    <div className="p-2 bg-white rounded-lg text-sm text-gray-400">PAN: Not uploaded</div>
                  )}
                </div>
              </div>
            </div>

            {/* 🌐 Social Profiles - Modern Cards */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-md hover:shadow-lg transition-all p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-3 text-purple-700">
                <LinkIcon size={18} />
                <h2 className="text-base font-semibold">Social Profiles</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profile.github_link ? (
                      <a
                        href={profile.github_link}
                        target="_blank"
                        rel="noreferrer"
                    className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-900 hover:text-white transition-all group shadow-sm"
                  >
                    <Github size={20} className="flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 group-hover:text-gray-300">GitHub</p>
                      <p className="text-sm font-medium truncate">{profile.github_link.replace('https://github.com/', '@')}</p>
                    </div>
                      </a>
                    ) : (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg opacity-50">
                    <Github size={20} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">GitHub</p>
                      <p className="text-sm text-gray-400">Not connected</p>
                    </div>
                  </div>
                )}
                
                {profile.linkedin_link ? (
                      <a
                        href={profile.linkedin_link}
                        target="_blank"
                        rel="noreferrer"
                    className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-[#0077b5] hover:text-white transition-all group shadow-sm"
                  >
                    <Linkedin size={20} className="flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 group-hover:text-gray-200">LinkedIn</p>
                      <p className="text-sm font-medium truncate">{profile.linkedin_link.replace('https://linkedin.com/in/', '')}</p>
                    </div>
                      </a>
                    ) : (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg opacity-50">
                    <Linkedin size={20} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">LinkedIn</p>
                      <p className="text-sm text-gray-400">Not connected</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR - Sticky */}
          <div className="lg:sticky lg:top-24 self-start flex flex-col gap-4">
            {/* Address Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-md hover:shadow-lg transition-all p-4 border border-green-100 w-full">
              <div className="flex items-center gap-2 mb-3 text-green-700">
                <Home size={18} />
                <h2 className="text-base font-semibold">Address</h2>
              </div>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-green-600 mb-1">Current Address</p>
                  <p className="text-sm text-gray-800">{profile.current_address || "Not provided"}</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-green-600 mb-1">Permanent Address</p>
                  <p className="text-sm text-gray-800">{profile.permanent_address || "Not provided"}</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100 w-full">
              <h2 className="text-base font-semibold mb-3 text-gray-800">Quick Info</h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-600">Date of Birth</span>
                  <span className="text-sm font-medium text-gray-800">{profile.date_of_birth || "—"}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-600">Username</span>
                  <span className="text-sm font-medium text-gray-800">{profile.username || "—"}</span>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✏️ Edit Modal - Modern Tabbed Design */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#003d82] to-[#0056b3] p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <FileSignature size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                  <p className="text-blue-100 text-sm">Update your information</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setActiveTab("personal");
                }}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs Navigation */}
            <div className="bg-gray-50 border-b border-gray-200 px-6">
              <div className="flex gap-2 overflow-x-auto">
                {[
                  { id: "personal", label: "Personal Info", icon: UserCircle2 },
                  { id: "academic", label: "Academic", icon: GraduationCap },
                  { id: "address", label: "Address", icon: Home },
                  { id: "documents", label: "Documents", icon: IdCard },
                  { id: "links", label: "Links & Career", icon: LinkIcon },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? "border-[#003d82] text-[#003d82]"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <Icon size={18} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
              {/* Personal Info Tab */}
              {activeTab === "personal" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    icon={<UserCircle2 size={18} />}
                    required
                  />
                  <InputField
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    icon={<UserCircle2 size={18} />}
                    type="select"
                    options={["male", "female", "other"]}
                  />
                  <InputField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    icon={<Mail size={18} />}
                    type="email"
                  />
                  <InputField
                    label="Date of Birth"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    icon={<Calendar size={18} />}
                    type="date"
                  />
                  <InputField
                    label="Phone Number"
                    name="phone_no"
                    value={formData.phone_no}
                    onChange={handleChange}
                    icon={<Phone size={18} />}
                    type="tel"
                  />
                  <InputField
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    icon={<UserCircle2 size={18} />}
                    disabled
                  />
                  <InputField
                    label="Profile Picture Link"
                    name="profile_pic_link"
                    value={formData.profile_pic_link}
                    onChange={handleChange}
                    icon={<FileText size={18} />}
                    type="url"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              )}

              {/* Academic Tab */}
              {activeTab === "academic" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Roll Number"
                    name="roll_number"
                    value={formData.roll_number}
                    onChange={handleChange}
                    icon={<GraduationCap size={18} />}
                  />
                  <InputField
                    label="Branch"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    icon={<BookOpen size={18} />}
                  />
                  <InputField
                    label="Course"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    icon={<BookOpen size={18} />}
                  />
                  <InputField
                    label="Batch"
                    name="batch"
                    value={formData.batch}
                    onChange={handleChange}
                    icon={<Calendar size={18} />}
                  />
                  
                  <div className="md:col-span-2 mt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Award size={20} className="text-[#003d82]" />
                      Academic Performance
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <InputField
                        label="BTech CGPA"
                        name="btech_cgpa"
                        value={formData.btech_cgpa}
                        onChange={handleChange}
                        type="number"
                        step="0.01"
                      />
                      <InputField
                        label="MTech CGPA"
                        name="mtech_cgpa"
                        value={formData.mtech_cgpa}
                        onChange={handleChange}
                        type="number"
                        step="0.01"
                      />
                      <InputField
                        label="SSC CGPA"
                        name="ssc_cgpa"
                        value={formData.ssc_cgpa}
                        onChange={handleChange}
                        type="number"
                        step="0.01"
                      />
                      <InputField
                        label="HSC CGPA"
                        name="hsc_cgpa"
                        value={formData.hsc_cgpa}
                        onChange={handleChange}
                        type="number"
                        step="0.01"
                      />
                    </div>
                  </div>
                  
                  <InputField
                    label="Backlogs"
                    name="backlogs"
                    value={formData.backlogs}
                    onChange={handleChange}
                    type="number"
                  />
                </div>
              )}

              {/* Address Tab */}
              {activeTab === "address" && (
                <div className="grid grid-cols-1 gap-6">
                  <InputField
                    label="Current Address"
                    name="current_address"
                    value={formData.current_address}
                    onChange={handleChange}
                    icon={<Home size={18} />}
                    type="textarea"
                  />
                  <InputField
                    label="Permanent Address"
                    name="permanent_address"
                    value={formData.permanent_address}
                    onChange={handleChange}
                    icon={<Home size={18} />}
                    type="textarea"
                  />
                </div>
              )}

              {/* Documents Tab */}
              {activeTab === "documents" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Aadhar Card Link"
                    name="aadhar_card_link"
                    value={formData.aadhar_card_link}
                    onChange={handleChange}
                    icon={<IdCard size={18} />}
                    type="url"
                    placeholder="https://drive.google.com/..."
                  />
                  <InputField
                    label="PAN Card Link"
                    name="pan_card_link"
                    value={formData.pan_card_link}
                    onChange={handleChange}
                    icon={<IdCard size={18} />}
                    type="url"
                    placeholder="https://drive.google.com/..."
                  />
                </div>
              )}

              {/* Links & Career Tab */}
              {activeTab === "links" && (
                <div className="grid grid-cols-1 gap-6">
                  <InputField
                    label="LinkedIn Profile"
                    name="linkedin_link"
                    value={formData.linkedin_link}
                    onChange={handleChange}
                    icon={<Linkedin size={18} />}
                    type="url"
                    placeholder="https://linkedin.com/in/..."
                  />
                  <InputField
                    label="GitHub Profile"
                    name="github_link"
                    value={formData.github_link}
                    onChange={handleChange}
                    icon={<Github size={18} />}
                    type="url"
                    placeholder="https://github.com/..."
                  />
                  <InputField
                    label="Resume Link"
                    name="resume_link"
                    value={formData.resume_link}
                    onChange={handleChange}
                    icon={<FileText size={18} />}
                    type="url"
                    placeholder="https://drive.google.com/..."
                  />
                  <InputField
                    label="Career Path"
                    name="career_path"
                    value={formData.career_path}
                    onChange={handleChange}
                    icon={<Briefcase size={18} />}
                    type="textarea"
                    placeholder="Describe your career interests..."
                  />
                </div>
              )}
            </form>

            {/* Footer with Actions */}
            <div className="bg-gray-50 border-t border-gray-200 p-6 flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Tab {["personal", "academic", "address", "documents", "links"].indexOf(activeTab) + 1} of 5
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setActiveTab("personal");
                  }}
                  className="px-6 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#003d82] to-[#0056b3] text-white font-medium hover:shadow-lg transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* 📦 Reusable Card */
function Card({ title, icon, children }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 border border-gray-100">
      <div className="flex items-center gap-2 mb-3 text-blue-700">
        {icon}
        <h2 className="text-base font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

/* 🧾 Info Field */
function Info({ label, value }) {
  return (
    <div className="mb-1">
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="font-medium text-gray-800 text-sm">{value || "—"}</p>
    </div>
  );
}

/* 📊 Stat Card Component */
function StatCard({ label, value, color }) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    green: "from-green-500 to-green-600",
    amber: "from-amber-500 to-amber-600",
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-lg p-3 text-white shadow-md hover:shadow-lg transition-all`}>
      <p className="text-xs opacity-90 mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

/* 📝 Input Field Component */
function InputField({ label, name, value, onChange, icon, type = "text", required = false, disabled = false, options = [], placeholder = "", step }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        {icon && <span className="text-[#003d82]">{icon}</span>}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      
      {type === "textarea" ? (
        <textarea
          name={name}
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          rows={4}
          className={`border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#003d82] focus:ring-2 focus:ring-[#003d82]/20 transition-all ${
            disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"
          }`}
        />
      ) : type === "select" ? (
        <select
          name={name}
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          className={`border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#003d82] focus:ring-2 focus:ring-[#003d82]/20 transition-all ${
            disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"
          }`}
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          step={step}
          className={`border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#003d82] focus:ring-2 focus:ring-[#003d82]/20 transition-all ${
            disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"
          }`}
        />
      )}
    </div>
  );
}