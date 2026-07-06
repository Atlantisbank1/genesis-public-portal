type Props = {
  eyebrow: string;
  title: string;
  description?: string;
};

export default function SectionTitle({
  eyebrow,
  title,
  description,
}: Props) {
  return (
    <>

      <p className="eyebrow">
        {eyebrow}
      </p>

      <h2>
        {title}
      </h2>

      {description && (
        <p>
          {description}
        </p>
      )}

    </>
  );
}