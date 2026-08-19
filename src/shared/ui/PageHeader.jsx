/**
 * @param {{ title: string, description?: string, action?: React.ReactNode }} props
 */
export function PageHeader({ title, description, action }) {
  return (
    <div className="flex items-start justify-between border-b border-[--color-border] px-6 py-5">
      <div>
        <h1 className="text-lg font-semibold">{title}</h1>
        {description && <p className="mt-0.5 text-sm text-[--color-muted]">{description}</p>}
      </div>
      {action && <div className="ml-4">{action}</div>}
    </div>
  );
}
