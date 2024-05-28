type Props = {
  title: string;
  value: number;
};

export function ResumeItem({ title, value }: Props) {
  const colorText =
    title === "Valore Speso"
      ? "text-red-600"
      : value >= 0
      ? "text-green-600"
      : "text-red-600";
  return (
    <div className="flex-1">
      <div className="text-center font-bold text-gray-400 mb-1">{title}</div>
      <div className={`text-center text-xl font-bold ${colorText}`}>
        {parseFloat(value.toFixed(2)).toLocaleString("ita", {
          style: "currency",
          currency: "EUR",
        })}
      </div>
    </div>
  );
}
