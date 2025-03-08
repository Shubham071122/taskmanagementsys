import React, { useState, useEffect } from 'react';
import { Task, TaskStatus } from '../../types/task.ts';
import { useTask } from '../../hooks/useTask.ts';
import Loader from '../../Loader.tsx';

interface TaskFormProps {
  task?: Task | null | undefined;
  onClose: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: TaskStatus.TODO as TaskStatus,
  });
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string>('');
  const { createTask, updateTask } = useTask();


  // Update form state when editing an existing task
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        status: task.status,
      });
    }
  }, [task]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: name === "status" ? (value as TaskStatus) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (task) {
        setIsLoading(true); 
        await updateTask(task.id, formData.title, formData.description, formData.status, formData.dueDate);
        onClose();
        setIsLoading(false);
      } else {
        setIsLoading(true);
        await createTask(formData.title, formData.description, formData.status, formData.dueDate);
        onClose();
        setIsLoading(false);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">
          {task ? 'Edit Task' : 'Create New Task'}
        </h2>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                required
                className="mt-1 block w-full rounded-md border-[1px] border-gray-300 shadow-sm p-2 bg-gray-50"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                className="mt-1 block w-full rounded-md border-[1px] border-gray-300 shadow-sm p-2 bg-gray-50"
                value={ formData.description}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                required
                className="mt-1 block w-full rounded-md border-[1px] border-gray-300 shadow-sm p-2 bg-gray-50"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                className="mt-1 block w-full border-[1px] border-gray-300 shadow-sm p-2 bg-gray-50"
                value={formData.status}
                onChange={handleChange}
              >
                {Object.values(TaskStatus).map((status) => (
                  <option key={status} value={status as string}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {
                isLoading ? <Loader /> : task ? 'Update' : 'Create'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;