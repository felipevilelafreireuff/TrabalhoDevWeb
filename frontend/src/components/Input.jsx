export default function Input({
  error,
  id,
  label,
  className = "",
  ...props
}) {
  return (
    <div className="form-group">
      {label ? (
        <label className="form-label" htmlFor={id}>
          {label}
        </label>
      ) : null}
      <input
        id={id}
        className={["form-input", error ? "error" : "", className]
          .filter(Boolean)
          .join(" ")}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error ? (
        <span className="form-error visible" id={`${id}-error`} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
