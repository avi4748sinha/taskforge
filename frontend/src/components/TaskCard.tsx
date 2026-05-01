import { Calendar, CheckCircle2 } from "lucide-react";
import type { Task } from "../types";

const priorityLabels = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High"
};

export function TaskCard({ task, onAdvance }: { task: Task; onAdvance?: (task: Task) => void }) {
  return (
    <article className="task-card">
      <div className="task-topline">
        <span className={`priority ${task.priority.toLowerCase()}`}>{priorityLabels[task.priority]}</span>
        {task.dueDate && (
          <span className="muted inline">
            <Calendar size={14} /> {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
      <h3>{task.title}</h3>
      {task.description && <p>{task.description}</p>}
      <div className="task-footer">
        <span>{task.assignedTo?.name ?? "Unassigned"}</span>
        {onAdvance && task.status !== "DONE" && (
          <button className="icon-button" onClick={() => onAdvance(task)} aria-label="Advance status" title="Advance status">
            <CheckCircle2 size={17} />
          </button>
        )}
      </div>
    </article>
  );
}
