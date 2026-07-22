export interface Profile {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  createdAt: string;
}

export type CourseStatus = "published" | "draft";

export interface Course {
  id: string;
  title: string;
  description: string;
  longDescription: string[];
  price: number;
  learnPoints: string[];
  status: CourseStatus;
  thumbnailUrl?: string;
  createdAt: string;
  sections: Section[];
}

export interface Section {
  id: string;
  courseId: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  sectionId: string;
  courseId: string;
  title: string;
  duration: number;
  order: number;
  isPreview: boolean;
  blocks: ContentBlock[];
}

export interface VideoBlock {
  id: string;
  type: "video";
  title?: string;
  video_url: string;
}

export interface TextBlock {
  id: string;
  type: "text";
  title?: string;
  content: string;
}

export type ContentBlock = VideoBlock | TextBlock;

export interface Purchase {
  id: string;
  userId: string;
  courseId: string;
  pricePaid: number;
  purchasedAt: string;
}

export interface VideoView {
  id: string;
  userId: string;
  lessonId: string;
  watchedSeconds: number;
  completed: boolean;
  lastWatchedAt: string;
}
