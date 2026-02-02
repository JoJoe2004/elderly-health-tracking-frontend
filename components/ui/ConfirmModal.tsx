type Props = {
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmModal({ title, description, onCancel, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md text-center space-y-4 animate-scaleIn">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-red-600 text-3xl">!</span>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-500 text-sm">{description}</p>

        <div className="flex justify-center gap-3 pt-4">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-300"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-800"
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
}
