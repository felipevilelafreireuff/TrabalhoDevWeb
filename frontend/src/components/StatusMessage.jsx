export default function StatusMessage({ children, type = "info" }) {
  if (!children) return null;

  return (
    <div className={`status-message status-${type}`} role="status">
      {children}
    </div>
  );
}
