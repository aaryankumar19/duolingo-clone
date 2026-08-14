/**
 * This nested layout uses a fixed full-screen overlay to completely
 * hide the parent (app) layout (sidebar + header + dark bg) during lessons.
 * It renders on top of everything via fixed positioning.
 */
export default function LessonLayoutOverride({ children }: { children: React.ReactNode }) {
  return children;
}
