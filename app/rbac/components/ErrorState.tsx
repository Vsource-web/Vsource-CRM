interface Props {
  title?: string;

  description?: string;
}

export default function ErrorState({
  title = "Something went wrong",
  description = "Unable to load data",
}: Props) {
  return (
    <div className="flex h-100 flex-col items-center justify-center rounded-lg border">
      <h2 className="text-lg font-semibold">{title}</h2>

      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
