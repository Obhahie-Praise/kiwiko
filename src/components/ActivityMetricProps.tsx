type ActivityMetricProps = {
  item: {
    id: string;
    title: string;
    value: number;
    suffix: string;
    delta?: string;
    meta?: string;
    tag?: string;
    icon: any;
  };
};

function ActivityMetricCard({ item }: ActivityMetricProps) {
  return (
    <div className="col-span-4 border border-zinc-200 border-l-2 rounded-2xl p-4 group relative">
      {item.tag && (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] py-0.5 px-1 border bg-zinc-100 border-zinc-300 text-zinc-500 rounded-sm">
          {item.tag}
        </span>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-sm text-zinc-500">
          {item.title}
        </h3>
          <item.icon  className="w-4 h-4 text-zinc-500" />
      </div>

      <div className="mt-4">
        <div className="flex items-start gap-1">
          <p className="text-4xl font-semibold text-zinc-900">
            {item.value}
          </p>
          <span className="text-xs font-medium text-zinc-600 mb-1">
            {item.suffix}
          </span>
        </div>

        <div className="text-xs text-zinc-500 text-right">
          {item.delta && (
            <p>
              <span className="text-green-500">
                {item.delta.split(" ")[0]}
              </span>{" "}
              {item.delta.replace(item.delta.split(" ")[0], "")}
            </p>
          )}
          {item.meta && <p>{item.meta}</p>}
        </div>
      </div>
    </div>
  );
}


export default ActivityMetricCard