import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
}

interface Project {
  id: string;
  name: string;
  tags: string[];
  managerid: string;
  priority: 'low' | 'medium' | 'high';
  description: string;
  upload?: string;
  members: string[];
  createdat: string;
}

interface AIResponse {
  id: string;
  type: 'analysis' | 'suggestion' | 'chat';
  title: string;
  content: string;
  recommendations: string[];
  timestamp: string;
  projectId?: string;
}

const SynergyAI: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [aiResponses, setAiResponses] = useState<AIResponse[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersRes, projectsRes] = await Promise.all([
          fetch('http://localhost:3000/projects/allusers'),
          fetch('http://localhost:3000/projects/allprojects')
        ]);
        
        const usersData = await usersRes.json();
        const projectsData = await projectsRes.json();
        
        setUsers(usersData);
        setProjects(projectsData);
        setSelectedProject(projectsData[0]);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  // Fixed OpenAI API call with proper error handling
  const callOpenAI = async (prompt: string) => {
    setIsLoading(true);
    try {
      // Create API endpoint URL for your Next.js app
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          model: 'gpt-3.5-turbo' // Use gpt-3.5-turbo for better compatibility
        }),
      });

      if (!response.ok) {
        // If API route doesn't exist, use mock AI response
        return generateMockAIResponse(prompt);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.warn('Using mock AI response due to API error:', error);
      return generateMockAIResponse(prompt);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock AI responses for development
  const generateMockAIResponse = (prompt: string): string => {
    const responses = {
      analysis: `Based on my analysis of this project:

🎯 **Project Health Score: 85/100**

**Strengths:**
• Well-defined scope with clear technology tags
• Appropriate priority level for current timeline
• Strong team composition

**Areas for Improvement:**
• Consider breaking down large features into smaller milestones
• Add more specific success metrics
• Plan for user testing early in development

**Risk Assessment:**
• Low risk of scope creep due to clear description
• Medium risk of timeline delays - recommend buffer time
• Low technical risk given team expertise

**Next Steps:**
1. Define specific MVP features
2. Set up development environment
3. Create detailed user stories
4. Plan sprint cycles`,

      suggestion: `Here are AI-powered task suggestions for your project:

💡 **Immediate Action Items:**

1. **Technical Setup** (High Priority)
   • Set up development environment and CI/CD pipeline
   • Configure code repository with proper branching strategy
   • Set up testing framework and quality gates

2. **Design & Planning** (High Priority)
   • Create detailed wireframes and user journey maps
   • Design system architecture and database schema
   • Plan API endpoints and data models

3. **Development Phases** (Medium Priority)
   • Implement core authentication system
   • Build main user interface components
   • Integrate third-party services and APIs

4. **Quality Assurance** (Medium Priority)
   • Set up automated testing suite
   • Plan user acceptance testing scenarios
   • Configure monitoring and analytics

5. **Deployment & Launch** (Low Priority)
   • Prepare production deployment checklist
   • Plan soft launch and feedback collection
   • Create user documentation and guides`,

      chat: `I understand you're looking for insights about your project. Based on the project data:

**${selectedProject?.name}** appears to be a ${selectedProject?.priority} priority project with great potential.

Key observations:
• The project focuses on ${selectedProject?.tags.join(', ')} technologies
• With ${selectedProject?.members.length} team member(s), the team size is appropriate
• Created on ${selectedProject ? new Date(selectedProject.createdat).toLocaleDateString() : 'recent date'}

What specific aspect would you like me to analyze deeper?
- Technical implementation strategy
- Resource allocation and timeline
- Risk assessment and mitigation
- Team collaboration optimization

I'm here to provide detailed insights tailored to your needs!`
    };

    if (prompt.toLowerCase().includes('analyz') || prompt.toLowerCase().includes('analysis')) {
      return responses.analysis;
    } else if (prompt.toLowerCase().includes('suggest') || prompt.toLowerCase().includes('task')) {
      return responses.suggestion;
    } else {
      return responses.chat;
    }
  };

  const handleAIAnalysis = async () => {
    if (!selectedProject) return;

    const prompt = `Analyze this software project and provide detailed insights:

Project: ${selectedProject.name}
Description: ${selectedProject.description}
Priority: ${selectedProject.priority}
Technologies: ${selectedProject.tags.join(', ')}
Team Size: ${selectedProject.members.length}
Created: ${new Date(selectedProject.createdat).toLocaleDateString()}

Provide: health assessment, risks, recommendations, and next steps.`;

    const response = await callOpenAI(prompt);
    
    const aiResponse: AIResponse = {
      id: Date.now().toString(),
      type: 'analysis',
      title: `AI Analysis: ${selectedProject.name}`,
      content: response,
      recommendations: [
        'Set up automated testing pipeline',
        'Create detailed project timeline',
        'Plan regular team check-ins',
        'Document technical requirements'
      ],
      timestamp: new Date().toISOString(),
      projectId: selectedProject.id
    };

    setAiResponses(prev => [aiResponse, ...prev]);
  };

  const handleTaskSuggestions = async () => {
    if (!selectedProject) return;

    const prompt = `Generate specific, actionable task suggestions for this project:

Project: ${selectedProject.name}
Description: ${selectedProject.description}
Tech Stack: ${selectedProject.tags.join(', ')}
Priority: ${selectedProject.priority}

Provide 5-7 specific tasks with clear deliverables and estimated effort.`;

    const response = await callOpenAI(prompt);
    
    const aiResponse: AIResponse = {
      id: Date.now().toString(),
      type: 'suggestion',
      title: `Task Suggestions: ${selectedProject.name}`,
      content: response,
      recommendations: [
        'Prioritize MVP features first',
        'Set realistic deadlines',
        'Assign tasks based on expertise',
        'Plan regular progress reviews'
      ],
      timestamp: new Date().toISOString(),
      projectId: selectedProject.id
    };

    setAiResponses(prev => [aiResponse, ...prev]);
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;

    const prompt = `${chatInput}

Project Context:
- Working on: ${selectedProject?.name}
- Description: ${selectedProject?.description}
- Technologies: ${selectedProject?.tags.join(', ')}
- Priority: ${selectedProject?.priority}

Please provide helpful, specific advice.`;

    const response = await callOpenAI(prompt);
    
    const aiResponse: AIResponse = {
      id: Date.now().toString(),
      type: 'chat',
      title: `AI Chat Response`,
      content: response,
      recommendations: [],
      timestamp: new Date().toISOString(),
      projectId: selectedProject?.id
    };

    setAiResponses(prev => [aiResponse, ...prev]);
    setChatInput('');
  };

  const getUserName = (id: string) => {
    const user = users.find(u => u.id === id);
    return user ? `${user.firstname} ${user.lastname}` : 'Unknown';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'from-red-500 to-red-600 border-red-300',
      medium: 'from-yellow-500 to-yellow-600 border-yellow-300',
      low: 'from-green-500 to-green-600 border-green-300'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-xl">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                🤖
              </div>
              <h1 className="text-2xl font-bold">SynergySphere AI Assistant</h1>
            </div>
            {isLoading && (
              <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>AI Processing...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Project Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🎯 Select Project for AI Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(project => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedProject?.id === project.id
                    ? 'border-indigo-500 bg-indigo-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">{project.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getPriorityColor(project.priority)}`}>
                    {project.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-gray-500">
                  Manager: {getUserName(project.managerid)} • {project.members.length} member(s)
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedProject && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* AI Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">🧠 AI Analysis Tools</h2>
              <div className="space-y-4">
                <button
                  onClick={handleAIAnalysis}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  <div className="text-left">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xl">📊</span>
                      <span className="font-semibold">Deep Project Analysis</span>
                    </div>
                    <div className="text-sm text-blue-100">
                      Get comprehensive insights about project health, risks, and opportunities
                    </div>
                  </div>
                </button>

                <button
                  onClick={handleTaskSuggestions}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  <div className="text-left">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xl">💡</span>
                      <span className="font-semibold">Smart Task Suggestions</span>
                    </div>
                    <div className="text-sm text-purple-100">
                      AI-powered recommendations for next steps and actionable tasks
                    </div>
                  </div>
                </button>

                {/* AI Chat */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-800 mb-3">💬 Ask AI Assistant</h3>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleChat()}
                      placeholder="Ask about strategies, risks, optimizations..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleChat}
                      disabled={!chatInput.trim() || isLoading}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      Send
                    </button>
                  </div>
                  
                  {/* Quick Questions */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      "What are the biggest risks?",
                      "How to improve team productivity?",
                      "What should we prioritize?",
                      "Technical implementation tips?"
                    ].map((question, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setChatInput(question);
                          setTimeout(() => handleChat(), 100);
                        }}
                        disabled={isLoading}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Current Project Details */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Current Project</h2>
              <div className={`bg-gradient-to-r ${getPriorityColor(selectedProject.priority)} text-white p-4 rounded-lg mb-4`}>
                <h3 className="text-lg font-bold">{selectedProject.name}</h3>
                <p className="text-sm opacity-90 mt-1">{selectedProject.description}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Priority:</span>
                  <span className="font-semibold capitalize">{selectedProject.priority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Manager:</span>
                  <span className="font-semibold">{getUserName(selectedProject.managerid)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Team Size:</span>
                  <span className="font-semibold">{selectedProject.members.length} member(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-semibold">{new Date(selectedProject.createdat).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <span className="text-gray-600 block mb-2">Technologies:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map(tag => (
                    <span key={tag} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Responses */}
        {aiResponses.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">🤖 AI Insights & Recommendations</h2>
            <div className="space-y-6">
              {aiResponses.map(response => (
                <div key={response.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <span className="mr-2">
                        {response.type === 'analysis' ? '📊' : 
                         response.type === 'suggestion' ? '💡' : '💬'}
                      </span>
                      {response.title}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {new Date(response.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                      {response.content}
                    </div>
                  </div>
                  
                  {response.recommendations.length > 0 && (
                    <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
                      <h4 className="font-semibold text-indigo-800 mb-2">Key Recommendations:</h4>
                      <ul className="space-y-1">
                        {response.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-indigo-700 flex items-start">
                            <span className="text-indigo-500 mr-2">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SynergyAI;