import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 mt-12 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6 text-sm text-gray-600">
        
        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Support</a></li>
            <li><a href="#">Docs</a></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold mb-3">Company</h3>
          <ul className="space-y-2">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="font-semibold mb-3">Connect with us</h3>
          <ul className="space-y-3">
            <li>
              <a 
                href="https://x.com/home?lang=en-in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:text-blue-600"
              >
                <Twitter size={16} />
                <span>Twitter</span>
              </a>
            </li>
            <li>
              <a 
                href="https://www.linkedin.com/in/tejasri-pulla-aab31416b/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:text-blue-600"
              >
                <Linkedin size={16} />
                <span>LinkedIn</span>
              </a>
            </li>
            <li>
              <a 
                href="https://github.com/Tejasri1610/CollaboroX" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:text-blue-600"
              >
                <Github size={16} />
                <span>GitHub</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
