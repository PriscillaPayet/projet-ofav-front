// le type pour les collections
export interface ICollection {
  // map error TS2339: Property 'x' does not exist on type 'Y'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
  //
  id: number;
  title: string;
  picture: string;
  published: number;
  description: string;
  category: ICategory;
  ressource: IRessources[];
  user: IUser;
  countOfLikes: number;
}
// on definit une interface pour les props du composant
export interface ICollectionsProps {
  collections: ICards[]; // le prop posts doit etre un tableau de ICollection
}

export interface ICards {
  cards: ICollection[];
  categories?: ICategory[];
}

export interface IRessources {
  id: number;
  content: string;
  type: number;
  url: string;
  images: string[];
  title: string;
  description: string;
}

export interface IRessourcesURL {
  metadata: IMetadata;
  onDelete?: () => void;
  hideDeleteButton?: IDelete;
}

export interface IRessourcesText {
  text: string;
  onDelete?: () => void;
}

export interface IMetadata {
  title: string;
  description: string;
  images: string[];
  url: string;
  onDelete?: () => void;
}

export interface ICategory {
  id: number;
  name: string;
}

export interface IUsers {
  // map error TS2339: Property 'x' does not exist on type 'Y'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
  //
  users: IUser[];
}

export interface IUser {
  password: string;
  id: number;
  email: string;
  username: string;
  card: ICollection;
  picture: string;
}

export interface ILog {
  isLogged: boolean;
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IFilterProps {
  showFilter: boolean;
  categories: ICategory[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export interface IPaginationProps {
  collectionsPerPage: number;
  totalCollections: number;
  currentPage: number;
  onPageChange: (pageNumber: number) => void;
}

export interface ISearchBarProps {
  onSearch: (query: string) => void;
}

export interface IRessourceURLProps extends IMetadata {
  hideDeleteButton?: IDelete;
}

export interface IRessourceTextProps extends IRessourcesText {
  hideDeleteButton?: IDelete;
}

export interface IDelete {
  hideDeleteButton: boolean;
}

export interface IMyCollection extends ICollection {
  myCollection?: string;
}
