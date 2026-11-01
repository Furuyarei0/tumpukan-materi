import { motion } from "framer-motion";
import { BookOpen, GraduationCap } from "lucide-react";

export function CourseCard({ course, position, layoutId, onOpen, onDragEnd, onPointerDown, interactionEnabled }) {
  const { offset, scale, rotate, depth } = position;
  return (
    <motion.button
      type="button"
      className={`course-card course-${course.color} ${course.name.length > 30 ? "course-card-long" : ""} ${depth === 0 ? "course-card-front" : "course-card-peek"}`}
      style={{ x: offset, scale, rotate, zIndex: 10 - Math.abs(depth) }}
      drag={depth === 0 && interactionEnabled ? "x" : false}
      dragConstraints={{ left: -360, right: 360 }}
      dragElastic={0.14}
      dragMomentum={false}
      layoutId={depth === 0 ? layoutId : undefined}
      onPointerDown={depth === 0 && interactionEnabled ? onPointerDown : undefined}
      onDragEnd={depth === 0 && interactionEnabled ? onDragEnd : undefined}
      onClick={depth === 0 && interactionEnabled ? onOpen : undefined}
      aria-label={`Buka folder ${course.name}`}
      aria-hidden={depth !== 0}
      tabIndex={depth === 0 && interactionEnabled ? 0 : -1}
      animate={{ x: offset, scale, rotate }}
      transition={{ type: "spring", stiffness: 190, damping: 24 }}
    >
      <span className="course-card-top">
        <span className="course-index"><BookOpen size={16} aria-hidden="true" /> Folder materi</span>
        <GraduationCap size={22} aria-hidden="true" />
      </span>
      <span className="course-card-content">
        <strong>{course.name}</strong>
        <span className="course-lecturer">{course.lecturer}</span>
        <span className="course-credits">{course.credits} SKS</span>
      </span>
    </motion.button>
  );
}
