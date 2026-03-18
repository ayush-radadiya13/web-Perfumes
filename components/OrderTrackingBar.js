'use client';

const STEPS = [
  { key: 'placed', label: 'Order placed', match: (s) => ['pending', 'paid'].includes(s) },
  { key: 'shipped', label: 'Shipped', match: (s) => s === 'shipped' || s === 'delivered' },
  { key: 'delivered', label: 'Delivered', match: (s) => s === 'delivered' },
];

export default function OrderTrackingBar({ status }) {
  const s = (status || 'pending').toLowerCase();
  const cancelled = s === 'cancelled';

  if (cancelled) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800 text-sm font-medium">
        This order was cancelled.
      </div>
    );
  }

  let activeIndex = 0;
  if (STEPS[2].match(s)) activeIndex = 2;
  else if (STEPS[1].match(s)) activeIndex = 1;
  else activeIndex = 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2 mb-2">
        {STEPS.map((step, i) => {
          const done = i <= activeIndex;
          return (
            <div key={step.key} className="flex-1 flex flex-col items-center min-w-0">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition ${
                  done ? 'bg-gold text-ink' : 'bg-ink/10 text-ink/40'
                }`}
              >
                {done ? '✓' : i + 1}
              </div>
              <span
                className={`text-xs mt-2 text-center font-medium ${
                  done ? 'text-ink' : 'text-ink/45'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="h-2 rounded-full bg-ink/10 overflow-hidden flex">
        <div
          className="h-full bg-gradient-to-r from-plum to-gold transition-all duration-500"
          style={{ width: `${((activeIndex + 1) / STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
