import { IRessourceTextProps } from '../../@types/interface';

// component for rendering text-based resources within a collection. It displays a block of text content and optionally provides a delete button
function RessourceText({
  text,
  onDelete,
  hideDeleteButton,
}: IRessourceTextProps) {
  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-lg w-11/12 p-3 mb-3 mx-auto sm:max-w-2xl relative">
      <p className="mr-4">{text}</p>
      {!hideDeleteButton && (
        <button
          type="button"
          onClick={onDelete}
          className="absolute top-0 right-0 mt-0 mr-0 rounded-full bg-gray-400 text-white w-6 h-6 flex items-center justify-center text-xs font-bold focus:outline-none"
        >
          x
        </button>
      )}
    </div>
  );
}

export default RessourceText;
