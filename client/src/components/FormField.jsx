function FormField({ id, label, className = "", ...inputProps }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id}>{label}</label>

      <input id={id} className="border rounded p-1" {...inputProps} />
    </div>
  );
}

export default FormField;
