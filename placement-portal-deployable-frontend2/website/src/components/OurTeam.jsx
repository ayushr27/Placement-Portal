import React from 'react';
import { 
  Linkedin, 
  Github, 
  Mail, 
  Code, 
  Palette, 
  Database,
  Smartphone,
  Server,
  Users,
  Award,
  ChevronDown,
  Globe
} from 'lucide-react';

const OurTeam = () => {
  const developmentTeam = [
    {
      id: 1,
      name: "Arnav Sharda",
      role: "Full Stack Developer",
      specialization: "React.js & Node.js",
      image: "/team/aryan.jpg",
      email: "aryan.sharma@iiitdmk.ac.in",
      github: "https://github.com/aryansharma",
      linkedin: "https://linkedin.com/in/aryansharma",
      bio: "Lead developer with expertise in modern web technologies and system architecture. Passionate about creating scalable and user-friendly applications.",
      skills: ["React", "Node.js", "MongoDB", "Express", "TypeScript"],
      contributions: ["System Architecture", "Frontend Development", "API Design"],
      projects: 15
    },
    {
      id: 2,
      name: "Priya Patel",
      role: "Frontend Developer",
      specialization: "React & UI/UX Design",
      image: "/team/priya.jpg",
      email: "priya.patel@iiitdmk.ac.in",
      github: "https://github.com/priyapatel",
      linkedin: "https://linkedin.com/in/priyapatel",
      bio: "Creative frontend developer specializing in responsive design and user experience. Loves turning complex problems into intuitive interfaces.",
      skills: ["React", "Tailwind CSS", "Framer Motion", "Figma", "JavaScript"],
      contributions: ["UI/UX Design", "Component Library", "Responsive Design"],
      projects: 12
    },
    {
      id: 3,
      name: "Rahul Verma",
      role: "Backend Developer",
      specialization: "Database & API Development",
      image: "/team/rahul.jpg",
      email: "rahul.verma@iiitdmk.ac.in",
      github: "https://github.com/rahulverma",
      linkedin: "https://linkedin.com/in/rahulverma",
      bio: "Backend specialist focused on building robust APIs and efficient database architectures. Ensures system reliability and performance.",
      skills: ["Node.js", "MongoDB", "PostgreSQL", "Redis", "Docker"],
      contributions: ["Database Design", "API Development", "System Security"],
      projects: 10
    },
    {
      id: 4,
      name: "Neha Gupta",
      role: "UI/UX Designer & Developer",
      specialization: "Design Systems",
      image: "/team/neha.jpg",
      email: "neha.gupta@iiitdmk.ac.in",
      github: "https://github.com/nehagupta",
      linkedin: "https://linkedin.com/in/nehagupta",
      bio: "Bridge between design and development. Creates beautiful, accessible interfaces while ensuring technical feasibility.",
      skills: ["Figma", "Adobe XD", "React", "CSS", "User Research"],
      contributions: ["Design System", "User Research", "Prototyping"],
      projects: 8
    },
    {
      id: 5,
      name: "Karan Singh",
      role: "DevOps & Mobile Developer",
      specialization: "Deployment & Cross-platform",
      image: "/team/karan.jpg",
      email: "karan.singh@iiitdmk.ac.in",
      github: "https://github.com/karansingh",
      linkedin: "https://linkedin.com/in/karansingh",
      bio: "Handles deployment, CI/CD pipelines and mobile responsiveness. Ensures smooth operation across all platforms.",
      skills: ["Docker", "AWS", "React Native", "Git", "Nginx"],
      contributions: ["Deployment", "Mobile Optimization", "Performance"],
      projects: 11
    },
    {
      id: 6,
      name: "Sneha Reddy",
      role: "Quality Assurance & Testing",
      specialization: "Testing & Documentation",
      image: "/team/sneha.jpg",
      email: "sneha.reddy@iiitdmk.ac.in",
      github: "https://github.com/snehareddy",
      linkedin: "https://linkedin.com/in/snehareddy",
      bio: "Ensures code quality and system reliability through comprehensive testing. Creates detailed documentation for maintainability.",
      skills: ["Jest", "Cypress", "Postman", "Documentation", "Debugging"],
      contributions: ["Testing Suite", "Documentation", "Code Review"],
      projects: 9
    }
  ];

  const techStack = [
    { name: "React", icon: Code, color: "text-blue-500" },
    { name: "Node.js", icon: Server, color: "text-green-500" },
    { name: "MongoDB", icon: Database, color: "text-green-600" },
    { name: "Tailwind CSS", icon: Palette, color: "text-cyan-500" },
    { name: "Express.js", icon: Code, color: "text-gray-600" },
    { name: "Docker", icon: Server, color: "text-blue-400" }
  ];

  const projectStats = [
    { number: "6", label: "Developers" },
    { number: "65+", label: "Total Features" },
    { number: "12k+", label: "Lines of Code" },
    { number: "99.9%", label: "Uptime" }
  ];

  const DeveloperCard = ({ developer }) => (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 p-6">
        {/* Image & Basic Info */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-1">
              <div className="w-full h-full rounded-full bg-white p-1">
                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                  <Code className="w-8 h-8 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800">{developer.name}</h3>
            <p className="text-blue-600 font-semibold text-sm">{developer.role}</p>
            <p className="text-gray-600 text-sm">{developer.specialization}</p>
          </div>
        </div>

        {/* Bio */}
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {developer.bio}
        </p>

        {/* Skills */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <Code className="w-4 h-4 mr-2" />
            Technical Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {developer.skills.map((skill, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Contributions */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <Award className="w-4 h-4 mr-2" />
            Key Contributions
          </h4>
          <div className="space-y-2">
            {developer.contributions.map((contribution, index) => (
              <div key={index} className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                {contribution}
              </div>
            ))}
          </div>
        </div>

        {/* Stats & Links */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            <span className="font-semibold text-gray-700">{developer.projects}</span> projects
          </div>
          <div className="flex space-x-3">
            <a 
              href={`mailto:${developer.email}`}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a 
              href={developer.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <a 
              href={developer.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      

      {/* Tech Stack Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Tech Stack</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Modern technologies powering the placement portal for optimal performance and user experience
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {techStack.map((tech, index) => {
              const IconComponent = tech.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                    <IconComponent className={`w-8 h-8 ${tech.color}`} />
                  </div>
                  <div className="font-semibold text-gray-700">{tech.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Grid Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Meet the Developers
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              A diverse team of passionate developers working together to create 
              the best placement experience for students and recruiters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {developmentTeam.map(developer => (
              <DeveloperCard key={developer.id} developer={developer} />
            ))}
          </div>
        </div>
      </section>

      {/* Project Highlights */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Project Highlights</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Key features and accomplishments of the placement portal development
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <Globe className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Real-time Dashboard</h3>
              <p className="text-gray-600">Live updates for job applications, interviews, and placement statistics</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <Smartphone className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Mobile Responsive</h3>
              <p className="text-gray-600">Seamless experience across all devices and screen sizes</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <Database className="w-12 h-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Secure & Scalable</h3>
              <p className="text-gray-600">Robust backend with proper authentication and data protection</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Interested in Our Work?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            We're always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold">
              View Source Code
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white/10 transition-colors font-semibold">
              Contact Developers
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurTeam;