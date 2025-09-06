// src/pages/Tasks.tsx
import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Search, User, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateTaskModal } from "@/components/modals/CreateTaskModal";
import { Task, TaskStatus } from "@/types/task";

// Mock project members and tasks (replace with API later)
const mockMembers = [
  { id: "1", name: "Alice Johnson" },
  { id: "2", name: "Bob Smith" },
  { id: "3", name: "Carol Davis" },
];

const mockTasks: Task[] = [
  { id: "1", projectId: "1", title: "Design System", description: "Setup basic components", assigneeId: "1", dueDate: "2024-12-20", priority: "high", status: "todo", tags: ["Design"], createdAt: "2024-12-01" },
  { id: "2", projectId: "1", title: "API Integration", description: "Connect backend", assigneeId: "2", dueDate: "2024-12-25", priority: "medium", status: "in_progress", tags: ["Backend"], createdAt: "2024-12-02" },
];

export default function Tasks() {
  const { projectId } = useParams(); // From URL: /projects/:projectId/tasks
  const [tasks, setTasks] = useState<Task[]>(mockTasks.filter(t => t.projectId === projectId));
  const [search, setSearch] = useState("");
  const [filterAssignee, setFilterAssignee] = useState("all");
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "all">("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Filtered tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchesAssignee = filterAssignee === "all" || task.assigneeId === filterAssignee;
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    return matchesSearch && matchesAssignee && matchesStatus;
  });

  // Handle new task creation
const handleCreateTask = (taskData: any) => {
  const newTask: Task = {
    id: Date.now().toString(),
    projectId: projectId || "1",
    title: taskData.name,
    description: taskData.description || "",
    assigneeId: taskData.assignee || "",
    dueDate: taskData.deadline ? taskData.deadline.toISOString() : undefined,
    priority: "medium", // you can extend schema if you want priority
    status: "todo",
    tags: taskData.tags || [],
    createdAt: new Date().toISOString(),
  };

  setTasks(prev => [...prev, newTask]);
};



  return (
    
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
        <Button variant="hero" size="lg" onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-5 w-5 mr-2" />
          New Task
        </Button>
      </motion.div>

      <CreateTaskModal
  open={isCreateOpen}
  onOpenChange={setIsCreateOpen}
  onSubmit={handleCreateTask}
  projectId={projectId}
  projectName="Project Alpha" // pass actual project name if you have it
/>


      {/* Filters */}
      <motion.div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search tasks..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <Select value={filterAssignee} onValueChange={setFilterAssignee}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {mockMembers.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
            </SelectContent>
          </Select>

          {/* <Select value={filterStatus} onValueChange={setFilterStatus}> */}
          <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as TaskStatus | "all")}>

            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? filteredTasks.map(task => (
          <motion.div key={task.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 border border-border rounded-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-foreground">{task.title}</h3>
              <p className="text-sm text-muted-foreground">{task.description}</p>
              <div className="flex gap-2 mt-1">
                <Badge>{mockMembers.find(m => m.id === task.assigneeId)?.name}</Badge>
                <Badge>{task.status}</Badge>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm text-muted-foreground">{new Date(task.dueDate || "").toLocaleDateString()}</span>
              <Button size="sm" variant="ghost">Edit</Button>
            </div>
          </motion.div>
        )) : (
          <div className="text-center py-12 text-muted-foreground">No tasks found. Create your first task!</div>
        )}
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal open={isCreateOpen} onOpenChange={setIsCreateOpen} onSubmit={handleCreateTask} projectId={projectId} />
    </div>
  );
}
