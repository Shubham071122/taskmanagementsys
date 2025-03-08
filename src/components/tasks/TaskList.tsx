import React, { useEffect, useState } from 'react';
import { Task, TaskStatus } from '../../types/task.ts';
import TaskForm from './TaskForm.tsx';
import { useAuth } from '../../hooks/useAuth.ts';
import { useTask } from '../../hooks/useTask.ts';
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import Loader2 from '../../Loader2.tsx';
import { RiLoader4Fill } from "react-icons/ri";

const TaskList: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const { tasks, updateTask, deleteTask, getTaskById, getTasks } = useTask();
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [delId, setDelId] = useState<string | null>(null);


  useEffect(() => {
    getTasks();
  }, []);

  const handleDelete = async (id: string) => {
    setDelId(id);
    await deleteTask(id);
    setDelId(null);
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    setIsLoading(true);
    const task = await getTaskById(taskId);
    if (task) {
      await updateTask(task.id, task.title, task.description, newStatus, task.dueDate);
    }
    setIsLoading(false);
  };

  const handleEdit = (taskId: string) => {
    setEditingTaskId(taskId);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTaskId(null);
  };

  const handleLogout = async () => {
    await logout();
  };

  // First, get the task using editingTaskId
  const editingTask = tasks.find(task => task.id === editingTaskId);
  const newEditingTask = editingTask ? { ...editingTask, status: editingTask.status as TaskStatus } : null;


  return (
    <div className="container mx-auto px-4 py-8">
      {/* Full-Page Loader */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <RiLoader4Fill className='text-4xl text-gray-800 animate-spin' />
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Add Task
          </button>
          <button
            onClick={handleLogout}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {Object.values(TaskStatus).map(status => (

          <div key={status} className={`bg-gray-50 p-4 rounded-lg ${status === TaskStatus.TODO ? 'bg-red-100' : status === TaskStatus.IN_PROGRESS ? 'bg-yellow-100' : 'bg-green-100'}`}>
            <h2 className="font-semibold mb-4">{status}</h2>
            <div className="space-y-4">
              {tasks
                .filter(task => task.status === status)
                .map(task => (
                  <div key={task.id} className="bg-white p-4 rounded shadow">
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {task.description}
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                    <div className="mt-4 flex justify-between">
                      <select
                        value={task.status}
                        onChange={e =>
                          handleStatusChange(task.id, e.target.value as TaskStatus)
                        }
                        className="text-sm border rounded p-1"
                      >
                        {Object.values(TaskStatus).map(s => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <div className="space-x-2 md:space-x-3 flex item-center">
                        <button
                          onClick={() => handleEdit(task.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaRegEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          {delId === task.id ? <Loader2 /> : <MdOutlineDelete size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <TaskForm task={newEditingTask || null || undefined} onClose={handleFormClose} />
      )}
    </div>
  );
};

export default TaskList;
