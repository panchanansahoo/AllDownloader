export default function ResultCard({ result }) {
  if (!result) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
      <div className="glass rounded-[2rem] p-6 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <div className="overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-900">
            <img
              src={result.thumbnail}
              alt={result.title || "Video thumbnail"}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600 dark:text-blue-400">
                {result.platform || "Unknown platform"}
              </p>
              <h2 className="text-2xl font-bold sm:text-3xl">{result.title || "Video result"}</h2>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                {result.message}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-slate-100 px-3 py-2 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                Format: {result.selectedFormat || "mp4"}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-2 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                Quality: {result.selectedQuality || "auto"}
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              {result.downloadOptions?.length ? (
                result.downloadOptions.map((option) => (
                  <button
                    key={`${option.platform}-${option.label}`}
                    type="button"
                    disabled={!option.available}
                    className="rounded-2xl border px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 dark:disabled:border-slate-800 dark:disabled:bg-slate-900 dark:disabled:text-slate-500"
                  >
                    {option.label}
                  </button>
                ))
              ) : (
                <span className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
                  No direct download options available for this link.
                </span>
              )}
            </div>

            {result.downloadUrl ? (
              <a
                href={result.downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.01] dark:bg-white dark:text-slate-950"
              >
                Open media page
              </a>
            ) : null}

            <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
              Only download content you own or are authorized to download. YouTube downloads may be restricted by platform terms.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
