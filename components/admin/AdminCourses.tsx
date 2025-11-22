"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Lecture {
  _id: string;
  title: string;
  videoUrl: string;
  duration?: string;
  notesUrl?: string;
}

interface Course {
  _id: string;
  title: string;
  category: string;
  price: string;
  duration: string;
  bannerUrl: string;
  description: string;
  syllabus: string[];
  lectures: Lecture[];
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [description, setDescription] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Lecture form state
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [lectureTitle, setLectureTitle] = useState("");
  const [lectureVideoUrl, setLectureVideoUrl] = useState("");
  const [lectureDuration, setLectureDuration] = useState("");
  const [lectureNotesUrl, setLectureNotesUrl] = useState("");
  const [lectureIsPreview, setLectureIsPreview] = useState(false);
  const [lectureBusy, setLectureBusy] = useState(false);
  const [editingLectureId, setEditingLectureId] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const res = await fetch('/api/admin/courses');
      const data = await res.json();
      if (data.courses) setCourses(data.courses);
    } catch (e) {
      console.error("Failed to fetch courses", e);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!title.trim()) return setMsg('Please enter a course title');
    setBusy(true);
    try {
      const body = { title, category, price, duration, bannerUrl, description, syllabus };
      const res = await fetch('/api/admin/courses', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || 'Failed to create course');
      setMsg('Course uploaded successfully');
      
      // reset form fields
      setTitle(''); setCategory(''); setPrice(''); setDuration(''); setBannerUrl(''); setDescription(''); setSyllabus('');
      fetchCourses();
    } catch (err: unknown) {
      setMsg(err instanceof Error ? err.message : String(err));
    } finally { setBusy(false); }
  }

  function openAddLecture(course: Course) {
    setSelectedCourseId(course._id);
    setEditingLectureId(null);
    setLectureTitle("");
    setLectureVideoUrl("");
    setLectureDuration("");
    setLectureNotesUrl("");
    setLectureIsPreview(false);
  }

  function openEditLecture(course: Course, lecture: Lecture) {
    setSelectedCourseId(course._id);
    setEditingLectureId(lecture._id);
    setLectureTitle(lecture.title || "");
    setLectureVideoUrl(lecture.videoUrl || "");
    setLectureDuration(lecture.duration || "");
    setLectureNotesUrl(lecture.notesUrl || "");
    setLectureIsPreview((lecture as any).isPreview ?? false);
  }

  async function onSubmitLecture(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCourseId || !lectureTitle || !lectureVideoUrl) return;
    setLectureBusy(true);
    try {
      const method = editingLectureId ? 'PUT' : 'POST';
      const res = await fetch(`/api/admin/courses/${selectedCourseId}/lectures`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lectureId: editingLectureId || undefined,
          title: lectureTitle,
          videoUrl: lectureVideoUrl,
          duration: lectureDuration,
          notesUrl: lectureNotesUrl,
          isPreview: lectureIsPreview
        })
      });
      if (!res.ok) throw new Error(editingLectureId ? 'Failed to update lecture' : 'Failed to add lecture');
      
      setLectureTitle("");
      setLectureVideoUrl("");
      setLectureDuration("");
      setLectureNotesUrl("");
      setLectureIsPreview(false);
      setEditingLectureId(null);
      setSelectedCourseId(null); // Close dialog
      fetchCourses(); // Refresh list
    } catch (err) {
      alert("Failed to add lecture");
    } finally {
      setLectureBusy(false);
    }
  }

  async function onDeleteCourse(id: string) {
    if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete course');
      fetchCourses();
    } catch (err) {
      alert("Failed to delete course");
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4 border p-4 rounded-lg bg-card">
        <h2 className="text-lg font-semibold">Upload New Course</h2>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Category</Label>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Price</Label>
              <Input value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1" placeholder="e.g. ₹499 or Free" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Duration</Label>
              <Input value={duration} onChange={(e) => setDuration(e.target.value)} className="mt-1" placeholder="e.g. 6 hours" />
            </div>
            <div>
              <Label>Banner Image</Label>
              <Input type="file" accept="image/*" onChange={handleImageUpload} className="mt-1" />
              {bannerUrl && <img src={bannerUrl} alt="Preview" className="mt-2 h-20 object-cover rounded" />}
            </div>
          </div>
          <div>
            <Label>Syllabus (one item per line)</Label>
            <Textarea value={syllabus} onChange={(e) => setSyllabus(e.target.value)} rows={6} className="mt-1" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1" placeholder="Short summary of the course" />
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={busy}>
              {busy ? 'Uploading…' : 'Upload Course'}
            </Button>
            {msg && <div className="text-sm">{msg}</div>}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Existing Courses</h2>
        <div className="grid gap-4">
          {courses.map(course => (
            <div key={course._id} className="border p-4 rounded-lg bg-card flex flex-col md:flex-row gap-4">
              {course.bannerUrl && (
                <img src={course.bannerUrl} alt={course.title} className="w-full md:w-48 h-32 object-cover rounded" />
              )}
              <div className="flex-1">
                <h3 className="font-bold text-lg">{course.title}</h3>
                <p className="text-sm text-muted-foreground">{course.category} • {course.duration} • {course.price}</p>
                <p className="text-sm mt-2 line-clamp-2">{course.description}</p>
                <div className="mt-4 flex items-center gap-2">
                  <Dialog
                    open={selectedCourseId === course._id}
                    onOpenChange={(open) => {
                      if (!open) {
                        setSelectedCourseId(null);
                        setEditingLectureId(null);
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => openAddLecture(course)}>
                        Add / Edit Lecture
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingLectureId ? `Edit Lecture in ${course.title}` : `Add Lecture to ${course.title}`}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={onSubmitLecture} className="space-y-4 mt-4">
                        <div>
                          <Label>Lecture Title</Label>
                          <Input value={lectureTitle} onChange={e => setLectureTitle(e.target.value)} required />
                        </div>
                        <div>
                          <Label>Video URL</Label>
                          <Input value={lectureVideoUrl} onChange={e => setLectureVideoUrl(e.target.value)} placeholder="https://youtube.com/..." required />
                        </div>
                        <div>
                          <Label>Duration</Label>
                          <Input value={lectureDuration} onChange={e => setLectureDuration(e.target.value)} placeholder="e.g. 15 mins" />
                        </div>
                        <div>
                          <Label>Notes URL</Label>
                          <Input value={lectureNotesUrl} onChange={e => setLectureNotesUrl(e.target.value)} placeholder="https://drive.google.com/..." />
                        </div>
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            id="isPreview" 
                            checked={lectureIsPreview} 
                            onChange={e => setLectureIsPreview(e.target.checked)} 
                            className="h-4 w-4"
                          />
                          <Label htmlFor="isPreview">Free Preview?</Label>
                        </div>
                        <Button type="submit" disabled={lectureBusy} className="w-full">
                          {lectureBusy ? (editingLectureId ? 'Updating...' : 'Adding...') : (editingLectureId ? 'Update Lecture' : 'Add Lecture')}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <div className="text-sm text-muted-foreground ml-2 flex flex-wrap gap-2">
                    <span>{course.lectures?.length || 0} lectures</span>
                    {course.lectures?.map((lec) => (
                      <button
                        key={lec._id}
                        type="button"
                        className="text-xs px-2 py-1 border rounded hover:bg-accent"
                        onClick={() => openEditLecture(course, lec)}
                      >
                        Edit: {lec.title || 'Untitled'}
                      </button>
                    ))}
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => onDeleteCourse(course._id)} className="ml-auto">
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
