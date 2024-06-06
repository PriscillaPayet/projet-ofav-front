import { ICategory, IFilterProps } from '../../@types/interface';

// renders a category filter with "All" and category options.
function Filter({
  showFilter,
  categories,
  selectedCategory,
  onCategoryChange,
}: IFilterProps) {
  if (!showFilter) {
    return null; // Do not render anything if showFilter is false
  }

  return (
    <div>
      <h2 className="text-center mb-4 font-bold">Filtrer par catégorie:</h2>
      <ul>
        {/* Add an "All" option */}
        <li key="all" className="my-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="all"
              checked={!selectedCategory} //  If "selectedCategory" is empty, the "All" option is checked
              onChange={() => onCategoryChange('')} // Calling onCategoryChange with an empty string resets the selection
              className="mr-2 cursor-pointer"
            />
            <span>Aucune</span>
          </label>
        </li>
        {categories.map((category: ICategory) => (
          <li key={category.id} className="my-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value={category.name}
                checked={selectedCategory === category.name}
                onChange={() => onCategoryChange(category.name)}
                className="mr-2 cursor-pointer"
              />
              <span>{category.name}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Filter;
