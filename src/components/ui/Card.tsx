type CardProps = {
  title: string;
  value?: string;
  children?: React.ReactNode;
};

export default function Card({
  title,
  value,
  children,
}: CardProps) {
  return (
    <article className="genesisCard">

      <span className="genesisCardTitle">
        {title}
      </span>

      {value && (
        <strong className="genesisCardValue">
          {value}
        </strong>
      )}

      {children}

    </article>
  );
}