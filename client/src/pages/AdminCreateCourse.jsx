import { useEffect, useState } from 'react';
import courseService from '../services/courseService';
import { CheckCircle, AlertCircle, PlusSquare } from 'lucide-react';

export default function AdminCreateCourse() {
  const [form, setForm] = useState({ courseName: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      const list = await courseService.getAllCourses();
      if (!mounted) return;
      setCourses(list || []);
      setLoading(false);
    };
    fetch();
    return () => { mounted = false; };
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    if (!form.courseName) return setMessage({ type: 'error', text: 'Course name required' });
    setSubmitting(true);
    try {
      const res = await courseService.createCourse(form);
      if (res.success) {
        setMessage({ type: 'success', text: 'Course created' });
        setForm({ courseName: '', description: '' });
        const list = await courseService.getAllCourses();
        setCourses(list || []);
      } else {
        setMessage({ type: 'error', text: res.message || 'Failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Server error' });
    } finally { setSubmitting(false); }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><PlusSquare /> Course Management</h2>

      <div className="mb-6 p-4 bg-white rounded shadow">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Course Name</label>
            <input name="courseName" value={form.courseName} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <input name="description" value={form.description} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" />
          </div>
          {message.text && (
            <div className={`p-3 rounded ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>{message.text}</div>
          )}
          <div>
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded">
              {submitting ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-3">Existing Courses</h3>
        {loading ? (
          <div>Loading...</div>
        ) : courses.length ? (
          <ul className="space-y-2">
            {courses.map(c => (
              <li key={c._id} className="border rounded p-2 flex justify-between items-center">
                <div>
                  <div className="font-medium">{c.courseName}</div>
                  <div className="text-sm text-gray-600">{c.courseCode}</div>
                </div>
                <div className="text-sm text-gray-500">{c.description}</div>
              </li>
            ))}
          </ul>
        ) : (
          <div>No courses created yet.</div>
        )}
      </div>
    </div>
  );
}
