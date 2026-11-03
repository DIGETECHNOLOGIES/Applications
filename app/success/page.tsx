export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-xl">
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          ✓
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Application Received!</h1>
        <p className="text-slate-300 text-sm mb-6">
          Thank you for applying to join the DIGETECH KASH team. We will review your application and reach out via WhatsApp/Email if you are selected.
        </p>
        <a
          href="/"
          className="inline-block bg-slate-800 hover:bg-slate-700 text-white font-medium px-6 py-3 rounded-lg transition duration-200 text-sm"
        >
          Back to Home
        </a>
      </div>
    </main>
  );
}