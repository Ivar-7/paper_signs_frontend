/**
 * @param {{ title: string, description?: string, action?: React.ReactNode }} props
 */
export function PageHeader({ title, description, action }) {
  return (
    <div className="flex items-center justify-between border-b border-[#1a2337] bg-[#090d18]/40 backdrop-blur-md px-6 lg:px-8 py-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[--color-text]">{title}</h1>
        {description && <p className="mt-0.5 text-xs text-[--color-muted]">{description}</p>}
      </div>
      {action && <div className="ml-4">{action}</div>}
    </div>
  );
}
