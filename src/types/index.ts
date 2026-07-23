export type CourseStatus = "published" | "draft";

export interface Section {
  id: string;
  courseId: string;
  title: string;
  order: number;
  status: CourseStatus;
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
  status: CourseStatus;
  blocks: ContentBlock[];
}

export interface VideoBlock {
  id: string;
  type: "video";
  title?: string;
  video_url: string;
}

export interface VideoFileBlock {
  id: string;
  type: "video_file";
  title?: string;
  video_url: string;
}

export interface TextBlock {
  id: string;
  type: "text";
  title?: string;
  content: string;
}

export type ContentBlock = VideoBlock | VideoFileBlock | TextBlock;
